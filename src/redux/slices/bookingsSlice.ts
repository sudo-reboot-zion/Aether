import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking, BookingStatus } from '@/lib/escrow';

export interface CachedBooking extends Booking {
    id: number;
    optimistic?: boolean;
}

interface BookingsState {
    items: CachedBooking[];
    lastFetched: number | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BookingsState = {
    items: [],
    lastFetched: null,
    isLoading: false,
    error: null,
};

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes (bookings change more often)

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setBookings(state, action: PayloadAction<CachedBooking[]>) {
            const optimistic = state.items.filter(b => b.optimistic);
            const confirmed = action.payload;
            const optimisticNotYetConfirmed = optimistic.filter(
                ob => !confirmed.some(c => c.id === ob.id)
            );
            state.items = [...confirmed, ...optimisticNotYetConfirmed];
            state.lastFetched = Date.now();
            state.isLoading = false;
            state.error = null;
        },
        addOptimisticBooking(state, action: PayloadAction<CachedBooking>) {
            state.items.unshift({ ...action.payload, optimistic: true });
        },
        confirmOptimisticBooking(state, action: PayloadAction<{ tempId: number; realId: number }>) {
            const item = state.items.find(b => b.id === action.payload.tempId);
            if (item) {
                item.id = action.payload.realId;
                item.optimistic = false;
                item.status = 'confirmed';
            }
        },
        removeOptimisticBooking(state, action: PayloadAction<number>) {
            state.items = state.items.filter(b => b.id !== action.payload);
        },
        updateBookingStatus(state, action: PayloadAction<{ id: number; status: BookingStatus }>) {
            const item = state.items.find(b => b.id === action.payload.id);
            if (item) item.status = action.payload.status;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setLoading,
    setBookings,
    addOptimisticBooking,
    confirmOptimisticBooking,
    removeOptimisticBooking,
    updateBookingStatus,
    setError,
} = bookingsSlice.actions;

export const selectIsStale = (lastFetched: number | null) =>
    !lastFetched || Date.now() - lastFetched > CACHE_TTL_MS;

export default bookingsSlice.reducer;
