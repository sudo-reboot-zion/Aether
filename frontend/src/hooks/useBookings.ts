import { useCallback, useState } from 'react';
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
import { getUserBookings, canReleasePayment } from '@/lib/escrow';
import { userSession } from '@/lib/stacks';
import {
    bookProperty as bookPropertyTx,
    releasePayment as releasePaymentTx,
    cancelBooking as cancelBookingTx
} from '@/lib/escrow';
import { openContractCall } from '@stacks/connect';
import { NETWORK } from '@/lib/config';
import {
    Pc,
} from "@stacks/transactions";
import { useToast } from './useToast';

const APP_DETAILS = {
    name: 'Aether',
    icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '/logo.png',
};

export function useBookings(userAddress?: string) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { items: bookings, lastFetched, isLoading, error } = useSelector(
        (state: RootState) => state.bookings
    );
    const [isReleasing, setIsReleasing] = useState(false);

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

            const txOptions = bookPropertyTx({
                propertyId,
                checkIn,
                checkOut,
                numNights,
            });

            const tempId = -Date.now();

            await openContractCall({
                ...txOptions,
                userSession,
                network: NETWORK,
                appDetails: APP_DETAILS,
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
                },
                onCancel: () => {
                    toast({
                        title: 'Booking Cancelled',
                        description: 'You cancelled the wallet transaction.',
                    });
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
        if (bookingId < 0) {
            toast({
                title: 'Booking Pending Confirmation',
                description: 'This booking is still waiting for on-chain confirmation. Please wait a moment before releasing payment.',
                variant: 'destructive',
            });
            return;
        }

        setIsReleasing(true);
        try {
            // Pre-flight check: ask the contract if release is possible
            const canRelease = await canReleasePayment(bookingId);
            if (!canRelease) {
                toast({
                    title: 'Cannot Release Yet',
                    description: 'The contract rejected the release. The booking may not be confirmed yet, or the check-in block has not been reached.',
                    variant: 'destructive',
                });
                setIsReleasing(false);
                return;
            }

            const txOptions = releasePaymentTx(bookingId);
            await openContractCall({
                ...txOptions,
                userSession,
                network: NETWORK,
                appDetails: APP_DETAILS,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'badge', // often mints a badge
                        optimisticData: { bookingId }
                    }));
                    toast({
                        title: 'Release Initiated',
                        description: `Payment release submitted! TX: ${data.txId.slice(0, 10)}...`,
                    });
                    setIsReleasing(false);
                },
                onCancel: () => {
                    toast({
                        title: 'Release Cancelled',
                        description: 'You dismissed the wallet. No payment was released.',
                    });
                    setIsReleasing(false);
                }
            });
        } catch (err) {
            console.error('[useBookings] releasePayment error:', err);
            toast({
                title: 'Error',
                description: 'Failed to release payment. Please try again.',
                variant: 'destructive',
            });
            setIsReleasing(false);
        }
    }, [dispatch, toast]);

    const cancelBooking = useCallback(async (bookingId: number) => {
        try {
            const txOptions = cancelBookingTx(bookingId);
            await openContractCall({
                ...txOptions,
                userSession,
                network: NETWORK,
                appDetails: APP_DETAILS,
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
                },
                onCancel: () => {
                    toast({
                        title: 'Cancellation Aborted',
                        description: 'You dismissed the wallet. Booking was not cancelled.',
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
        isReleasing,
        error,
        fetchUserBookings,
        bookProperty,
        releasePayment,
        cancelBooking
    };
}
