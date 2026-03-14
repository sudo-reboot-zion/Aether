import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPendingTx } from '@/redux/slices/pendingTxSlice';
import { raiseDispute as raiseDisputeTx } from '@/lib/dispute';
import { getDispute, getBookingDispute } from '@/lib/dispute';
import { openContractCall } from '@stacks/connect';
import { userSession } from '@/lib/stacks';
import { useToast } from './useToast';

export function useDispute(initialBookingId?: number) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const raiseDispute = useCallback(async (reason: string, evidence: string, targetBookingId?: number) => {
        const id = targetBookingId !== undefined ? targetBookingId : initialBookingId;
        if (id === undefined) {
            console.error('No booking ID provided for dispute');
            return;
        }

        try {
            const txOptions = await raiseDisputeTx({
                bookingId: id,
                reason,
                evidence,
            });

            await openContractCall({
                ...txOptions,
                userSession,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'dispute',
                        optimisticData: { bookingId: id, reason }
                    }));

                    toast({
                        title: 'Dispute Raised',
                        description: 'Your dispute transaction has been submitted.',
                    });
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to initiate dispute',
                variant: 'destructive',
            });
        }
    }, [initialBookingId, dispatch, toast]);

    const fetchDisputeStatus = useCallback(async (bookingId: number) => {
        setIsLoading(true);
        try {
            const disputeInfo = await getBookingDispute(bookingId);
            if (disputeInfo?.exists) {
                const details = await getDispute(disputeInfo.disputeId);
                return { disputeId: disputeInfo.disputeId, ...details };
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resolveDispute = useCallback(async (disputeId: number, resolution: string, refundPercentage: number) => {
        try {
            const { resolveDispute: resolveDisputeTx } = await import('@/lib/dispute');
            const txOptions = await resolveDisputeTx({
                disputeId,
                resolution,
                refundPercentage,
            });

            await openContractCall({
                ...txOptions,
                userSession,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'dispute',
                        optimisticData: { disputeId, resolution, action: 'resolve' }
                    }));

                    toast({
                        title: 'Dispute Resolved',
                        description: 'Resolution transaction has been submitted.',
                    });
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to resolve dispute',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    return {
        raiseDispute,
        resolveDispute,
        fetchDisputeStatus,
        isLoading
    };
}
