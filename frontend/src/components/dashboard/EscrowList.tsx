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
}

const EscrowList: React.FC<EscrowListProps> = ({
    persona,
    hostRequests,
    myTrips,
    handleRelease,
    handleDispute,
    handleResolveDispute,
    handleReview,
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="text-xs uppercase tracking-widest text-[var(--t-secondary)] font-semibold">
                    {persona === 'HOST' ? 'Reservation Requests' : 'Active Escrows'}
                </div>
                <div className={`w-2 h-2 rounded-full ${persona === 'HOST' ? (hostRequests.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-gray-300') : (myTrips.length > 0 ? 'bg-emerald-500' : 'bg-gray-300')}`} />
            </div>

            <div className="flex flex-col gap-4">
                {persona === 'HOST' ? (
                    hostRequests.length === 0 ? (
                        <EmptyState
                            compact
                            title="No Pending Requests"
                            description="When travelers request to stay at your sanctuaries, they will appear here for your review."
                        />
                    ) : (
                        hostRequests.map((booking, idx) => (
                            <RequestCard
                                key={`req-${idx}`}
                                user={booking.guest.slice(0, 10) + '...'}
                                type={booking.status === 'completed' ? 'completed' : 'booking'}
                                details={{
                                    dates: `Block #${booking.checkIn}`,
                                    guests: '1',
                                    price: `${(booking.totalAmount / 1000000).toFixed(2)} STX`,
                                    status: booking.status === 'completed' ? 'Payment Received' : 'Active Stay'
                                }}
                            />
                        ))
                    )
                ) : (
                    myTrips.length === 0 ? (
                        <EmptyState
                            compact
                            title="No Active Escrows"
                            description="Your secure blockchain payments for upcoming stays will be managed here."
                        />
                    ) : (
                        myTrips.map((booking, idx) => (
                            <RequestCard
                                key={`trip-${idx}`}
                                user={`Host: ${booking.host.slice(0, 8)}...`}
                                type={booking.status === 'completed' ? 'completed' : (booking.status === 'confirmed' ? 'action_required' : 'booking')}
                                details={{
                                    dates: `Block ${booking.checkIn}`,
                                    guests: 'Verified',
                                    price: `${(booking.totalAmount / 1000000).toFixed(2)} STX`,
                                    status: booking.status
                                }}
                                onRelease={() => handleRelease(booking.id)}
                                onDispute={() => handleDispute(booking.id)}
                                onResolveDispute={() => handleResolveDispute(booking.id)}
                                onReview={handleReview && !booking.hasReviewed ? () => handleReview(booking) : undefined}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default EscrowList;
