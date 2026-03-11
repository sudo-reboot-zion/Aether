import React from 'react';
import GlassPanel from '../ui/GlassPanel';
import { StatCardProps } from '@/redux/slices/redux.types';



const StatCard: React.FC<StatCardProps & { icon?: React.ReactNode }> = ({ label, value, description, trend, trendValue, icon }) => {
    const trendColor = trend === 'up'
        ? 'bg-[#E8F5E9] text-[#2E7D32]'
        : trend === 'down'
            ? 'bg-[#FFEBEE] text-[#C62828]'
            : 'bg-[#F5F5F5] text-[#666]';

    return (
        <GlassPanel className="flex flex-col justify-between h-[140px] p-6 !bg-[rgba(255,255,255,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.4)] relative overflow-hidden group">
            {/* Background Decorative Icon */}
            {icon && (
                <div className="absolute -right-2 -bottom-2 text-[var(--t-primary)] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity scale-[2.5] pointer-events-none">
                    {icon}
                </div>
            )}

            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    {icon && <div className="text-[var(--t-secondary)] opacity-60">{icon}</div>}
                    <span className="text-xs uppercase tracking-wider text-[var(--t-secondary)] font-medium">
                        {label}
                    </span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium ${trendColor}`}>
                    {trendValue}
                </span>
            </div>
            <div className="text-4xl font-light tracking-tight text-[var(--t-primary)] leading-none">
                {value}
            </div>
            <div className="text-xs text-[var(--t-secondary)]">
                {description}
            </div>
        </GlassPanel>
    );
};

export default StatCard;
