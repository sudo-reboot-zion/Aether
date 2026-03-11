import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReputationStats {
    totalReviews: number;
    averageRating: number;
    totalBookings?: number;
    totalEarned?: number;
}

interface ReputationState {
    stats: Record<string, ReputationStats>;
    reviews: Record<string, any[]>; // Use specific Review type if easily imported, else any[]
    lastFetched: Record<string, number>;
}

const initialState: ReputationState = {
    stats: {},
    reviews: {},
    lastFetched: {},
};

const reputationSlice = createSlice({
    name: 'reputation',
    initialState,
    reducers: {
        setReputationStats(state, action: PayloadAction<{ address: string; stats: ReputationStats }>) {
            state.stats[action.payload.address] = action.payload.stats;
            state.lastFetched[action.payload.address] = Date.now();
        },
        setReputationReviews(state, action: PayloadAction<{ address: string; reviews: any[] }>) {
            state.reviews[action.payload.address] = action.payload.reviews;
        },
        invalidateUserStats(state, action: PayloadAction<string>) {
            delete state.lastFetched[action.payload];
        },
    },
});

export const { setReputationStats, setReputationReviews, invalidateUserStats } = reputationSlice.actions;
export default reputationSlice.reducer;
