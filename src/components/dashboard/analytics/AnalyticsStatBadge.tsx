import React from 'react';
import type { AnalyticsStatBadgeProps } from '@/redux/slices/redux.types';


const AnalyticsStatBadge: React.FC<AnalyticsStatBadgeProps> = ({ icon, label, value, sub, accent }) => (
    <div className={`relative rounded-2xl p-5 bg-gradient-to-br ${accent} border border-white/10 flex flex-col gap-3`}>
        <div className="flex items-center gap-2 text-white/60 text-xs font-sans uppercase tracking-widest">
            <span className="text-white/50">{icon}</span>
            {label}
        </div>
        <div className="text-2xl font-light text-white tracking-tight">{value}</div>
        <div className="text-[11px] text-white/40 font-sans">{sub}</div>
    </div>
);

export default AnalyticsStatBadge;
