import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import {
    setLoading,
    setUserBadges,
    setBadgeTypes,
    setError,
    selectUserBadgesStale
} from '@/redux/slices/badgesSlice';
import { getAllUserBadges, getAllBadgeTypes, hasBadge as hasBadgeTx } from '@/lib/badge';
import { useToast } from './useToast';

export function useBadges(userAddress?: string) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { userBadges, badgeTypes, lastFetched, isLoading, error } = useSelector(
        (state: RootState) => state.badges
    );

    const fetchBadgeTypes = useCallback(async () => {
        if (badgeTypes.length > 0) return;
        try {
            const types = await getAllBadgeTypes();
            dispatch(setBadgeTypes(types));
        } catch (err) {
            console.error('Failed to fetch badge types:', err);
        }
    }, [dispatch, badgeTypes.length]);

    const fetchUserBadges = useCallback(async (address: string, force = false) => {
        if (!force && !selectUserBadgesStale(lastFetched, address)) {
            return;
        }

        dispatch(setLoading(true));
        try {
            const badges = await getAllUserBadges(address);
            dispatch(setUserBadges({ address, badges }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch badges';
            dispatch(setError(msg));
            toast({
                title: 'Error',
                description: msg,
                variant: 'destructive',
            });
        }
    }, [dispatch, lastFetched, toast]);

    // Initial fetch of types
    useEffect(() => {
        fetchBadgeTypes();
    }, [fetchBadgeTypes]);

    const hasBadge = useCallback(async (address: string, badgeType: number): Promise<boolean> => {
        // Check cache first
        const cached = userBadges[address]?.find(b => b.badgeType === badgeType);
        if (cached) return true;

        try {
            return await hasBadgeTx(address, badgeType);
        } catch (err) {
            return false;
        }
    }, [userBadges]);

    return {
        badges: userAddress ? (userBadges[userAddress] || []) : [],
        badgeTypes,
        isLoading,
        error,
        fetchUserBadges,
        hasBadge
    };
}
