import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'prompt';
    inputValue: string;
    resolveValue: boolean | string | null;
}

const initialState: DialogState = {
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    inputValue: '',
    resolveValue: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openDialog: (state, action: PayloadAction<{ title: string; message: string; type: 'confirm' | 'prompt'; defaultValue?: string }>) => {
            state.isOpen = true;
            state.title = action.payload.title;
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.inputValue = action.payload.defaultValue || '';
            state.resolveValue = null;
        },
        closeDialog: (state) => {
            state.isOpen = false;
        },
        setDialogInput: (state, action: PayloadAction<string>) => {
            state.inputValue = action.payload;
        },
        resolveDialog: (state, action: PayloadAction<boolean | string>) => {
            state.resolveValue = action.payload;
            state.isOpen = false;
        },
    },
});

export const { openDialog, closeDialog, setDialogInput, resolveDialog } = uiSlice.actions;
export default uiSlice.reducer;
