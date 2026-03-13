"use client";
import React from 'react';
import Link from 'next/link';
import NavDock from '../../components/dashboard/NavDock';
import GlassPanel from '../../components/ui/GlassPanel';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardContent from '../../components/dashboard/DashboardContent';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import ReviewDialog from '../../components/dashboard/ReviewDialog';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { GenerativeLoader } from '@/components/ui/GenerativeLoader';

export default function DashboardPage() {
    const {
        userData, persona, activeNav, setActiveNav,
        myProperties, myTrips, hostRequests,
        handleRelease, handleDispute, handleResolveDispute,
        handleOpenReview, isReviewDialogOpen, setIsReviewDialogOpen,
        selectedBookingForReview, submitReview, markAsReviewed,
        propertiesLoading, bookingsLoading,
        stats, badges, userReviews
    } = useDashboard();

    if (!userData) {
        return (
            <div className="flex h-screen items-center justify-center bg-[var(--c-cream)] font-serif p-6">
                <GlassPanel className="p-12 text-center max-w-md">
                    <h2 className="text-3xl font-light mb-6">Authorize Access</h2>
                    <p className="text-[var(--t-secondary)] mb-8 font-sans">Please connect your Stacks wallet to view your personalized dashboard.</p>
                    <button
                        onClick={useAuth().connectWallet}
                        className="w-full py-4 rounded-xl bg-[var(--c-blue-deep)] text-white font-medium shadow-xl hover:bg-[#153250] transition-all"
                    >
                        Connect Wallet
                    </button>
                    <Link href="/" className="block mt-6 text-sm text-[var(--t-secondary)] hover:text-[var(--t-primary)]">Return Home</Link>
                </GlassPanel>
            </div>
        );
    }

    const isLoading = propertiesLoading || bookingsLoading;
    const [isInitialLoading, setIsInitialLoading] = React.useState(true);

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--c-cream)] text-[var(--t-primary)] font-serif p-6 gap-6 max-w-[1600px] mx-auto relative">
            {isInitialLoading && (
                <GenerativeLoader
                    duration={2000}
                    messages={["Syncing ledger...", "Authenticating persona...", "Restoring session..."]}
                    completeMessage="Dashboard Ready"
                    onComplete={() => setIsInitialLoading(false)}
                />
            )}
            <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-[var(--c-blue-azure)] opacity-20 blur-[80px] rounded-full z-0 pointer-events-none"></div>
            <div className="fixed -top-12 left-64 w-64 h-64 bg-[var(--c-blue-haze)] opacity-10 blur-[80px] rounded-full z-0 pointer-events-none"></div>

            <aside className="w-[88px] relative z-20">
                <NavDock activeItem={activeNav} setActiveItem={setActiveNav} />
            </aside>

            <main className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 relative z-10 scroll-hide">
                <DashboardHeader persona={persona} userName={userData?.profile?.name} />
                <DashboardStats
                    persona={persona}
                    myProperties={myProperties}
                    myTrips={myTrips}
                    hostRequests={hostRequests}
                    isLoading={isLoading}
                    stats={stats}
                    badges={badges}
                />
                <DashboardContent
                    persona={persona}
                    myProperties={myProperties}
                    myTrips={myTrips}
                    isLoading={isLoading}
                    userReviews={userReviews}
                />
            </main>

            <DashboardSidebar
                persona={persona}
                hostRequests={hostRequests}
                myTrips={myTrips}
                handleRelease={handleRelease}
                handleDispute={handleDispute}
                handleResolveDispute={handleResolveDispute}
                handleReview={handleOpenReview}
                stats={stats}
                badges={badges}
                totalEarned={myProperties.reduce((acc: number, p: any) => acc + (p.pricePerNight / 1_000_000), 0)}
            />

            <ReviewDialog
                isOpen={isReviewDialogOpen}
                onClose={() => setIsReviewDialogOpen(false)}
                booking={selectedBookingForReview}
                onSubmit={(rating, comment) => {
                    if (selectedBookingForReview) {
                        submitReview(
                            selectedBookingForReview.id,
                            selectedBookingForReview.host,
                            rating,
                            comment
                        );
                        markAsReviewed(selectedBookingForReview.id);
                    }
                }}
            />
        </div>
    );
}
