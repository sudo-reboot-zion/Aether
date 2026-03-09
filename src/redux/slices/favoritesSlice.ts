import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSavedProperties as fetchSavedPropertiesApi } from '@/lib/profile/read';

interface FavoritesState {
    savedIds: number[];
    isFetching: boolean;
    error: string | null;
}

const initialState: FavoritesState = {
    savedIds: [],
    isFetching: false,
    error: null,
};

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (userAddress: string) => {
        return await fetchSavedPropertiesApi(userAddress);
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<number>) => {
            if (!state.savedIds.includes(action.payload)) {
                state.savedIds.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<number>) => {
            state.savedIds = state.savedIds.filter(id => id !== action.payload);
        },
        setFavorites: (state, action: PayloadAction<number[]>) => {
            state.savedIds = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.isFetching = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.isFetching = false;
                state.savedIds = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.error.message || 'Failed to fetch favorites';
            });
    },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
