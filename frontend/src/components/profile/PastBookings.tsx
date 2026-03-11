"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import SafeImage from '../ui/SafeImage';
import { useBookings } from '@/hooks/useBookings';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { fetchIPFSMetadata, getIPFSUrl, PropertyMetadata } from '@/lib/ipfs';
import { encodePropertyId } from '@/lib/urls';

import { useReputation } from '@/hooks/useReputation';
import { useAetherDialog } from '@/hooks/useAetherDialog';

const BookingItem = ({ booking }: { booking: any }) => {
    const { properties } = useProperties();
    const { submitReview } = useReputation();
    const [metadata, setMetadata] = useState<PropertyMetadata | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);

    const property = properties.find(p => p.id === booking.propertyId);

    useEffect(() => {
        const loadMetadata = async () => {
            if (property?.metadataUri) {
                const data = await fetchIPFSMetadata(property.metadataUri);
                setMetadata(data);
            }
        };
        loadMetadata();
    }, [property]);

    const { confirm, prompt } = useAetherDialog();

    const handleReview = async () => {
        const rating = await prompt('Rate your stay (1-5)', 'How was your experience at this sanctuary? Please provide a score from 1 to 5.', '5');
        if (!rating) return;

        const comment = await prompt('Tell us more', 'Your feedback helps the Aether community thrive. Share a few words about your stay.');

        if (rating && comment && property) {
            await submitReview(
                booking.id || 0,
                property.owner,
                parseInt(rating),
                comment
            );
        }
    };

    const displayTitle = metadata?.title || `Sanctuary #${encodePropertyId(booking.propertyId)}`;
    const displayLocation = metadata?.location || 'Stacks Blockchain';
    const displayImage = metadata?.images?.[0] || '/images/trending-casa.jpg';

    // Convert block heights to a readable date (rough estimate)
    const dateStr = `Block ${booking.checkIn} - ${booking.checkOut}`;

    return (
        <article className="grid grid-cols-[100px_1.5fr_1fr_auto] items-center bg-white p-4 rounded-3xl gap-6 shadow-[0_4px_20px_rgba(61,52,47,0.04)] border border-[rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
            <div className="relative w-[100px] h-[80px] rounded-2xl overflow-hidden bg-gray-50">
                <SafeImage
                    src={displayImage}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-[var(--t-primary)] mb-1 font-serif truncate">{displayTitle}</h3>
                <span className="text-[var(--t-secondary)] text-sm font-sans">{displayLocation}</span>
            </div>
            <div>
                <div className="text-sm text-[var(--t-primary)] font-medium flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-[var(--t-secondary)]" />
                    {dateStr}
                </div>
                <div className="flex gap-2 mt-1">
                    <div className="inline-flex items-center gap-1 bg-[#F5F2EF] px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-[var(--c-blue-azure)]">★</span> Verified stay
                    </div>
                    {booking.status === 'completed' && (
                        <button
                            onClick={handleReview}
                            className="inline-flex items-center gap-1 bg-[var(--c-blue-deep)] text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--c-blue-azure)] transition-colors"
                        >
                            Review
                        </button>
                    )}
                </div>
            </div>
            <div className="text-right pr-4">
                <span className="font-bold text-[var(--t-primary)] block font-serif text-lg">
                    {(booking.totalAmount / 1000000).toFixed(2)} STX
                </span>
            </div>
        </article>
    );
};

const PastBookings = () => {
    const { userData } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet;
    const { bookings, fetchUserBookings, isLoading } = useBookings();
    const { fetchProperties } = useProperties();

    useEffect(() => {
        if (userAddress) {
            fetchUserBookings(userAddress);
            fetchProperties(); // Needed to resolve property info
        }
    }, [userAddress, fetchUserBookings, fetchProperties]);

    const confirmedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed');

    return (
        <section className="mb-12">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-serif text-[var(--t-primary)] font-semibold">Booking History</h2>
                <button className="flex items-center gap-1 text-[var(--c-blue-azure)] text-sm font-semibold hover:text-[var(--c-blue-deep)] transition-colors font-sans uppercase tracking-wide">
                    View All Explorer <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {isLoading && bookings.length === 0 ? (
                    <div className="py-10 text-center animate-pulse text-[var(--t-secondary)] font-sans italic">
                        Syncing your travel history...
                    </div>
                ) : confirmedBookings.length === 0 ? (
                    <div className="py-12 px-8 bg-white/50 rounded-3xl border border-dashed border-black/10 text-center">
                        <p className="text-[var(--t-secondary)] font-sans italic">No confirmed stays found on the ledger yet.</p>
                    </div>
                ) : (
                    confirmedBookings.map((booking, idx) => (
                        <BookingItem key={idx} booking={booking} />
                    ))
                )}
            </div>
        </section>
    );
};

export default PastBookings;
