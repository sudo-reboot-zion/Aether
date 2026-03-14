"use client";
import React from 'react';
import Link from 'next/link';

import GlassPanel from '../../components/ui/GlassPanel';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardContent from '../../components/dashboard/DashboardContent';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import ReviewDialog from '../../components/dashboard/ReviewDialog';
import EscrowList from '../../components/dashboard/EscrowList';
import PersonaIntelligence from '../../components/dashboard/PersonaIntelligence';
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
    const { connectWallet } = useAuth();

    if (!userData) {
        return (
            <div className="flex h-screen items-center justify-center bg-[var(--c-cream)] font-serif p-6">
                <GlassPanel className="p-12 text-center max-w-md">
                    <h2 className="text-3xl font-light mb-6">Authorize Access</h2>
                    <p className="text-[var(--t-secondary)] mb-8 font-sans">Please connect your Stacks wallet to view your personalized dashboard.</p>
                    <button
                        onClick={connectWallet}
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
        <div className="flex h-screen overflow-hidden bg-[var(--c-cream)] text-[var(--t-primary)] font-serif max-w-[1800px] mx-auto relative">
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

            <div className="flex-shrink-0 h-full transition-all duration-300">
                <DashboardSidebar
                    persona={persona}
                    activeItem={activeNav}
                    setActiveItem={setActiveNav}
                    userData={userData}
                />
            </div>

            <main className="flex-1 flex flex-col gap-8 overflow-y-auto p-12 lg:px-16 pr-4 relative z-10 scroll-hide">
                <DashboardHeader persona={persona} userName={userData?.profile?.name} />

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
                    <div className="flex flex-col gap-8">
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
                    </div>

                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <EscrowList
                            persona={persona}
                            hostRequests={hostRequests}
                            myTrips={myTrips}
                            handleRelease={handleRelease}
                            handleDispute={handleDispute}
                            handleResolveDispute={handleResolveDispute}
                            handleReview={handleOpenReview}
                        />

                        <PersonaIntelligence
                            persona={persona}
                            stats={stats}
                            badges={badges}
                            totalEarned={myProperties.reduce((acc: number, p: any) => acc + (p.pricePerNight / 1_000_000), 0)}
                        />
                    </div>
                </div>
            </main>

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
