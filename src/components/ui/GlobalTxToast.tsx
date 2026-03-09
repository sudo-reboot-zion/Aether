"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { Loader2, CheckCircle2, AlertCircle, Rocket, X } from 'lucide-react';
import { removeTx } from '@/redux/slices/pendingTxSlice';
import GlassPanel from './GlassPanel';

const GlobalTxToast = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state: RootState) => state.pendingTx.transactions);
    const [latestTxId, setLatestTxId] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Track the most recent transaction
    const latestTx = transactions.length > 0 ? transactions[transactions.length - 1] : null;

    useEffect(() => {
        if (latestTx) {
            setLatestTxId(latestTx.txId);
            setIsVisible(true);

            // Auto-hide success or error after a delay
            if (latestTx.status === 'confirmed' || latestTx.status === 'failed') {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                }, 5000);
                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [latestTx]);

    if (!latestTx || !isVisible) return null;

    const isPending = latestTx.status === 'pending';
    const isSuccess = latestTx.status === 'confirmed';
    const isError = latestTx.status === 'failed' || latestTx.status === 'timeout';

    return (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-500">
            <GlassPanel className={`p-5 flex items-center gap-5 border shadow-2xl min-w-[320px] transition-colors duration-500 ${isSuccess ? 'border-emerald-500/30' :
                isError ? 'border-amber-500/30' :
                    'border-white/40'
                }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden ${isSuccess ? 'bg-emerald-50 text-emerald-600' :
                    isError ? 'bg-amber-50 text-amber-600' :
                        'bg-[var(--c-blue-deep)] text-white'
                    }`}>
                    {isPending ? (
                        <Rocket className="w-6 h-6 animate-pulse" />
                    ) : isSuccess ? (
                        <CheckCircle2 className="w-6 h-6" />
                    ) : (
                        <AlertCircle className="w-6 h-6" />
                    )}
                    {isPending && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-10 h-10 opacity-20 animate-spin" />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="font-sans text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--t-secondary)] opacity-60 mb-1">
                        {isPending ? 'Stacks Protocol' : 'Identity Established'}
                    </div>
                    <div className="font-serif text-lg text-[var(--t-primary)] leading-tight">
                        {isPending ? 'Minting Sanctuary...' :
                            isSuccess ? 'Sanctuary Established' :
                                'Genesis Failure'}
                    </div>
                    <div className="font-sans text-[10px] text-[var(--t-secondary)] mt-1 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        {isPending ? (
                            <>
                                <span className="w-1 h-1 rounded-full bg-blue-400 animate-ping" />
                                Awaiting Blockchain Confirmation
                            </>
                        ) : isSuccess ? (
                            <>
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                Recorded on the Ledger
                            </>
                        ) : (
                            <>
                                <span className="w-1 h-1 rounded-full bg-amber-500" />
                                Please Check Console
                            </>
                        )}
                    </div>
                </div>

                {isPending && (
                    <div className="ml-2 w-8 h-8 rounded-full border border-black/5 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-[var(--t-secondary)] opacity-20 animate-spin" />
                    </div>
                )}

                {isError && (
                    <button
                        onClick={() => dispatch(removeTx(latestTx.txId))}
                        className="ml-2 w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                        title="Dismiss"
                    >
                        <X className="w-4 h-4 text-[var(--t-secondary)]" />
                    </button>
                )}
            </GlassPanel>
        </div>
    );
};

export default GlobalTxToast;
