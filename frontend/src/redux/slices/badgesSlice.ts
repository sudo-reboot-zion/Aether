import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BadgeMetadata, BadgeTypeInfo } from '@/lib/badge';

export interface CachedBadge extends BadgeMetadata {
    id: number;
    optimistic?: boolean;
}

interface BadgesState {
    userBadges: Record<string, CachedBadge[]>;
    badgeTypes: BadgeTypeInfo[];
    lastFetched: Record<string, number>;
    isLoading: boolean;
    error: string | null;
}

const initialState: BadgesState = {
    userBadges: {},
    badgeTypes: [],
    lastFetched: {},
    isLoading: false,
    error: null,
};

const CACHE_TTL_MS = 10 * 60 * 1000;

const badgesSlice = createSlice({
    name: 'badges',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setBadgeTypes(state, action: PayloadAction<BadgeTypeInfo[]>) {
            state.badgeTypes = action.payload;
        },
        setUserBadges(state, action: PayloadAction<{ address: string; badges: CachedBadge[] }>) {
            const { address, badges } = action.payload;
            const optimistic = (state.userBadges[address] || []).filter(b => b.optimistic);
            const optimisticNotConfirmed = optimistic.filter(
                ob => !badges.some(b => b.id === ob.id)
            );
            state.userBadges[address] = [...badges, ...optimisticNotConfirmed];
            state.lastFetched[address] = Date.now();
            state.isLoading = false;
            state.error = null;
        },
        addOptimisticBadge(state, action: PayloadAction<{ address: string; badge: CachedBadge }>) {
            const { address, badge } = action.payload;
            if (!state.userBadges[address]) state.userBadges[address] = [];
            state.userBadges[address].push({ ...badge, optimistic: true });
        },
        confirmOptimisticBadge(state, action: PayloadAction<{ address: string; badgeId: number }>) {
            const { address, badgeId } = action.payload;
            const badge = (state.userBadges[address] || []).find(b => b.id === badgeId);
            if (badge) badge.optimistic = false;
        },
        invalidateUserBadges(state, action: PayloadAction<string>) {
            delete state.lastFetched[action.payload];
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setLoading,
    setBadgeTypes,
    setUserBadges,
    addOptimisticBadge,
    confirmOptimisticBadge,
    invalidateUserBadges,
    setError,
} = badgesSlice.actions;

export const selectUserBadgesStale = (lastFetched: Record<string, number>, address: string) =>
    !lastFetched[address] || Date.now() - lastFetched[address] > CACHE_TTL_MS;

export default badgesSlice.reducer;
