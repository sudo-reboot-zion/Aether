"use client";
import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FilterBar from '../../components/collection/FilterBar';
import PropertyCard from '../../components/ui/PropertyCard';
import EmptyState from '../../components/ui/EmptyState';
import ListingCardSkeleton from '../../components/ui/ListingCardSkeleton';
import { useProperties } from '@/hooks/useProperties';
import { useSearchParams } from 'next/navigation';
import { VIBES } from '@/constants/vibes';
import { LOCATIONS } from '@/constants/locations';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { GenerativeLoader } from '@/components/ui/GenerativeLoader';
import { LayoutGrid, List } from 'lucide-react';

function CollectionContent() {
    const { properties, fetchProperties, isLoading } = useProperties();
    const searchParams = useSearchParams();
    const initialVibe = searchParams.get('vibe');
    const query = useSelector((state: RootState) => state.search.query);

    // Filter State
    const [location, setLocation] = useState('all');
    const [priceRange, setPriceRange] = useState('any');
    const [sortBy, setSortBy] = useState('Newest');
    const [activeFilter, setActiveFilter] = useState('All Stays');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Set initial filter from query param
    useEffect(() => {
        if (initialVibe) {
            const vibe = VIBES.find(v => v.id.toString() === initialVibe || v.slug === initialVibe);
            if (vibe) {
                setActiveFilter(vibe.name);
            }
        }
    }, [initialVibe]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const filteredProperties = useMemo(() => {
        let result = [...properties];

        //- [x] Integrate into `ManifestoPage`
        // [/] Integrate into `PropertyDetailsPage`
        // [ ] Integrate into `DashboardPage`
        // [ ] Integrate into `ProfilePage`
        // [x] Verify implementation
        // 1. Filter by Location
        if (location !== 'all') {
            result = result.filter(p => p.locationTag.toString() === location);
        }

        // 2. Filter by Price
        if (priceRange !== 'any') {
            const maxPrice = parseFloat(priceRange);
            result = result.filter(p => (p.pricePerNight / 1000000) <= maxPrice);
        }

        // 3. Filter by Category (activeFilter)
        if (activeFilter !== 'All Stays') {
            const vibeId = VIBES.find(v => v.name === activeFilter)?.id;
            if (vibeId) {
                result = result.filter(p => p.categoryTag === vibeId);
            }
        }

        // 4. Filter by Search Query
        if (query && query.trim() !== '') {
            const lowerQuery = query.toLowerCase();
            result = result.filter(p => {
                if (p.metadata) {
                    const titleMatch = p.metadata.title?.toLowerCase().includes(lowerQuery);
                    const locMatch = p.metadata.location?.toLowerCase().includes(lowerQuery);
                    if (titleMatch || locMatch) return true;
                }
                const locationName = LOCATIONS.find(l => l.id === p.locationTag)?.name?.toLowerCase() || '';
                if (locationName.includes(lowerQuery)) return true;

                return false;
            });
        }

        // 5. Sort
        if (sortBy === 'Price: Low to High') {
            result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        } else if (sortBy === 'Price: High to Low') {
            result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        } else {
            result.sort((a, b) => b.createdAt - a.createdAt);
        }

        return result;
    }, [properties, location, priceRange, sortBy, activeFilter, query]);

    return (
        <div className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <FilterBar
                    location={location}
                    setLocation={setLocation}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                <div className="flex bg-white/40 backdrop-blur-sm p-1 rounded-full border border-white/20 shadow-sm self-end md:self-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-[var(--c-blue-deep)] text-white shadow-md' : 'text-[var(--t-secondary)] hover:bg-white/40'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-[var(--c-blue-deep)] text-white shadow-md' : 'text-[var(--t-secondary)] hover:bg-white/40'}`}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "flex flex-col gap-6"}>
                {isLoading && properties.length === 0 ? (
                    Array(6).fill(0).map((_, i) => (
                        <ListingCardSkeleton key={i} layout={viewMode} />
                    ))
                ) : filteredProperties.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyState
                            title="No Sanctuaries Matched"
                            description="We couldn't find any sanctuaries matching your current search criteria. Try adjusting your filters to explore more possibilities."
                            action={{
                                label: "Clear All Filters",
                                onClick: () => { setLocation('all'); setPriceRange('any'); setActiveFilter('All Stays'); }
                            }}
                        />
                    </div>
                ) : (
                    filteredProperties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            id={property.id}
                            metadataUri={property.metadataUri}
                            price={`${(property.pricePerNight / 1000000).toFixed(2)} STX`}
                            badge={property.id < 0 ? 'Pending' : undefined}
                            layout={viewMode}
                        />
                    ))
                )}
            </div>

            {!isLoading && filteredProperties.length > 0 && (
                <div className="mt-20 flex justify-center items-center gap-4">
                    <div className="flex gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em]">
                        <button className="w-10 h-10 rounded-full bg-[var(--t-primary)] text-white flex items-center justify-center shadow-lg">1</button>
                        <span className="flex items-center px-2 text-[var(--t-secondary)] opacity-60">Verified Ledger</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CollectionPage() {
    const [isInitialLoading, setIsInitialLoading] = React.useState(true);

    return (
        <main className="min-h-screen">
            {isInitialLoading && (
                <GenerativeLoader
                    duration={2500}
                    messages={["Syncing ledger...", "Fetching sanctuaries...", "Vibe discovery..."]}
                    completeMessage="Collection Ready"
                    onComplete={() => setIsInitialLoading(false)}
                />
            )}
            <Navbar />
            <Suspense fallback={<div className="pt-32 pb-24 text-center font-serif text-[var(--t-secondary)]">Loading collection...</div>}>
                <CollectionContent />
            </Suspense>
            <Footer />
        </main>
    );
}
