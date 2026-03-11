import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getInitialUserData } from '@/lib/stacks';

export type UserPersona = 'GUEST' | 'HOST';

interface UserState {
    userData: any | null; 
    persona: UserPersona;
    isLoading: boolean;
}

const initialUserData = getInitialUserData();

const initialState: UserState = {
    userData: initialUserData,
    persona: 'GUEST',
    isLoading: !initialUserData,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(state, action: PayloadAction<any | null>) {
            state.userData = action.payload;
            state.isLoading = false;
        },
        setPersona(state, action: PayloadAction<UserPersona>) {
            state.persona = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        logout(state) {
            state.userData = null;
            state.persona = 'GUEST';
            state.isLoading = false;
        },
    },
});

export const { setUserData, setPersona, setLoading, logout } = userSlice.actions;
export default userSlice.reducer;
