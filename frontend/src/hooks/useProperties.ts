import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import {
    setLoading,
    setProperties,
    setError,
    addOptimisticProperty,
    updatePropertyMetadata,
    selectIsStale
} from '@/redux/slices/propertiesSlice';
import { addPendingTx } from '@/redux/slices/pendingTxSlice';
import { getAllProperties } from '@/lib/escrow';
import { listProperty as listPropertyTx } from '@/lib/escrow';
import { userSession } from '@/lib/stacks';
import { openContractCall } from '@stacks/connect';
import { useToast } from './useToast';
import { fetchIPFSMetadata } from '@/lib/ipfs';

export function useProperties() {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { items: properties, lastFetched, isLoading, error } = useSelector(
        (state: RootState) => state.properties
    );

    const fetchProperties = useCallback(async (force = false) => {
        if (!force && !selectIsStale(lastFetched)) {
            return;
        }

        dispatch(setLoading(true));
        try {
            const data = await getAllProperties();
            dispatch(setProperties(data));

            // Fetch metadata in the background for all properties
            data.forEach(async (p: any) => {
                if (p.metadataUri) {
                    try {
                        const meta = await fetchIPFSMetadata(p.metadataUri);
                        if (meta) {
                            dispatch(updatePropertyMetadata({ id: p.id, metadata: meta }));
                        }
                    } catch (e) {
                        console.error('Failed to fetch metadata for', p.id, e);
                    }
                }
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch properties';
            dispatch(setError(msg));
            toast({
                title: 'Error',
                description: msg,
                variant: 'destructive',
            });
        }
    }, [dispatch, lastFetched, toast]);

    const listProperty = useCallback(async (
        pricePerNight: number,
        locationTag: number,
        categoryTag: number,
        metadataUri: string,
        guestAddress: string // Owner
    ) => {
        try {
            const txOptions = await listPropertyTx({
                pricePerNight,
                locationTag,
                categoryTag,
                metadataUri,
            });

            // Use a temporary ID for optimistic item (e.g., negative timestamp)
            const tempId = -Date.now();

            await openContractCall({
                ...txOptions,
                userSession,
                onFinish: (data) => {
                    console.log('✅ Listing transaction submitted:', data.txId);

                    // 1. Add to pending transactions
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'listing',
                        optimisticData: { tempId, pricePerNight, locationTag, categoryTag, metadataUri }
                    }));

                    // 2. Add optimistic item to UI
                    dispatch(addOptimisticProperty({
                        id: tempId,
                        owner: guestAddress,
                        pricePerNight,
                        locationTag,
                        categoryTag,
                        metadataUri,
                        active: true,
                        createdAt: Math.floor(Date.now() / 1000), // Approximate block height
                        optimistic: true
                    }));

                    toast({
                        title: 'Property Listed',
                        description: 'Your property is being added to the blockchain.',
                    });
                },
                onCancel: () => {
                    console.log('❌ Listing transaction cancelled');
                }
            });
        } catch (err) {
            console.error('Error listing property:', err);
            toast({
                title: 'Error',
                description: 'Failed to initiate listing transaction',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    return {
        properties,
        isLoading,
        error,
        fetchProperties,
        listProperty
    };
}
