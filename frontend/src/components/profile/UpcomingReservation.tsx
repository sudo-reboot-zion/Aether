"use client";
import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowRight, Calendar, User, Home, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { openBookingChat } from '@/redux/slices/bookingChatSlice';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
import { fetchIPFSMetadata, getIPFSUrl, PropertyMetadata } from '@/lib/ipfs';
import SafeImage from '../ui/SafeImage';
import { encodePropertyId } from '@/lib/urls';

const UpcomingReservation = () => {
    const { userData } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet;
    const dispatch = useDispatch();
    const { bookings, fetchUserBookings, isLoading } = useBookings();
    const { properties, fetchProperties } = useProperties();
    const [metadata, setMetadata] = useState<PropertyMetadata | null>(null);

    useEffect(() => {
        if (userAddress) {
            fetchUserBookings(userAddress);
            fetchProperties();
        }
    }, [userAddress, fetchUserBookings, fetchProperties]);

    // Find the most recent upcoming confirmed booking
    const upcoming = bookings
        .filter(b => b.status === 'confirmed')
        .sort((a, b) => a.checkIn - b.checkIn)[0];

    const property = properties.find(p => p.id === upcoming?.propertyId);

    useEffect(() => {
        const loadMetadata = async () => {
            if (property?.metadataUri) {
                const data = await fetchIPFSMetadata(property.metadataUri);
                setMetadata(data);
            }
        };
        loadMetadata();
    }, [property]);

    if (isLoading && !upcoming) {
        return (
            <div className="mb-12 h-[400px] rounded-[32px] bg-white/50 animate-pulse border border-black/5 flex items-center justify-center">
                <span className="text-[var(--t-secondary)] font-sans italic">Scanning dimensions for your next stay...</span>
            </div>
        );
    }

    if (!upcoming) {
        return (
            <section className="mb-12">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-serif text-[var(--t-primary)] font-semibold">Upcoming Reservation</h2>
                </div>
                <div className="h-[200px] rounded-[32px] bg-white/40 border border-dashed border-black/10 flex flex-col items-center justify-center gap-4 text-center p-8">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--c-blue-azure)] shadow-sm">
                        <Home className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[var(--t-primary)] font-medium font-serif text-lg">No journeys on the horizon</p>
                        <p className="text-[var(--t-secondary)] text-sm font-sans">The ledger is quiet. Time to find your next sanctuary.</p>
                    </div>
                </div>
            </section>
        );
    }

    const displayTitle = metadata?.title || `Sanctuary #${encodePropertyId(upcoming.propertyId)}`;
    const displayImage = metadata?.images?.[0] || '/images/hero-interior.jpg';

    return (
        <section className="mb-12">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-serif text-[var(--t-primary)] font-semibold">Upcoming Reservation</h2>
                <a href="/dashboard" className="flex items-center gap-1 text-[var(--c-blue-azure)] text-sm font-semibold hover:text-[var(--c-blue-deep)] transition-colors font-sans uppercase tracking-wide">
                    Manage <ChevronRight className="w-4 h-4" />
                </a>
            </div>

            <div className="relative h-[400px] rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(61,52,47,0.06)] group">
                <SafeImage
                    src={displayImage}
                    alt={displayTitle}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 flex items-end justify-between p-8">
                    <div className="bg-white/15 backdrop-blur-xl border border-white/20 text-white flex flex-wrap gap-8 items-center p-5 rounded-3xl min-w-[300px] md:min-w-[400px] ml-auto">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider opacity-80 font-sans">Property</span>
                            <span className="text-lg font-semibold font-serif truncate max-w-[150px]">{displayTitle}</span>
                        </div>
                        <div className="hidden sm:block w-[1px] h-10 bg-white/20"></div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider opacity-80 font-sans">Check-in</span>
                            <span className="text-lg font-semibold font-serif">Block {upcoming.checkIn}</span>
                        </div>
                        <div className="hidden sm:block w-[1px] h-10 bg-white/20"></div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider opacity-80 font-sans">Status</span>
                            <span className="text-lg font-semibold font-serif capitalize">{upcoming.status}</span>
                        </div>

                        <div
                            onClick={() => dispatch(openBookingChat({ bookingId: upcoming.id, partnerAddress: property?.owner || '' }))}
                            className="w-12 h-12 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center cursor-pointer ml-auto hover:bg-black/60 transition-colors shadow-lg"
                            title="Message Host"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </div>

                        <div className="w-12 h-12 rounded-full bg-white text-[var(--t-primary)] flex items-center justify-center cursor-pointer hover:bg-[#F5F3EB] transition-colors shadow-lg">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingReservation;
