import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReputationStats {
    totalReviews: number;
    averageRating: number;
    totalBookings?: number;
    totalEarned?: number;
}

interface ReputationState {
    stats: Record<string, ReputationStats>;
    receivedReviews: Record<string, any[]>;
    writtenReviews: Record<string, any[]>;
    lastFetched: Record<string, number>;
}

const initialState: ReputationState = {
    stats: {},
    receivedReviews: {},
    writtenReviews: {},
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
        setReceivedReviews(state, action: PayloadAction<{ address: string; reviews: any[] }>) {
            state.receivedReviews[action.payload.address] = action.payload.reviews;
        },
        setWrittenReviews(state, action: PayloadAction<{ address: string; reviews: any[] }>) {
            state.writtenReviews[action.payload.address] = action.payload.reviews;
        },
        invalidateUserStats(state, action: PayloadAction<string>) {
            delete state.lastFetched[action.payload];
        },
    },
});

export const { setReputationStats, setReceivedReviews, setWrittenReviews, invalidateUserStats } = reputationSlice.actions;
export default reputationSlice.reducer;
