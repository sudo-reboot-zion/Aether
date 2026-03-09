"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { closeDialog, resolveDialog, setDialogInput } from '@/redux/slices/uiSlice';
import GlassPanel from './GlassPanel';
import { X, Check, ArrowRight } from 'lucide-react';

const PremiumDialog = () => {
    const dispatch = useDispatch();
    const { isOpen, title, message, type, inputValue } = useSelector((state: RootState) => state.ui);
    const [render, setRender] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setRender(true);
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);
        } else {
            const timer = setTimeout(() => setRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!render) return null;

    const handleConfirm = () => {
        if (type === 'prompt') {
            dispatch(resolveDialog(inputValue));
        } else {
            dispatch(resolveDialog(true));
        }
    };

    const handleCancel = () => {
        dispatch(resolveDialog(false));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') handleCancel();
    };

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleCancel} />

            <GlassPanel className={`w-full max-w-[440px] p-8 shadow-2xl relative transition-all duration-500 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}>
                <button
                    onClick={handleCancel}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors text-[var(--t-secondary)]"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--c-blue-azure)] mb-2 font-sans opacity-80">
                        Protocol Intelligence
                    </div>
                    <h3 className="text-2xl font-serif text-[var(--t-primary)] font-medium leading-tight">
                        {title}
                    </h3>
                </div>

                <p className="text-[var(--t-secondary)] font-sans text-sm leading-relaxed mb-8">
                    {message}
                </p>

                {type === 'prompt' && (
                    <div className="mb-8 group relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => dispatch(setDialogInput(e.target.value))}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your response..."
                            className="w-full bg-white/40 border border-black/5 rounded-2xl px-5 py-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-blue-azure)]/20 transition-all placeholder:italic"
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex-1 py-4 rounded-2xl border border-black/5 font-sans text-xs font-bold uppercase tracking-widest text-[var(--t-secondary)] hover:bg-black/5 transition-all"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-4 rounded-2xl bg-[var(--c-blue-deep)] text-white font-sans text-xs font-bold uppercase tracking-widest shadow-lg shadow-[var(--c-blue-deep)]/10 hover:bg-[#153250] transition-all flex items-center justify-center gap-2"
                    >
                        {type === 'confirm' ? 'Confirm' : 'Submit'}
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};

export default PremiumDialog;
