import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TxType = 'booking' | 'listing' | 'dispute' | 'review' | 'badge' | 'profile_update';
export type TxStatus = 'pending' | 'confirmed' | 'failed' | 'timeout';

export interface PendingTx {
    txId: string;
    type: TxType;
    status: TxStatus;
    optimisticData: Record<string, unknown>;
    submittedAt: number;
    confirmedAt?: number;
}

interface PendingTxState {
    transactions: PendingTx[];
}

const STORAGE_KEY = 'aether_pending_txs';

function loadFromStorage(): PendingTx[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const txs: PendingTx[] = JSON.parse(stored);


        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const freshTxs = txs.filter(tx => tx.submittedAt > dayAgo);

        if (freshTxs.length !== txs.length) {
            saveToStorage(freshTxs);
        }

        return freshTxs;
    } catch {
        return [];
    }
}

function saveToStorage(txs: PendingTx[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
    } catch { /* ignore */ }
}

const initialState: PendingTxState = {
    transactions: typeof window !== 'undefined' ? loadFromStorage() : [],
};

const pendingTxSlice = createSlice({
    name: 'pendingTx',
    initialState,
    reducers: {
        addPendingTx(state, action: PayloadAction<Omit<PendingTx, 'status' | 'submittedAt'>>) {
            const tx: PendingTx = {
                ...action.payload,
                status: 'pending',
                submittedAt: Date.now(),
            };
            state.transactions.push(tx);
            saveToStorage(state.transactions);
        },
        confirmTx(state, action: PayloadAction<string>) {
            const tx = state.transactions.find(t => t.txId === action.payload);
            if (tx) {
                tx.status = 'confirmed';
                tx.confirmedAt = Date.now();
                saveToStorage(state.transactions);
            }
        },
        failTx(state, action: PayloadAction<string>) {
            const tx = state.transactions.find(t => t.txId === action.payload);
            if (tx) {
                tx.status = 'failed';
                saveToStorage(state.transactions);
            }
        },
        timeoutTx(state, action: PayloadAction<string>) {
            const tx = state.transactions.find(t => t.txId === action.payload);
            if (tx) {
                tx.status = 'timeout';
                saveToStorage(state.transactions);
            }
        },
        removeTx(state, action: PayloadAction<string>) {
            state.transactions = state.transactions.filter(t => t.txId !== action.payload);
            saveToStorage(state.transactions);
        },
    },
});

export const { addPendingTx, confirmTx, failTx, timeoutTx, removeTx } = pendingTxSlice.actions;
export default pendingTxSlice.reducer;
