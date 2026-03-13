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
}

const EscrowList: React.FC<EscrowListProps> = ({
    persona,
    hostRequests,
    myTrips,
    handleRelease,
    handleDispute,
    handleResolveDispute,
    handleReview
}) => {
    const hasPending = persona === 'HOST' ? hostRequests.length > 0 : myTrips.length > 0;
    const count = persona === 'HOST' ? hostRequests.length : myTrips.length;

    return (
        <div className="bg-white/60 backdrop-blur-md border border-black/5 rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--t-primary)]">
                        {persona === 'HOST' ? 'Pending Actions' : 'Active Escrows'}
                    </h2>
                    {count > 0 && (
                        <div className="bg-[var(--c-blue-azure)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                            {count}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {persona === 'HOST' ? (
                    hostRequests.length === 0 ? (
                        <div className="py-8 text-center text-[var(--t-secondary)] text-sm font-light italic">
                            No requests requiring action.
                        </div>
                    ) : (
                        hostRequests.map((booking, idx) => (
                            <RequestCard
                                key={idx}
                                user={booking.guest}
                                type="action_required"
                                details={{
                                    dates: `Block ${booking.checkIn}`,
                                    price: `${(booking.totalAmount / 1_000_000).toFixed(2)} STX`
                                }}
                                onResolveDispute={() => handleResolveDispute(booking.id)}
                            />
                        ))
                    )
                ) : (
                    myTrips.length === 0 ? (
                        <div className="py-8 text-center text-[var(--t-secondary)] text-sm font-light italic">
                            No active stays or escrows.
                        </div>
                    ) : (
                        myTrips.map((booking, idx) => (
                            <RequestCard
                                key={idx}
                                user={booking.host}
                                type={booking.status === 'completed' ? 'completed' : 'booking'}
                                details={{
                                    dates: `Block ${booking.checkIn}`,
                                    price: `${(booking.totalAmount / 1_000_000).toFixed(2)} STX`,
                                    status: booking.status === 'completed' ? 'STAY COMPLETED' : 'ACTIVE STAY'
                                }}
                                onRelease={() => handleRelease(booking.id)}
                                onDispute={() => handleDispute(booking.id)}
                                onReview={booking.status === 'completed' && !booking.hasReviewed ? () => handleReview?.(booking) : undefined}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default EscrowList;
