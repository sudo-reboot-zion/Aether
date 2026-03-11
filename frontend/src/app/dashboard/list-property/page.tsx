'use client';
import React from 'react';
import ListingWizard from '@/components/host/ListingWizard';
import GlassPanel from '@/components/ui/GlassPanel';
import Link from 'next/link';

export default function ListPropertyPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-12">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/dashboard"
                                className="w-10 h-10 rounded-full border border-white/20 bg-white/40 backdrop-blur-md flex items-center justify-center text-[var(--t-primary)] hover:bg-white/60 transition-all active:scale-90"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <h1 className="font-serif text-5xl text-[var(--t-primary)] tracking-tight">List Your Sanctuary</h1>
                        </div>
                        <p className="font-sans text-base text-[var(--t-secondary)] max-w-xl opacity-80 leading-relaxed">
                            Define the essence of your property. Every listing on Aether is a unique on-chain asset, secured by the Stacks blockchain.
                        </p>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--t-secondary)] opacity-60">Listing Status</div>
                            <div className="font-serif text-lg text-[var(--c-blue-azure)]">Drafting Mode</div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-[var(--c-blue-azure)]/30 bg-[var(--c-blue-azure)]/10 flex items-center justify-center text-[var(--c-blue-azure)] relative group">
                            <div className="absolute inset-0 rounded-full bg-[var(--c-blue-azure)]/20 animate-ping opacity-20" />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Wizard Integration */}
                <ListingWizard />
            </div>
        </div>
    );
}
