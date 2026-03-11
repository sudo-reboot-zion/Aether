"use client";
import React from 'react';
import type { AnalyticsOccupancyChartProps } from '@/redux/slices/redux.types';


const AnalyticsOccupancyChart: React.FC<AnalyticsOccupancyChartProps> = ({
    activeListings, totalListings, occupancyRate, completedBookings
}) => {
    const idleListings = totalListings - activeListings;

    const segments = totalListings === 0
        ? [{ label: 'No Listings', value: 1, color: 'rgba(159,186,209,0.3)' }]
        : [
            { label: 'Active', value: activeListings, color: '#1B4066' },
            { label: 'Hidden', value: idleListings, color: 'rgba(159,186,209,0.4)' },
        ];

    const total = segments.reduce((a, s) => a + s.value, 0);
    let cumulative = 0;
    const r = 52;
    const cx = 60;
    const cy = 60;
    const circumference = 2 * Math.PI * r;

    return (
        <div className="flex-1 flex flex-col gap-4 min-h-[180px]">
            <div className="flex items-center gap-6">
                {/* Donut */}
                <div className="relative shrink-0">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(159,186,209,0.15)" strokeWidth="14" />
                        {segments.map((seg, i) => {
                            const fraction = seg.value / total;
                            const offset = circumference * (1 - cumulative / total);
                            const dash = circumference * fraction;
                            cumulative += seg.value;
                            return (
                                <circle
                                    key={i}
                                    cx={cx} cy={cy} r={r}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth="14"
                                    strokeDasharray={`${dash} ${circumference - dash}`}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dasharray 1s ease' }}
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-light text-[var(--t-primary)]">{occupancyRate}%</span>
                        <span className="text-[9px] font-sans text-[var(--t-secondary)] uppercase tracking-wider">Occupancy</span>
                    </div>
                </div>

                {/* Legend & metrics */}
                <div className="flex flex-col gap-4 flex-1">
                    {segments.map((seg, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
                                <span className="text-xs font-sans text-[var(--t-secondary)]">{seg.label}</span>
                            </div>
                            <span className="text-sm font-medium text-[var(--t-primary)]">{seg.value}</span>
                        </div>
                    ))}

                    <div className="border-t border-black/5 pt-3 flex items-center justify-between">
                        <span className="text-xs font-sans text-[var(--t-secondary)]">Completed stays</span>
                        <span className="text-sm font-medium text-[var(--c-blue-azure)]">{completedBookings}</span>
                    </div>
                </div>
            </div>

            {/* Occupancy bar */}
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-sans text-[var(--t-secondary)]">
                    <span>Listing Occupancy Rate</span>
                    <span>{occupancyRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--c-fog)] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${occupancyRate}%`,
                            background: 'linear-gradient(90deg, #9FBAD1, #1B4066)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOccupancyChart;
