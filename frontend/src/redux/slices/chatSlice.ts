import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage, KnowledgeSnippet } from '../../types/chat.types';


const initialState: ChatState = {
    messages: [
        {
            id: 'intro',
            role: 'assistant',
            content: 'Hello! How can I help you find your perfect sanctuary today?',
            timestamp: Date.now(),
        }
    ],
    isOpen: false,
    isLoading: false,
    conversationId: null,
    suggestedActions: [
        "What is Aether?",
        "Explain the smart contracts",
        "Connect with support"
    ],
    error: null,
};


interface ChatApiResponse {
    response: string;
    conversation_id: string;
    knowledge_snippets: KnowledgeSnippet[];
    suggested_actions?: string[];
}


export const sendMessageAPI = createAsyncThunk<
    ChatApiResponse,
    string,
    { state: { chat: ChatState } }
>(
    'chat/sendMessageAPI',
    async (message, { getState, rejectWithValue }) => {
        try {
            const { conversationId } = getState().chat;

            // Hardcoded backend URL due to standalone nature. Fallback to var if provided.
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aether-ogor.onrender.com';

            const response = await fetch(`${apiUrl}/api/chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation_id: conversationId,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: ChatApiResponse = await response.json();
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to communicate with Aether agent';
            return rejectWithValue(errorMessage);
        }
    }
);

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },
        addUserMessage: (state, action: PayloadAction<string>) => {
            const newMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content: action.payload,
                timestamp: Date.now(),
            };
            state.messages.push(newMessage);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessageAPI.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendMessageAPI.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload.conversation_id) {
                    state.conversationId = action.payload.conversation_id;
                }


                const newMessage: ChatMessage = {
                    id: `bot-${Date.now()}`,
                    role: 'assistant',
                    content: action.payload.response,
                    timestamp: Date.now(),
                    knowledgeSnippets: action.payload.knowledge_snippets || [],
                };

                state.messages.push(newMessage);


                if (action.payload.suggested_actions && action.payload.suggested_actions.length > 0) {
                    state.suggestedActions = action.payload.suggested_actions;
                }
            })
            .addCase(sendMessageAPI.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;

                // Add error message to chat
                const errorMessage: ChatMessage = {
                    id: `error-${Date.now()}`,
                    role: 'assistant',
                    content: "I'm having trouble connecting to my knowledge base right now. Please try again later.",
                    timestamp: Date.now(),
                };
                state.messages.push(errorMessage);
            });
    },
});

export const { toggleChat, addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
