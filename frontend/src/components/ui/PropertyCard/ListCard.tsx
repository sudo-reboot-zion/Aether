"use client";
import React from 'react';
import Link from 'next/link';
import SafeImage from '../SafeImage';
import GlassPanel from '../GlassPanel';
import { Heart, Star, MapPin, Users, Sparkles } from 'lucide-react';
import { CurrencyDisplay } from '../CurrencyDisplay';

interface ListCardProps {
    id?: string | number;
    encodePropertyId: (id: number) => string;
    displayImage: string;
    displayTitle: string;
    displayLocation: string;
    displayPrice: string | number;
    isLoading: boolean;
    rating: string | number;
    badge?: string;
    badgePosition?: 'top' | 'bottom';
    guests?: string;
    feature?: string;
    architect?: string;
    isSaved: boolean;
    handleSave: (e: React.MouseEvent) => void;
}

const ListCard: React.FC<ListCardProps> = ({
    id, encodePropertyId, displayImage, displayTitle, displayLocation, displayPrice,
    isLoading, rating, badge, badgePosition, guests, feature, architect,
    isSaved, handleSave
}) => {
    return (
        <div className="block w-full no-underline relative group mb-4">
            <Link href={id !== undefined ? `/details/${encodePropertyId(Number(id))}` : '#'}>
                <GlassPanel className="p-4 group cursor-pointer h-full flex flex-row gap-8 items-stretch">
                    <div className="relative overflow-hidden rounded-[20px] w-1/3 min-w-[300px] aspect-[16/10] bg-gray-100 flex-shrink-0">
                        {!isLoading ? (
                            <SafeImage
                                src={displayImage}
                                alt={displayTitle}
                                fill
                                sizes="(max-width: 768px) 100vw, 400px"
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
                    </div>

                    <div className="flex-1 py-2 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-3xl font-normal text-[var(--t-primary)] leading-tight">
                                    {isLoading ? 'Fetching Sanctuary...' : displayTitle}
                                </h4>
                                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <Star className="h-3 w-3 text-[var(--t-primary)] fill-current" />
                                    <span className="font-sans text-xs font-semibold text-[var(--t-primary)]">{isLoading ? '...' : rating}</span>
                                </div>
                            </div>

                            <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 opacity-60" /> {isLoading ? 'Scanning Blockchain...' : displayLocation} {architect && `• Architect: ${architect}`}
                            </p>

                            {(guests || feature) && (
                                <div className="flex gap-8 mb-6">
                                    {guests && <div className="font-sans text-xs text-[var(--t-secondary)] uppercase tracking-widest flex items-center gap-2.5"><Users className="w-4 h-4" /> {guests} Guests</div>}
                                    {feature && <div className="font-sans text-xs text-[var(--t-secondary)] uppercase tracking-widest flex items-center gap-2.5"><Sparkles className="w-4 h-4" /> {feature}</div>}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end border-t border-[rgba(27,64,102,0.1)] pt-5">
                            <div>
                                <span className="text-2xl font-normal text-[var(--t-primary)] inline-block mr-2">
                                    <CurrencyDisplay amount={typeof displayPrice === 'string' ? parseFloat(displayPrice) : displayPrice} />
                                </span>
                                <span className="text-sm text-[var(--t-secondary)] font-sans">/ night</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handleSave}
                                    className={`p-3 rounded-full shadow-md backdrop-blur-md transition-all duration-300
                                        ${isSaved ? 'bg-[var(--c-blue-azure)] text-white scale-110 shadow-blue-500/20' : 'bg-white/80 text-[var(--t-secondary)] hover:scale-110 hover:bg-white'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                </button>

                                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--t-secondary)] opacity-40 group-hover:opacity-100 transition-opacity">
                                    View Details
                                </span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </Link>
        </div>
    );
};

export default ListCard;
