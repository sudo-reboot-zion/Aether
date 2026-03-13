'use client';
import React, { useEffect, useState, Suspense } from 'react';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import UpcomingReservation from '../../components/profile/UpcomingReservation';
import PastBookings from '../../components/profile/PastBookings';
import SavedHomes from '../../components/profile/SavedHomes';
import TravelPreferences from '../../components/profile/TravelPreferences';

import { useSearchParams } from 'next/navigation';
import { ChatInbox } from '../../components/chat/ChatInbox';
import { GenerativeLoader } from '@/components/ui/GenerativeLoader';

function ProfileContent() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'bookings';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isTabLoading, setIsTabLoading] = useState(false);

    const handleTabChange = (tab: string) => {
        if (tab === 'messages' && activeTab !== 'messages') {
            setIsTabLoading(true);
        }
        setActiveTab(tab);
    };

    // Sync state if URL changes
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            handleTabChange(tab);
        }
    }, [searchParams, activeTab]);

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--c-cream)] text-[var(--t-primary)] font-serif">
            {isTabLoading && (
                <GenerativeLoader
                    duration={2000}
                    messages={["Decrypting neural link...", "Retrieving transmission history...", "Establishing secure channel..."]}
                    completeMessage="Secure Channel Ready"
                    onComplete={() => setIsTabLoading(false)}
                />
            )}
            <div className="flex-shrink-0 h-full transition-all duration-300">
                <ProfileSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>

            <main className="flex-1 h-full overflow-y-auto p-12 lg:px-16 scroll-hide">
                <div className="max-w-[1000px] mx-auto pb-12">
                    {activeTab === 'bookings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <UpcomingReservation />
                            <PastBookings />
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mt-12">
                                <SavedHomes />
                                <TravelPreferences />
                            </div>
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-serif text-[var(--t-primary)] font-medium mb-10">Message Inbox</h2>
                            <ChatInbox />
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-serif text-[var(--t-primary)] font-semibold mb-6">All Favorites</h2>
                            <SavedHomes />
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-serif text-[var(--t-primary)] font-semibold mb-6">Your Preferences</h2>
                            <TravelPreferences />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    const [isInitialLoading, setIsInitialLoading] = React.useState(true);

    return (
        <>
            {isInitialLoading && (
                <GenerativeLoader
                    duration={2000}
                    messages={["Accessing vault...", "Fetching identity...", "Syncing collectibles..."]}
                    completeMessage="Identity Verified"
                    onComplete={() => setIsInitialLoading(false)}
                />
            )}
            <Suspense fallback={
                <GenerativeLoader
                    duration={1500}
                    messages={["Connecting..."]}
                    completeMessage="Ready"
                />
            }>
                <ProfileContent />
            </Suspense>
        </>
    );
}
