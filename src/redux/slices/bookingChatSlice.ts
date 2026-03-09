import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface ChatSession {
    id: number;
    booking_id: number;
    guest_address: string;
    host_address: string;
    partner_address: string;
    is_inquiry: boolean;
    created_at: string;
    last_message?: {
        content: string | null;
        timestamp: string | null;
        sender: string | null;
    };
}

export interface BookingChatState {
    isOpen: boolean;
    activeBookingId: number | null;
    partnerAddress: string | null;
    sessions: ChatSession[];
    isFetchingSessions: boolean;
    hasNotifications: boolean;
}

const initialState: BookingChatState = {
    isOpen: false,
    activeBookingId: null,
    partnerAddress: null,
    sessions: [],
    isFetchingSessions: false,
    hasNotifications: false,
};

export const fetchSessions = createAsyncThunk(
    'bookingChat/fetchSessions',
    async (userAddress: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/ws/chat/sessions/${userAddress}`);
        if (!response.ok) throw new Error('Failed to fetch chat sessions');
        return (await response.json()) as ChatSession[];
    }
);

export const bookingChatSlice = createSlice({
    name: 'bookingChat',
    initialState,
    reducers: {
        openBookingChat: (
            state,
            action: PayloadAction<{ bookingId: number; partnerAddress: string }>
        ) => {
            state.isOpen = true;
            state.activeBookingId = action.payload.bookingId;
            state.partnerAddress = action.payload.partnerAddress;
        },
        closeBookingChat: (state) => {
            state.isOpen = false;
        },
        clearNotifications: (state) => {
            state.hasNotifications = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessions.pending, (state) => {
                state.isFetchingSessions = true;
            })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.isFetchingSessions = false;

                // Track if any session has a newer message than what we already have
                const incomingSessions = action.payload;
                const currentSessions = state.sessions;

                if (!state.isOpen) {
                    const hasNewMessages = incomingSessions.some(newSess => {
                        const oldSess = currentSessions.find(s => s.id === newSess.id);
                        if (!newSess.last_message) return false;
                        if (!oldSess?.last_message) return true; // First message for this session

                        // Compare timestamps
                        return new Date(newSess.last_message.timestamp!) > new Date(oldSess.last_message.timestamp!);
                    });

                    if (hasNewMessages) {
                        state.hasNotifications = true;
                    }
                }

                state.sessions = incomingSessions;
            })
            .addCase(fetchSessions.rejected, (state) => {
                state.isFetchingSessions = false;
            });
    }
});

export const { openBookingChat, closeBookingChat, clearNotifications } = bookingChatSlice.actions;
export default bookingChatSlice.reducer;
