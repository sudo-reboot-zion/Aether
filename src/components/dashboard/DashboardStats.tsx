import React from 'react';
import Link from 'next/link';
import { Home, Star, Users, Award } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import StatCard from './StatCard';
import ProfileStatsSkeleton from '../ui/ProfileStatsSkeleton';
import { DashboardStatsProps } from '@/redux/slices/redux.types';

const DashboardStats: React.FC<DashboardStatsProps> = ({
    persona, myProperties, myTrips, hostRequests, isLoading, stats, badges
}) => {
    const totalPortfolioValue = myProperties.reduce((acc, p) => acc + (p.pricePerNight / 1_000_000), 0);

    // Fix: on-chain averageRating is stored as (rating * 100), so divide by 100 for display
    const rawRating = stats?.averageRating ?? 0;
    const avgRating = rawRating > 0 ? rawRating / 100 : null;
    const totalReviews = stats?.totalReviews ?? 0;
    const badgeCount = (badges || []).length;

    // Calculate occupancy: active bookings out of total possible listing-days (simplified)
    const bookedCount = (hostRequests ?? []).filter(b => b.status === 'confirmed' || b.status === 'completed').length;
    const occupancyPct = myProperties.length > 0
        ? Math.min(Math.round((bookedCount / Math.max(myProperties.length, 1)) * 100), 100)
        : null;

    // Total earned from completed bookings (hostPayout is in micro-STX)
    const totalEarned = (hostRequests ?? [])
        .filter(b => b.status === 'completed')
        .reduce((acc, b) => acc + (b.hostPayout ?? 0) / 1_000_000, 0);

    if (isLoading && myProperties.length === 0 && myTrips.length === 0) {
        return <ProfileStatsSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {persona === 'HOST' ? (
                <>
                    <GlassPanel className="col-span-1 md:col-span-3 !bg-[var(--c-blue-deep)] text-white p-8 relative overflow-hidden flex justify-between items-center group">
                        <div className="relative z-10">
                            <h3 className="text-sm text-[rgba(255,255,255,0.7)] font-normal mb-2">Portfolio Value (STX)</h3>
                            <div className="text-5xl font-light tracking-tight bg-gradient-to-r from-white to-[#AAAAAA] bg-clip-text text-transparent">
                                {totalPortfolioValue.toFixed(2)} STX
                            </div>
                            <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
                                Secure on Bitcoin L2 • {myProperties.length} active listing{myProperties.length !== 1 ? 's' : ''}
                                {totalEarned > 0 && ` • ${totalEarned.toFixed(2)} STX earned`}
                            </div>
                        </div>
                        <div className="relative z-10 flex gap-3">
                            <Link href="/dashboard/analytics" className="h-11 px-6 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-colors flex items-center">Analytics</Link>
                        </div>
                    </GlassPanel>

                    <StatCard
                        label="Occupancy"
                        value={occupancyPct !== null ? `${occupancyPct}%` : '--'}
                        description={bookedCount > 0 ? `${bookedCount} active booking${bookedCount > 1 ? 's' : ''}` : 'No bookings yet'}
                        trend={occupancyPct !== null && occupancyPct > 50 ? 'up' : 'neutral'}
                        trendValue={occupancyPct !== null ? `↑ ${occupancyPct}%` : '~'}
                        icon={<Users className="w-4 h-4" />}
                    />
                    <StatCard
                        label="Listings"
                        value={myProperties.length.toString().padStart(2, '0')}
                        description="Global exposure"
                        trend="neutral"
                        trendValue={`+ ${myProperties.length}`}
                        icon={<Home className="w-4 h-4" />}
                    />
                    <StatCard
                        label="Rating"
                        value={avgRating !== null ? avgRating.toFixed(1) : '--'}
                        description={totalReviews > 0 ? `${totalReviews} verified review${totalReviews > 1 ? 's' : ''}` : 'No reviews yet'}
                        trend={avgRating !== null && avgRating >= 4.5 ? 'up' : 'neutral'}
                        trendValue={avgRating !== null ? `★ ${avgRating.toFixed(1)}` : '~'}
                        icon={<Star className="w-4 h-4" />}
                    />
                </>
            ) : (
                <>
                    <GlassPanel className="col-span-1 md:col-span-2 !bg-[var(--c-blue-azure)] text-white p-8 relative overflow-hidden flex justify-between items-center group">
                        <div className="relative z-10">
                            <h3 className="text-sm text-white/70 font-normal mb-2">Your Journey</h3>
                            <div className="text-4xl font-light tracking-tight">
                                {myTrips.length} Booked Stay{myTrips.length !== 1 ? 's' : ''}
                            </div>
                            <p className="text-xs text-white/50 mt-2 font-sans tracking-wide uppercase">Verifiable on Stacks</p>
                        </div>
                        <Link href="/collection" className="relative z-10 h-11 px-6 rounded-full bg-white text-[var(--c-blue-azure)] text-sm font-bold flex items-center hover:bg-white/90 transition-colors shadow-xl">
                            Explore More
                        </Link>
                    </GlassPanel>
                    <StatCard
                        label="Badges Earned"
                        value={badgeCount.toString().padStart(2, '0')}
                        description="Global Reputation"
                        trend={badgeCount > 0 ? 'up' : 'neutral'}
                        trendValue={`Total: ${badgeCount}`}
                        icon={<Award className="w-4 h-4" />}
                    />
                </>
            )}
        </div>
    );
};

export default DashboardStats;

