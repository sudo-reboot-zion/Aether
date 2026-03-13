"use client";
import React, { useEffect, useState } from 'react';
import NavDock from '@/components/dashboard/NavDock';
import GlassPanel from '@/components/ui/GlassPanel';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
import { useBookings } from '@/hooks/useBookings';
import { useReputation } from '@/hooks/useReputation';
import { TrendingUp, Users } from 'lucide-react';
import AnalyticsEarningsChart from '@/components/dashboard/analytics/AnalyticsEarningsChart';
import AnalyticsOccupancyChart from '@/components/dashboard/analytics/AnalyticsOccupancyChart';
import AnalyticsHeader from '@/components/dashboard/analytics/AnalyticsHeader';
import AnalyticsKPIStrip from '@/components/dashboard/analytics/AnalyticsKPIStrip';
import RecentActivityTable from '@/components/dashboard/analytics/RecentActivityTable';
import RecentReviewsList from '@/components/dashboard/RecentReviewsList';
import { GenerativeLoader } from '@/components/ui/GenerativeLoader';
import type { UserStats } from '@/redux/slices/redux.types';
import type { CachedBooking } from '@/redux/slices/bookingsSlice';

export default function AnalyticsPage() {
    const { userData } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet || '';

    const { properties } = useProperties();
    const { bookings } = useBookings();
    const { fetchUserStats, fetchUserReviews, userReviews } = useReputation(userAddress);

    const [stats, setStats] = useState<UserStats | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        if (userAddress) {
            fetchUserStats(userAddress).then(s => setStats(s));
            fetchUserReviews(userAddress);
        }
    }, [userAddress, fetchUserStats, fetchUserReviews]);

    const myProperties = properties.filter(p => userAddress && p.owner === userAddress);
    const myHostBookings = bookings.filter(b => b.host === userAddress);
    const completedBookings = myHostBookings.filter(b => b.status === 'completed');
    const confirmedBookings = myHostBookings.filter(b => b.status === 'confirmed');

    const totalEarned = completedBookings.reduce((acc, b) => acc + (b.hostPayout / 1_000_000), 0);
    const totalPending = confirmedBookings.reduce((acc, b) => acc + (b.hostPayout / 1_000_000), 0);
    const totalListings = myProperties.length;
    const activeListings = myProperties.filter(p => p.active).length;
    const avgRating = (stats?.averageRating ?? 0) / 10;
    const totalReviews = stats?.totalReviews ?? 0;
    const occupancyRate = totalListings > 0
        ? Math.min(100, Math.round((completedBookings.length / (totalListings * 4)) * 100))
        : 0;

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--c-cream)] text-[var(--t-primary)] font-serif p-6 gap-6 max-w-[1600px] mx-auto relative">
            {isInitialLoading && (
                <GenerativeLoader
                    duration={2500}
                    messages={["Aggregating chain data...", "Calculating yield curves...", "Visualizing sanctuary growth..."]}
                    completeMessage="Insights Ready"
                    onComplete={() => setIsInitialLoading(false)}
                />
            )}
            <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-[var(--c-blue-azure)] opacity-20 blur-[80px] rounded-full z-0 pointer-events-none" />
            <div className="fixed -top-12 left-64 w-64 h-64 bg-[var(--c-blue-haze)] opacity-10 blur-[80px] rounded-full z-0 pointer-events-none" />

            <aside className="w-[88px] relative z-20">
                <NavDock activeItem="analytics" setActiveItem={() => { }} />
            </aside>

            <main className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 relative z-10 scroll-hide">
                <AnalyticsHeader />

                <AnalyticsKPIStrip
                    totalEarned={totalEarned}
                    totalPending={totalPending}
                    activeListings={activeListings}
                    totalListings={totalListings}
                    avgRating={avgRating}
                    totalReviews={totalReviews}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassPanel className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-medium text-[var(--t-primary)]">Earnings History</h3>
                                <p className="text-xs text-[var(--t-secondary)] font-sans mt-0.5">Per-booking STX payout</p>
                            </div>
                            <TrendingUp size={16} className="text-[var(--c-blue-azure)]" />
                        </div>
                        <AnalyticsEarningsChart bookings={completedBookings} />
                    </GlassPanel>

                    <GlassPanel className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-medium text-[var(--t-primary)]">Occupancy Overview</h3>
                                <p className="text-xs text-[var(--t-secondary)] font-sans mt-0.5">Active vs. idle listings</p>
                            </div>
                            <Users size={16} className="text-[var(--c-blue-azure)]" />
                        </div>
                        <AnalyticsOccupancyChart
                            activeListings={activeListings}
                            totalListings={totalListings}
                            occupancyRate={occupancyRate}
                            completedBookings={completedBookings.length}
                        />
                    </GlassPanel>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RecentActivityTable bookings={myHostBookings} />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentReviewsList reviews={userReviews} />
                    </div>
                </div>
            </main>
        </div>
    );
}
