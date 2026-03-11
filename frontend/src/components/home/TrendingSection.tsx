"use client";
import React, { useEffect } from 'react';
import PropertyCard from '../ui/PropertyCard';
import EmptyState from '../ui/EmptyState';
import ListingCardSkeleton from '../ui/ListingCardSkeleton';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useProperties } from '@/hooks/useProperties';

const TrendingSection = () => {
    const { t } = useTranslation();
    const { properties, fetchProperties, isLoading } = useProperties();
    const [currentBlock, setCurrentBlock] = React.useState<number>(0);

    useEffect(() => {
        if (properties.length === 0) {
            fetchProperties();
        }

        // Fetch current block height for "New" badge logic
        import('@/lib/network').then(m => m.getCurrentBlockHeight().then(setCurrentBlock));
    }, [fetchProperties, properties.length]);

    // Use the 3 most recent properties from the blockchain
    const displayProperties = [...properties]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3);

    return (
        <section className="py-24 px-6">
            <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-4">{t('trending.collection')}</h2>
                        <h3 className="text-4xl md:text-5xl font-light text-[var(--t-primary)]">{t('trending.title')}</h3>
                    </div>
                    <Link href="/collection" className="group flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-[var(--t-primary)] pb-1 border-b border-transparent hover:border-[var(--t-primary)] transition-all">
                        {t('trending.viewAll')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading && properties.length === 0 ? (
                        Array(3).fill(0).map((_, i) => (
                            <ListingCardSkeleton key={i} />
                        ))
                    ) : displayProperties.length > 0 ? (
                        displayProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                id={property.id}
                                metadataUri={property.metadataUri}
                                price={`${(property.pricePerNight / 1000000).toFixed(2)} STX`}
                                badge={property.id < 0 ? 'Pending' : undefined}
                                rating={currentBlock > 0 && currentBlock - property.createdAt < 1000 ? 'New' : 'Verified'}
                            />
                        ))
                    ) : (
                        <div className="col-span-full">
                            <EmptyState
                                title="No Sanctuaries Yet"
                                description="The aether is currently still. Our curated collection of sanctuaries is being prepared for the next generation of travelers."
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;
