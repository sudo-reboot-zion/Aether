import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import pendingTxReducer from './slices/pendingTxSlice';
import propertiesReducer from './slices/propertiesSlice';
import bookingsReducer from './slices/bookingsSlice';
import badgesReducer from './slices/badgesSlice';
import userReducer from './slices/userSlice';
import reputationReducer from './slices/reputationSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';
import bookingChatReducer from './slices/bookingChatSlice';
import favoritesReducer from './slices/favoritesSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            language: languageReducer,
            pendingTx: pendingTxReducer,
            properties: propertiesReducer,
            bookings: bookingsReducer,
            badges: badgesReducer,
            reputation: reputationReducer,
            search: searchReducer,
            ui: uiReducer,
            chat: chatReducer,
            bookingChat: bookingChatReducer,
            favorites: favoritesReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
