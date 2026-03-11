import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '@/lib/escrow';
import { PropertyMetadata } from '@/lib/ipfs';

export interface CachedProperty extends Property {
    id: number;
    optimistic?: boolean; 
    metadata?: PropertyMetadata;
}

interface PropertiesState {
    items: CachedProperty[];
    lastFetched: number | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: PropertiesState = {
    items: [],
    lastFetched: null,
    isLoading: false,
    error: null,
};

const CACHE_TTL_MS = 5 * 60 * 1000;

const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setProperties(state, action: PayloadAction<CachedProperty[]>) {
        
            const optimistic = state.items.filter(p => p.optimistic);
            const confirmed = action.payload;
            const optimisticNotYetConfirmed = optimistic.filter(
                op => !confirmed.some(c => c.id === op.id)
            );
            state.items = [...confirmed, ...optimisticNotYetConfirmed];
            state.lastFetched = Date.now();
            state.isLoading = false;
            state.error = null;
        },
        addOptimisticProperty(state, action: PayloadAction<CachedProperty>) {
            state.items.unshift({ ...action.payload, optimistic: true });
        },
        confirmOptimisticProperty(state, action: PayloadAction<{ tempId: number; realId: number }>) {
            const item = state.items.find(p => p.id === action.payload.tempId);
            if (item) {
                item.id = action.payload.realId;
                item.optimistic = false;
            }
        },
        removeOptimisticProperty(state, action: PayloadAction<number>) {
            state.items = state.items.filter(p => p.id !== action.payload);
        },
        updatePropertyMetadata(state, action: PayloadAction<{ id: number; metadata: PropertyMetadata }>) {
            const item = state.items.find(p => p.id === action.payload.id);
            if (item) {
                item.metadata = action.payload.metadata;
            }
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setLoading,
    setProperties,
    addOptimisticProperty,
    confirmOptimisticProperty,
    removeOptimisticProperty,
    updatePropertyMetadata,
    setError,
} = propertiesSlice.actions;

export const selectIsStale = (lastFetched: number | null) =>
    !lastFetched || Date.now() - lastFetched > CACHE_TTL_MS;

export default propertiesSlice.reducer;
