"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GlassPanel from '../ui/GlassPanel';
import { useReputation } from '@/hooks/useReputation';
import { useTranslation } from '@/hooks/useTranslation';
import { Star, ShieldCheck, Wind, Zap, Wifi, Droplets, MessageSquare } from 'lucide-react';
import { openBookingChat } from '@/redux/slices/bookingChatSlice';
import { NEIGHBORHOODS } from '@/constants/neighborhoods';
import Identicon from '../ui/Identicon';
import dynamic from 'next/dynamic';

const MapLocation = dynamic(() => import('../ui/MapLocation'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black/5 animate-pulse flex items-center justify-center font-sans text-[10px] uppercase tracking-widest opacity-40">Loading Sanctuary Map...</div>
});

interface PropertyInfoProps {
    description?: string;
    amenities?: string[];
    hostAddress?: string;
    hostName?: string;
    locationId?: number;
    propertyId?: number;
}

const AMENITY_MAP: Record<string, any> = {
    'Wifi': Wifi,
    'Kitchen': Zap,
    'AC': Wind,
    'Pool': Droplets,
    'Gym': ShieldCheck,
};

const PropertyInfo: React.FC<PropertyInfoProps> = ({
    description,
    amenities = [],
    hostAddress,
    hostName = 'Sanctuary Host',
    locationId = 4, // Default to Tokyo if not provided
    propertyId
}) => {
    const { fetchUserStats } = useReputation();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [stats, setStats] = useState<{ averageRating: number; totalReviews: number } | null>(null);
    const neighborhood = NEIGHBORHOODS[locationId];

    useEffect(() => {
        const loadStats = async () => {
            if (hostAddress) {
                const data = await fetchUserStats(hostAddress);
                if (data) {
                    setStats({
                        averageRating: (data.averageRating || 0) / 100,
                        totalReviews: data.totalReviews || 0
                    });
                }
            }
        };
        loadStats();
    }, [hostAddress, fetchUserStats]);

    const hasNoReviews = !stats || stats.totalReviews === 0 || isNaN(stats.averageRating);

    return (
        <div className="flex flex-col gap-8">
            <GlassPanel className="p-10 border border-white/50">
                <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6 font-bold opacity-60">About the Space</h3>
                <p className="text-xl leading-relaxed text-[var(--t-primary)] font-serif italic">
                    {description || "Discover a sanctuary of clarity and peace, where every detail is curated for the modern traveler."}
                </p>

                <div className="flex items-center gap-5 py-6 border-t border-black/5 mt-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-white/5 flex items-center justify-center">
                        {hostAddress ? <Identicon address={hostAddress} size={64} /> : <span className="text-[10px] font-bold text-gray-400">HOST</span>}
                    </div>
                    <div>
                        <div className="text-2xl font-serif text-[var(--t-primary)] font-medium">Hosted by {hostName}</div>
                        <div className="font-sans text-[10px] text-[var(--t-secondary)] flex items-center gap-2 uppercase tracking-widest font-bold mt-1">
                            {!hasNoReviews && stats ? (
                                <>
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    {stats.averageRating.toFixed(1)} Rating • {stats.totalReviews} Reviews
                                </>
                            ) : (
                                "Verified On-Chain Residence"
                            )}
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        {hostAddress && propertyId !== undefined && (
                            <button
                                onClick={() => dispatch(openBookingChat({
                                    bookingId: -(propertyId + 1),
                                    partnerAddress: hostAddress
                                }))}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--c-blue-deep)]/5 hover:bg-[var(--c-blue-deep)]/10 border border-[var(--c-blue-deep)]/10 hover:border-[var(--c-blue-deep)]/20 text-[var(--c-blue-deep)] font-sans text-xs font-bold uppercase tracking-widest transition-all"
                                title="Message Host"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Message Host
                            </button>
                        )}
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm" title="Verified Proof of Ownership">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </GlassPanel>

            <GlassPanel className="p-10 border border-white/50">
                <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6 font-bold opacity-60">Sanctuary Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                    {amenities.length > 0 ? amenities.map((amenity, idx) => {
                        const Icon = AMENITY_MAP[amenity] || Star;
                        return (
                            <div key={idx} className="flex items-center gap-4 text-base py-3 border-b border-black/5 hover:translate-x-1 transition-transform">
                                <Icon className="w-4 h-4 opacity-50" />
                                <span className="font-serif font-medium text-[var(--t-primary)]">{t(`amenity.${amenity.toLowerCase()}`)}</span>
                            </div>
                        );
                    }) : (
                        <div className="text-sm font-sans italic opacity-50">{t('details.noAmenities')}</div>
                    )}
                </div>
            </GlassPanel>

            <GlassPanel className="p-0 overflow-hidden border border-white/50">
                <div className="h-[260px] w-full bg-[#f8f9fa] relative overflow-hidden group">
                    {/* Real Map Integration */}
                    <div className="absolute inset-0 z-0">
                        {neighborhood?.coordinates ? (
                            <MapLocation coordinates={neighborhood.coordinates} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 font-sans text-xs italic">
                                Map Data Unavailable
                            </div>
                        )}
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-sm z-20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-sans text-[9px] uppercase font-bold tracking-widest text-[var(--t-primary)]">Verified Domain</span>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-2 font-bold opacity-60">Location Domain</h3>
                            <p className="text-2xl font-serif text-[var(--t-primary)]">{neighborhood?.title || "Architectural Sanctum"}</p>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-[var(--c-blue-deep)]/5 text-[var(--c-blue-deep)] font-sans text-[9px] font-bold uppercase tracking-wider">
                            {neighborhood?.vibeTag || "Curated"}
                        </span>
                    </div>
                    <p className="text-sm font-sans text-[var(--t-secondary)] leading-relaxed opacity-80 max-w-lg">
                        {neighborhood?.description || "Explore the curated context of this sanctuary on the Stacks Ledger."}
                    </p>
                </div>
            </GlassPanel>
        </div>
    );
};

export default PropertyInfo;
