"use client";
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { fetchFavorites } from '@/redux/slices/favoritesSlice';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
import Link from 'next/link';
import { encodePropertyId } from '@/lib/urls';

const SavedHomes = () => {
    const dispatch = useDispatch();
    const { userData } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet || '';
    const { properties, fetchProperties } = useProperties();
    const { savedIds, isFetching: profileLoading } = useSelector((state: RootState) => state.favorites);

    useEffect(() => {
        if (userAddress && savedIds.length === 0) {
            dispatch(fetchFavorites(userAddress) as any);
        }
        if (properties.length === 0) {
            fetchProperties();
        }
    }, [userAddress, dispatch, fetchProperties, properties.length, savedIds.length]);

    const favoriteHomes = properties.filter(p => savedIds.includes(p.id));

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--t-primary)] font-semibold mb-6">Saved Homes</h2>

            {(favoriteHomes.length === 0 && !profileLoading) ? (
                <div className="bg-white/40 border border-dashed border-black/10 rounded-[32px] p-10 flex flex-col items-center justify-center text-center gap-3">
                    <div className="p-3 bg-white rounded-full text-pink-400 shadow-sm mb-1">
                        <Heart className="w-6 h-6" />
                    </div>
                    <p className="text-[var(--t-primary)] font-serif text-lg font-medium">Your sanctuary collection is empty</p>
                    <p className="text-[var(--t-secondary)] text-sm font-sans max-w-[280px]">Bookmark properties you love to see them here in your private vault.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteHomes.map(fav => (
                        <Link href={`/details/${encodePropertyId(fav.id)}`} key={fav.id} className="bg-white rounded-[24px] p-2.5 shadow-[0_4px_20px_rgba(61,52,47,0.04)] cursor-pointer transition-transform hover:-translate-y-1 duration-300 block">
                            <div className="relative aspect-[3/4] rounded-[18px] overflow-hidden mb-3">
                                {fav.metadata?.images && fav.metadata.images.length > 0 ? (
                                    <SafeImage
                                        src={fav.metadata.images[0]}
                                        alt={fav.metadata.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-[var(--c-cream)] flex items-center justify-center text-[var(--c-blue-azure)]">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#E91E63] shadow-sm transform hover:scale-110 transition-transform">
                                    <Heart className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                            <div className="px-1 pb-1">
                                <h3 className="text-lg font-semibold text-[var(--t-primary)] font-serif mb-0.5">{fav.metadata?.title || 'Untitled Property'}</h3>
                                <p className="text-[var(--t-secondary)] text-sm font-sans">{fav.metadata?.location || 'Unknown Location'}</p>
                            </div>
                        </Link>
                    ))}
                    {profileLoading && (
                        <div className="animate-pulse bg-white/20 rounded-[24px] aspect-[3/4.5]" />
                    )}
                </div>
            )}
        </section>
    );
};

export default SavedHomes;

