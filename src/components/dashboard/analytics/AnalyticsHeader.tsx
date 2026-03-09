import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { AnalyticsHeaderProps } from '@/redux/slices/redux.types';

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = () => {
    return (
        <div className="flex items-center justify-between pt-2">
            <div>
                <Link href="/dashboard" className="flex items-center gap-2 text-[var(--t-secondary)] text-sm hover:text-[var(--t-primary)] transition-colors mb-3 font-sans">
                    <ArrowLeft size={14} />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-light tracking-tight text-[var(--t-primary)]">Portfolio Analytics</h1>
                <p className="text-sm text-[var(--t-secondary)] mt-1 font-sans">Live data sourced from Stacks blockchain</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--t-secondary)] font-sans bg-[var(--c-white-glass)] border border-white/60 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live · Testnet
            </div>
        </div>
    );
};

export default AnalyticsHeader;
