"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import GlassPanel from './GlassPanel';
import Link from 'next/link';
import { encodePropertyId } from '@/lib/urls';
import { fetchIPFSMetadata, PropertyMetadata } from '@/lib/ipfs';
import SafeImage from './SafeImage';
import { Heart, Star, MapPin, Users, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { addFavorite } from '@/redux/slices/favoritesSlice';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface PropertyCardProps {
    id?: string | number;
    metadataUri?: string;
    image?: string;
    title?: string;
    location?: string;
    rating?: string | number;
    badge?: string;
    badgePosition?: 'top' | 'bottom';
    price?: string;
    usdPrice?: string;
    guests?: string;
    feature?: string;
    architect?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    id, metadataUri, image, title, location, rating = "Verified", badge, badgePosition = 'top', price, usdPrice, guests, feature, architect
}) => {
    const dispatch = useDispatch();
    const { userData } = useAuth();
    const { saveProperty } = useProfile();
    const [metadata, setMetadata] = useState<PropertyMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(!!metadataUri);
    const savedIds = useSelector((state: RootState) => state.favorites.savedIds);

    const isSaved = id !== undefined && savedIds.includes(Number(id));

    useEffect(() => {
        const load = async () => {
            if (metadataUri) {
                const data = await fetchIPFSMetadata(metadataUri);
                if (data) setMetadata(data);
                setIsLoading(false);
            }
        };
        load();
    }, [metadataUri]);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userData) return;
        if (id !== undefined) {
            await saveProperty(Number(id));
            // Optimistically update
            dispatch(addFavorite(Number(id)));
        }
    };

    const displayTitle = metadata?.title || title || 'Enigma Sanctuary';
    const displayLocation = metadata?.location || location || 'Undisclosed Location';
    // Filter out stale blob:/data: URLs from old listings — they expired when the session ended
    const validImages = metadata?.images?.filter(
        (url) => url && !url.startsWith('blob:') && !url.startsWith('data:')
    ) || [];
    const rawImage = validImages[0] || image || '';
    const displayImage = rawImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070';
    const displayPrice = price || 'Valuation Pending';

    return (
        <div className="block h-full no-underline relative group">
            <Link href={id !== undefined ? `/details/${encodePropertyId(Number(id))}` : '#'}>
                <GlassPanel className="p-3 group cursor-pointer h-full flex flex-col">
                    <div className="relative overflow-hidden rounded-[20px] aspect-[4/3] mb-4 bg-gray-100">
                        {!isLoading ? (
                            <SafeImage
                                src={displayImage}
                                alt={displayTitle}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full animate-pulse bg-[rgba(27,64,102,0.05)]" />
                        )}
                        {badge && (
                            <div className={`absolute ${badgePosition === 'bottom' ? 'bottom-4' : 'top-4'} left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm`}>
                                <span className="font-sans text-[10px] font-bold text-[var(--t-primary)] uppercase tracking-wide">{badge}</span>
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                            <Star className="h-3 w-3 text-[var(--t-primary)] fill-current" />
                            <span className="font-sans text-xs font-semibold text-[var(--t-primary)]">{isLoading ? '...' : rating}</span>
                        </div>
                    </div>

                    <div className="px-2 pb-2 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-2xl font-normal text-[var(--t-primary)] leading-tight">
                                {isLoading ? 'Fetching Sanctuary...' : displayTitle}
                            </h4>
                        </div>
                        <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--t-secondary)] mb-4 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 opacity-60" /> {isLoading ? 'Scanning Blockchain...' : displayLocation} {architect && `• ${architect}`}
                        </p>

                        {(guests || feature) && (
                            <div className="flex gap-4 mb-4 mt-auto">
                                {guests && <div className="font-sans text-[10px] text-[var(--t-secondary)] uppercase tracking-wide flex items-center gap-1.5"><Users className="w-3 h-3" /> {guests}</div>}
                                {feature && <div className="font-sans text-[10px] text-[var(--t-secondary)] uppercase tracking-wide flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> {feature}</div>}
                            </div>
                        )}

                        <div className="flex justify-between items-end border-t border-[rgba(27,64,102,0.1)] pt-3 mt-auto">
                            <div>
                                <span className="text-xl font-normal text-[var(--t-primary)] block">{displayPrice}</span>
                                {usdPrice && <span className="text-xs text-[var(--t-secondary)] font-sans block">≈ {usdPrice} / night</span>}
                            </div>
                            {!usdPrice && <span className="text-sm text-[var(--t-secondary)] font-sans"> / night</span>}
                        </div>
                    </div>
                </GlassPanel>
            </Link>

            {/* Heart Button Overlay */}
            {id !== undefined && (
                <button
                    onClick={handleSave}
                    className={`absolute bottom-[115px] right-6 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 z-10
                        ${isSaved ? 'bg-[var(--c-blue-azure)] text-white scale-110 shadow-blue-500/20' : 'bg-white/80 text-[var(--t-secondary)] hover:scale-110 hover:bg-white'}`}
                >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
            )}
        </div>
    );
};

export default PropertyCard;
