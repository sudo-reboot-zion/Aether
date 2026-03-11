import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openContractCall } from '@stacks/connect';
import { useToast } from './useToast';
import { addPendingTx } from '@/redux/slices/pendingTxSlice';
import {
    getSavedProperties as getSavedPropertiesApi,
    saveProperty as savePropertyTx,
    getUserPreferences as getUserPreferencesApi,
    setPreferences as setPreferencesTx
} from '@/lib/profile';

export function useProfile() {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const fetchSavedProperties = useCallback(async (userAddress: string) => {
        setIsLoading(true);
        try {
            return await getSavedPropertiesApi(userAddress);
        } catch (error) {
            console.error('Error fetching saved properties:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUserPreferences = useCallback(async (userAddress: string) => {
        setIsLoading(true);
        try {
            return await getUserPreferencesApi(userAddress);
        } catch (error) {
            console.error('Error fetching user preferences:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveProperty = useCallback(async (propertyId: number) => {
        try {
            const txOptions = await savePropertyTx(propertyId);

            await openContractCall({
                ...txOptions,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'profile_update',
                        optimisticData: { propertyId, action: 'save' }
                    }));

                    toast({
                        title: 'Property Saved',
                        description: 'Your favorite property is being recorded on the blockchain.',
                    });
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to save property',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    const updatePreferences = useCallback(async (vibes: number[], amenities: number[]) => {
        try {
            const txOptions = await setPreferencesTx({ vibes, amenities });

            await openContractCall({
                ...txOptions,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'profile_update',
                        optimisticData: { vibes, amenities, action: 'preferences' }
                    }));

                    toast({
                        title: 'Preferences Updated',
                        description: 'Your travel protocol has been updated on-chain.',
                    });
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to update preferences',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    return {
        isLoading,
        fetchSavedProperties,
        fetchUserPreferences,
        saveProperty,
        updatePreferences
    };
}
