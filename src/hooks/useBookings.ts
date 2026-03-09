import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import {
    setLoading,
    setBookings,
    setError,
    addOptimisticBooking,
    selectIsStale
} from '@/redux/slices/bookingsSlice';
import { addPendingTx } from '@/redux/slices/pendingTxSlice';
import { getUserBookings } from '@/lib/escrow';
import {
    bookProperty as bookPropertyTx,
    releasePayment as releasePaymentTx,
    cancelBooking as cancelBookingTx
} from '@/lib/escrow';
import { openContractCall } from '@stacks/connect';
import {
    Pc,
} from "@stacks/transactions";
import { useToast } from './useToast';

export function useBookings(userAddress?: string) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { items: bookings, lastFetched, isLoading, error } = useSelector(
        (state: RootState) => state.bookings
    );

    const fetchUserBookings = useCallback(async (address: string, force = false) => {
        if (!force && !selectIsStale(lastFetched)) {
            return;
        }

        dispatch(setLoading(true));
        try {
            const data = await getUserBookings(address);
            dispatch(setBookings(data));
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch bookings';
            dispatch(setError(msg));
            toast({
                title: 'Error',
                description: msg,
                variant: 'destructive',
            });
        }
    }, [dispatch, lastFetched, toast]);


    const bookProperty = useCallback(async (
        propertyId: number,
        checkIn: number,
        checkOut: number,
        numNights: number,
        pricePerNight: number,
        guestAddress: string,
        hostAddress: string,
        onSuccess?: (txId: string) => void
    ) => {
        try {
            // Calculate total amount in microstacks (base + 2% platform fee)
            const platformFee = Math.floor((pricePerNight * numNights * 2) / 100);
            const totalAmountMicroStacks = (pricePerNight * numNights) + platformFee;

            // Create post-condition to authorize the STX transfer
            const postCondition = Pc.principal(guestAddress).willSendEq(totalAmountMicroStacks).ustx();

            const txOptions = await bookPropertyTx({
                propertyId,
                checkIn,
                checkOut,
                numNights,
            });

            const tempId = -Date.now();

            await openContractCall({
                ...txOptions,
                postConditions: [postCondition],
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'booking',
                        optimisticData: { tempId, propertyId, checkIn, checkOut }
                    }));

                    dispatch(addOptimisticBooking({
                        id: tempId,
                        propertyId,
                        guest: guestAddress,
                        host: hostAddress,
                        checkIn,
                        checkOut,
                        totalAmount: 0,
                        platformFee: 0,
                        hostPayout: 0,
                        status: 'pending',
                        createdAt: Math.floor(Date.now() / 1000),
                        escrowedAmount: 0,
                        optimistic: true
                    }));

                    toast({
                        title: 'Booking Requested',
                        description: 'Your booking transaction has been submitted.',
                    });

                    if (onSuccess) onSuccess(data.txId);
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to initiate booking',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    const releasePayment = useCallback(async (bookingId: number) => {
        try {
            const txOptions = await releasePaymentTx(bookingId);
            await openContractCall({
                ...txOptions,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'badge', // often mints a badge
                        optimisticData: { bookingId }
                    }));
                    toast({
                        title: 'Release Initiated',
                        description: 'Payment release transaction submitted.',
                    });
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to release payment',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    const cancelBooking = useCallback(async (bookingId: number) => {
        try {
            const txOptions = await cancelBookingTx(bookingId);
            await openContractCall({
                ...txOptions,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'booking',
                        optimisticData: { bookingId, action: 'cancel' }
                    }));
                    toast({
                        title: 'Cancellation Initiated',
                        description: 'Cancellation transaction submitted.',
                    });
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to cancel booking',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    return {
        bookings,
        isLoading,
        error,
        fetchUserBookings,
        bookProperty,
        releasePayment,
        cancelBooking
    };
}
