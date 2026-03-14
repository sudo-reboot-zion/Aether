import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { addPendingTx } from '@/redux/slices/pendingTxSlice';
import { setReputationStats, setReputationReviews } from '@/redux/slices/reputationSlice';
import { submitReview as submitReviewTx, getUserStats, hasReviewed, getReviewsByUser } from '@/lib/reputation';
import { openContractCall } from '@stacks/connect';
import { userSession } from '@/lib/stacks';
import { useToast } from './useToast';

export function useReputation(userAddress?: string) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const allStats = useSelector((state: RootState) => state.reputation.stats);
    const allReviews = useSelector((state: RootState) => state.reputation.reviews);
    const lastFetched = useSelector((state: RootState) => state.reputation.lastFetched);

    const submitReview = useCallback(async (
        bookingId: number,
        reviewee: string,
        rating: number,
        comment: string
    ) => {
        try {
            const txOptions = await submitReviewTx({
                bookingId,
                reviewee,
                rating,
                comment,
            });

            await openContractCall({
                ...txOptions,
                userSession,
                onFinish: (data) => {
                    dispatch(addPendingTx({
                        txId: data.txId,
                        type: 'review',
                        optimisticData: { bookingId, reviewee, rating }
                    }));

                    toast({
                        title: 'Review Submitted',
                        description: 'Your feedback is being added to the blockchain.',
                    });
                }
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to submit review',
                variant: 'destructive',
            });
        }
    }, [dispatch, toast]);

    const fetchUserStats = useCallback(async (address: string, force = false) => {
        if (!force && lastFetched[address] && (Date.now() - lastFetched[address] < 60000)) {
            return allStats[address];
        }

        setIsLoading(true);
        try {
            const stats = await getUserStats(address);
            if (stats) {
                dispatch(setReputationStats({ address, stats }));
            }
            return stats;
        } finally {
            setIsLoading(false);
        }
    }, [allStats, dispatch, lastFetched]);

    const checkBookingReviewed = useCallback(async (bookingId: number, reviewer: string) => {
        return await hasReviewed(bookingId, reviewer);
    }, []);

    const fetchUserReviews = useCallback(async (address: string) => {
        setIsLoading(true);
        try {
            const reviews = await getReviewsByUser(address);
            if (reviews) {
                dispatch(setReputationReviews({ address, reviews }));
            }
            return reviews;
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    return {
        submitReview,
        fetchUserStats,
        fetchUserReviews,
        checkBookingReviewed,
        reputationStats: userAddress ? allStats[userAddress] : null,
        userReviews: userAddress ? (allReviews[userAddress] || []) : [],
        isLoading
    };
}
