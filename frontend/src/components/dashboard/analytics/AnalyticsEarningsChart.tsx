"use client";
import React, { useMemo } from 'react';
import type { AnalyticsEarningsChartProps } from '@/redux/slices/redux.types';


const AnalyticsEarningsChart: React.FC<AnalyticsEarningsChartProps> = ({ bookings }) => {
    const data = useMemo(() => {
        if (bookings.length === 0) {
            // Placeholder bars when no data
            return Array(8).fill(0).map((_, i) => ({ label: `B${i + 1}`, value: 0, empty: true }));
        }
        return bookings.slice(-10).map((b, i) => ({
            label: `#${i + 1}`,
            value: b.hostPayout / 1_000_000,
            empty: false,
        }));
    }, [bookings]);

    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="flex-1 flex flex-col gap-3 min-h-[180px]">
            {bookings.length === 0 && (
                <p className="text-xs font-sans text-[var(--t-secondary)] text-center opacity-60 mt-2">
                    Earnings will appear as bookings complete
                </p>
            )}
            <div className="flex-1 flex items-end gap-2">
                {data.map((d, i) => {
                    const heightPct = d.empty ? 20 : Math.max(8, (d.value / maxVal) * 100);
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                            {/* Tooltip */}
                            {!d.empty && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-sans text-[var(--c-blue-deep)] bg-white/80 rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm">
                                    {d.value.toFixed(3)} STX
                                </div>
                            )}
                            <div
                                className="w-full rounded-t-lg transition-all duration-700"
                                style={{
                                    height: `${heightPct}%`,
                                    minHeight: '8px',
                                    background: d.empty
                                        ? 'rgba(159, 186, 209, 0.2)'
                                        : `linear-gradient(180deg, #3D7CB8 0%, #1B4066 100%)`,
                                    opacity: d.empty ? 0.4 : 1,
                                }}
                            />
                            <span className="text-[9px] font-sans text-[var(--t-secondary)] opacity-60">{d.label}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-[10px] font-sans text-[var(--t-secondary)] opacity-50 border-t border-black/5 pt-2">
                <span>0 STX</span>
                <span>{maxVal.toFixed(2)} STX</span>
            </div>
        </div>
    );
};

export default AnalyticsEarningsChart;
