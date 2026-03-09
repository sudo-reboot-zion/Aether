import React from 'react';
import { DashboardSidebarProps } from '@/redux/slices/redux.types';
import EscrowList from './EscrowList';
import PersonaIntelligence from './PersonaIntelligence';

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    persona,
    hostRequests,
    myTrips,
    handleRelease,
    handleDispute,
    handleResolveDispute,
    handleReview,
    stats,
    badges = [],
    totalEarned = 0,
}) => {
    return (
        <aside className="w-[380px] bg-[rgba(255,255,255,0.3)] backdrop-blur-md border border-white/40 rounded-[32px] p-6 flex flex-col gap-8 relative z-10 overflow-y-auto scroll-hide">

            <EscrowList
                persona={persona}
                hostRequests={hostRequests}
                myTrips={myTrips}
                handleRelease={handleRelease}
                handleDispute={handleDispute}
                handleResolveDispute={handleResolveDispute}
                handleReview={handleReview}
            />

            <PersonaIntelligence
                persona={persona}
                stats={stats}
                badges={badges}
                totalEarned={totalEarned}
            />

        </aside>
    );
};

export default DashboardSidebar;



