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
        <div className={`px-4 py-2 ${!isLast ? 'border-b md:border-b-0 md:border-r border-[var(--c-blue-deep)]/20' : ''} w-full flex flex-col justify-center`}>
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
            <GlassPanel className="p-4 border-[1px] border-[var(--c-blue-deep)]/20 shadow-md relative overflow-hidden" hover={false}>
                {/* Geometric pattern — deep blue strokes on glass */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230B2545' stroke-width='1'%3E%3Ccircle cx='30' cy='30' r='22'/%3E%3Ccircle cx='30' cy='30' r='11'/%3E%3Cline x1='0' y1='30' x2='60' y2='30'/%3E%3Cline x1='30' y1='0' x2='30' y2='60'/%3E%3Cline x1='0' y1='0' x2='60' y2='60'/%3E%3Cline x1='60' y1='0' x2='0' y2='60'/%3E%3Ccircle cx='0' cy='0' r='8'/%3E%3Ccircle cx='60' cy='0' r='8'/%3E%3Ccircle cx='0' cy='60' r='8'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px',
                        opacity: 0.08,
                    }}
                />
                <div className="relative z-10 flex items-center gap-2 mb-4 px-4">
                    {/* Live Protocol Badge */}
                    <div
                        className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg overflow-hidden"
                        style={{
                            background: 'var(--c-blue-deep)',
                        }}
                    >
                        {/* Subtle diagonal pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.12]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 16L16 0M-4 4L4 -4M12 20L20 12' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                                backgroundSize: '16px 16px',
                            }}
                        />
                        {/* Soft glow accent */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-blue-azure)]/20 to-transparent pointer-events-none" />

                        {/* Pulsing dot */}
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--c-blue-azure)] opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--c-blue-azure)]" />
                        </span>

                        <span className="relative font-sans text-[9px] uppercase tracking-[0.25em] font-bold text-white/90">
                            Live Protocol · {network}
                        </span>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-0 items-center">
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

