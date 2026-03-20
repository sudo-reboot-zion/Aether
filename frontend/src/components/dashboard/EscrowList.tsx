import React from 'react';
import RequestCard from './RequestCard';
import EmptyState from '../ui/EmptyState';
import { Persona } from '@/redux/slices/redux.types';

interface EscrowListProps {
    persona: Persona;
    hostRequests: any[];
    myTrips: any[];
    handleRelease: (id: number) => void;
    handleDispute: (id: number) => void;
    handleResolveDispute: (bookingId: number) => void;
    handleReview?: (booking: any) => void;
    isCollapsed?: boolean;
    blockHeight?: number;
    isReleasing?: boolean;
}

const EscrowList: React.FC<EscrowListProps> = ({
    persona,
    hostRequests,
    myTrips,
    handleRelease,
    handleDispute,
    handleResolveDispute,
    handleReview,
    blockHeight,
    isReleasing
}) => {
    const activeItems = persona === 'HOST'
        ? hostRequests.filter(b => b.status === 'confirmed')
        : myTrips.filter(b => b.status !== 'completed');

    const completedItems = persona === 'HOST'
        ? hostRequests.filter(b => b.status === 'completed')
        : myTrips.filter(b => b.status === 'completed');

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white/60 backdrop-blur-md border border-black/5 rounded-[32px] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--t-primary)]">
                            {persona === 'HOST' ? 'Pending Actions' : 'Active Escrows'}
                        </h2>
                        {activeItems.length > 0 && (
                            <div className="bg-[var(--c-blue-azure)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                                {activeItems.length}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    {activeItems.length === 0 ? (
                        <div className="py-8 text-center text-[var(--t-secondary)] text-sm font-light italic">
                            No active {persona === 'HOST' ? 'requests' : 'stays'} requiring action.
                        </div>
                    ) : (
                        activeItems.map((booking, idx) => (
                            <RequestCard
                                key={idx}
                                user={persona === 'HOST' ? booking.guest : booking.host}
                                type={persona === 'HOST' ? "action_required" : "booking"}
                                details={{
                                    dates: `Block ${booking.checkIn}`,
                                    price: `${(booking.totalAmount / 1_000_000).toFixed(2)} STX`
                                }}
                                onRelease={persona === 'GUEST' ? () => handleRelease(booking.id) : undefined}
                                onDispute={persona === 'GUEST' ? () => handleDispute(booking.id) : undefined}
                                onResolveDispute={persona === 'HOST' ? () => handleResolveDispute(booking.id) : undefined}
                                currentBlockHeight={blockHeight}
                                checkInBlock={booking.checkIn}
                                isReleasing={isReleasing}
                            />
                        ))
                    )}
                </div>
            </div>

            {completedItems.length > 0 && (
                <div className="bg-white/40 backdrop-blur-sm border border-black/5 rounded-[32px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--t-secondary)]">
                            Stay History
                        </h2>
                    </div>
                    <div className="flex flex-col gap-5">
                        {completedItems.map((booking, idx) => (
                            <RequestCard
                                key={idx}
                                user={persona === 'HOST' ? booking.guest : booking.host}
                                type="completed"
                                details={{
                                    dates: `Block ${booking.checkIn}`,
                                    price: `${(booking.totalAmount / 1_000_000).toFixed(2)} STX`,
                                    status: 'STAY COMPLETED'
                                }}
                                onReview={persona === 'GUEST' && !booking.hasReviewed ? () => handleReview?.(booking) : undefined}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EscrowList;
