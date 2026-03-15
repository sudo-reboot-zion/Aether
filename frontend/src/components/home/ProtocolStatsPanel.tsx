"use client";
import React from 'react';
import { useProtocolStats } from '@/hooks/useProtocolStats';
import GlassPanel from '../ui/GlassPanel';

function StatBlock({
    label,
    value,
    sub,
    isLoading,
    isLast = false,
}: {
    label: string;
    value: string | number;
    sub?: string;
    isLoading: boolean;
    isLast?: boolean;
}) {
    return (
        <div className={`px-4 py-2 ${!isLast ? 'border-b md:border-b-0 md:border-r border-[rgba(27,64,102,0.1)]' : ''} w-full flex flex-col justify-center`}>
            <span className="block font-serif text-2xl md:text-3xl font-light text-[var(--t-primary)] mb-1 whitespace-nowrap">
                {label}
            </span>
            {isLoading ? (
                <div className="h-8 w-16 rounded bg-[rgba(27,64,102,0.05)] animate-pulse mb-0.5" />
            ) : (
                <div className="font-sans text-xl font-bold text-[var(--t-primary)] leading-tight">
                    {value}
                </div>
            )}
            {sub && (
                <span className="font-sans text-[10px] uppercase tracking-wider text-[var(--t-secondary)] opacity-70 mt-1">
                    {sub}
                </span>
            )}
        </div>
    );
}

export default function ProtocolStatsPanel() {
    const { totalProperties, totalBookings, completedBookings, network, isLoading } = useProtocolStats();

    return (
        <div className="mt-8 max-w-3xl animate-fade-in">
            <GlassPanel className="p-4 border-[1px] border-[var(--c-blue-deep)]/20 shadow-md" hover={false}>
                <div className="flex items-center gap-2 mb-4 px-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-blue-azure)] animate-pulse" />
                        <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--t-secondary)]">
                            Live Protocol · {network}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-0 items-center">
                    <StatBlock
                        label="Properties"
                        value={isLoading ? '—' : totalProperties.toLocaleString()}
                        sub="On-chain listings"
                        isLoading={isLoading}
                    />
                    <StatBlock
                        label="Bookings"
                        value={isLoading ? '—' : totalBookings.toLocaleString()}
                        sub="Total reservations"
                        isLoading={isLoading}
                    />
                    <StatBlock
                        label="Completed"
                        value={isLoading ? '—' : completedBookings.toLocaleString()}
                        sub="Stays settled"
                        isLoading={isLoading}
                    />
                    <StatBlock
                        label="Platform Fee"
                        value="2%"
                        sub="Flat. No hidden fees."
                        isLoading={false}
                        isLast={true}
                    />
                </div>
            </GlassPanel>
        </div>
    );
}

