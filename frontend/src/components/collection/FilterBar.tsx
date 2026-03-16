"use client";
import React from 'react';
import CustomSelect from '../ui/CustomSelect';
import Button from '../ui/Button';

interface FilterBarProps {
    location: string;
    setLocation: (v: string) => void;
    priceRange: string;
    setPriceRange: (v: string) => void;
    sortBy: string;
    setSortBy: (v: string) => void;
    activeFilter: string;
    setActiveFilter: (v: string) => void;
}

import { LOCATIONS } from '@/constants/locations';
import { VIBES } from '@/constants/vibes';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { setSearchQuery } from '@/redux/slices/searchSlice';
import SearchInput from '../ui/SearchInput';
import { useTranslation } from '@/hooks/useTranslation';

const FilterBar: React.FC<FilterBarProps> = ({
    location, setLocation,
    priceRange, setPriceRange,
    sortBy, setSortBy,
    activeFilter, setActiveFilter
}) => {
    const { t } = useTranslation();
    const filters = [t('collection.filters.allStays'), ...VIBES.map(v => t(`vibes.${v.slug}`))];
    const dispatch = useDispatch();
    const query = useSelector((state: RootState) => state.search.query);

    return (
        <header className="mb-12">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
                <div>
                    <h1 className="text-5xl font-light text-[var(--t-primary)] mb-2 tracking-tight">{t('collection.title')}</h1>
                    <p className="font-sans text-xs uppercase tracking-widest text-[var(--t-secondary)] font-bold">{t('collection.subtitle')}</p>
                </div>

                <div className="bg-[var(--c-white-glass)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.4)] rounded-[var(--radius-lg)] p-2 flex flex-col md:flex-row items-center gap-2 w-full xl:w-auto shadow-[0_4px_24px_-1px_rgba(27,64,102,0.05)]">
                    <div className="px-4 py-1.5 border-b md:border-b-0 md:border-r border-[rgba(27,64,102,0.1)] w-full md:min-w-[240px]">
                        <SearchInput
                            value={query}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            className="mt-1"
                        />
                    </div>
                    <div className="px-4 py-1.5 border-b md:border-b-0 md:border-r border-[rgba(27,64,102,0.1)] w-full md:w-auto">
                        <CustomSelect
                            label={t('collection.filters.location')}
                            value={location}
                            onChange={(val) => setLocation(val)}
                            className="min-w-[140px]"
                            options={[
                                { value: 'all', label: t('collection.filters.allLocations') },
                                ...LOCATIONS.map(loc => ({ value: loc.id.toString(), label: t(`location.${loc.name.toLowerCase()}`) }))
                            ]}
                        />
                    </div>
                    <div className="px-4 py-1.5 border-b md:border-b-0 md:border-r border-[rgba(27,64,102,0.1)] w-full md:w-auto">
                        <CustomSelect
                            label={t('collection.filters.maxPrice')}
                            value={priceRange}
                            onChange={(val) => setPriceRange(val)}
                            className="min-w-[120px]"
                            options={[
                                { value: 'any', label: t('collection.filters.anyPrice') },
                                { value: '0.5', label: `${t('collection.filters.under')} 0.5 STX` },
                                { value: '1.0', label: `${t('collection.filters.under')} 1.0 STX` },
                                { value: '5.0', label: `${t('collection.filters.under')} 5.0 STX` },
                            ]}
                        />
                    </div>
                    <Button className="p-3 !rounded-lg h-auto shadow-none w-full md:w-auto flex justify-center mt-2 md:mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-4 scroll-hide">
                {[t('collection.filters.allStays'), ...VIBES.map(v => t(`vibes.${v.slug}`))].map((label, index) => {
                    const filterValue = index === 0 ? 'All Stays' : VIBES[index - 1].name;
                    return (
                        <button
                            key={filterValue}
                            className={`
              px-5 py-2 rounded-full font-sans text-[10px] uppercase tracking-[0.15em] font-bold transition-all duration-200 border
              ${activeFilter === filterValue
                                    ? 'bg-[var(--t-primary)] text-white border-[var(--t-primary)] scale-105 shadow-md'
                                    : 'bg-white/40 border-white/40 hover:bg-white/60 text-[var(--t-primary)]'
                                }
            `}
                            onClick={() => setActiveFilter(filterValue)}
                        >
                            {label}
                        </button>
                    );
                })}
                <div className="ml-auto flex items-center gap-4 whitespace-nowrap pl-4">
                    <span className="font-sans text-[10px] text-[var(--t-secondary)] uppercase tracking-widest font-bold">{t('collection.filters.sortBy')}</span>
                    <select
                        className="bg-transparent font-sans text-[10px] font-bold uppercase tracking-wider text-[var(--t-primary)] outline-none cursor-pointer border-none p-0"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value={t('collection.filters.newest')}>{t('collection.filters.newest')}</option>
                        <option value={t('collection.filters.priceLowHigh')}>{t('collection.filters.priceLowHigh')}</option>
                        <option value={t('collection.filters.priceHighLow')}>{t('collection.filters.priceHighLow')}</option>
                    </select>
                </div>
            </div>
        </header>
    );
};

export default FilterBar;
