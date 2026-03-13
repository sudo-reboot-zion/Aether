import React from 'react';
import { DollarSign, Activity, Home, Star } from 'lucide-react';
import AnalyticsStatBadge from './AnalyticsStatBadge';
import { CurrencyDisplay } from '@/components/ui/CurrencyDisplay';
import type { AnalyticsKPIStripProps } from '@/redux/slices/redux.types';

const AnalyticsKPIStrip: React.FC<AnalyticsKPIStripProps> = ({
    totalEarned,
    totalPending,
    activeListings,
    totalListings,
    avgRating,
    totalReviews
}) => {
    return (
        <div
            className="rounded-[var(--radius-lg)] p-8 relative text-white"
            style={{ background: 'linear-gradient(135deg, #1B4066 0%, #21527F 60%, #2A6399 100%)' }}
        >
            {/* Soft ambient orbs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#3D7CB8] opacity-25 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full bg-[#9FBAD1] opacity-15 blur-[50px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                <AnalyticsStatBadge
                    icon={<DollarSign size={20} />}
                    label="Total Earned"
                    value={<CurrencyDisplay amount={totalEarned} />}
                    sub="All completed payouts"
                    accent="from-white/20 to-white/5"
                />
                <AnalyticsStatBadge
                    icon={<Activity size={20} />}
                    label="Pending Payout"
                    value={<CurrencyDisplay amount={totalPending} />}
                    sub="Confirmed, awaiting release"
                    accent="from-white/10 to-transparent"
                />
                <AnalyticsStatBadge
                    icon={<Home size={20} />}
                    label="Active Listings"
                    value={`${activeListings} / ${totalListings}`}
                    sub="Properties on-chain"
                    accent="from-white/20 to-white/5"
                />
                <AnalyticsStatBadge
                    icon={<Star size={20} />}
                    label="Avg. Rating"
                    value={totalReviews > 0 ? avgRating.toFixed(1) : '—'}
                    sub={`${totalReviews} verified reviews`}
                    accent="from-white/10 to-transparent"
                />
            </div>
        </div>
    );
};

export default AnalyticsKPIStrip;
