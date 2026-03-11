"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';
import CustomSelect from '../ui/CustomSelect';
import { useTranslation } from '@/hooks/useTranslation';
import { LOCATIONS } from '@/constants/locations';

import { useRouter } from 'next/navigation';

const HeroSection = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [location, setLocation] = useState<string>(LOCATIONS[3].name);

    // Default checkIn to today's date
    const today = new Date().toISOString().split('T')[0];
    const [checkIn, setCheckIn] = useState<string>(today);
    const [guests, setGuests] = useState<string>('2 Guests');

    const handleSearch = () => {
        router.push(`/collection?vibe=${encodeURIComponent(location)}`);
    };

    return (
        <header className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col justify-center">
            <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 flex flex-col gap-8 z-10">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--c-blue-azure)] to-[var(--c-blue-haze)] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[rgba(27,64,102,0.1)] bg-white/60 backdrop-blur-xl shadow-sm animate-badge-glow overflow-hidden">
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_5s_infinite] rotate-12"></div>

                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--c-blue-azure)] animate-float">
                                <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="currentColor" fillOpacity=".1" />
                                <path d="M12 6L4 10V14L12 18L20 14V10L12 6ZM12 8.5L17.5 11.25L12 14L6.5 11.25L12 8.5Z" fill="currentColor" />
                                <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse" />
                            </svg>
                            <span className="font-sans text-[11px] uppercase font-bold tracking-[0.2em] text-[var(--t-primary)] mix-blend-multiply opacity-90">{t('hero.badge')}</span>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] text-[var(--t-primary)]">
                        {t('hero.title')} <br />
                        <span className="italic">{t('hero.italic')}</span> {t('hero.direct')}
                    </h1>

                    <p className="text-xl md:text-2xl text-[var(--t-primary)] opacity-80 font-light max-w-2xl leading-relaxed">
                        {t('hero.description')}
                    </p>

                    <GlassPanel className="p-4 mt-8 max-w-3xl" hover={false}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="px-4 py-2 border-b md:border-b-0 md:border-r border-[rgba(27,64,102,0.1)] w-full">
                                <CustomSelect
                                    label={t('hero.search.location')}
                                    value={location}
                                    onChange={(val) => setLocation(val)}
                                    className="w-full"
                                    options={LOCATIONS.map(loc => ({ value: loc.name, label: loc.name }))}
                                />
                            </div>

                            <div className="px-4 py-2 border-b md:border-b-0 md:border-r border-[rgba(27,64,102,0.1)] relative">
                                <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--t-secondary)] mb-0.5">{t('hero.search.checkIn')}</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="bg-transparent border-none font-serif text-base text-[var(--t-primary)] outline-none m-0 p-0 w-full cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                            </div>

                            <div className="px-4 py-2 border-b md:border-b-0 md:border-r border-[rgba(27,64,102,0.1)] w-full">
                                <CustomSelect
                                    label={t('hero.search.guests')}
                                    value={guests}
                                    onChange={(val) => setGuests(val)}
                                    className="w-full"
                                    options={[
                                        { value: '1 Guest', label: '1 Guest' },
                                        { value: '2 Guests', label: '2 Guests' },
                                        { value: '3 Guests', label: '3 Guests' },
                                        { value: '4 Guests', label: '4 Guests' },
                                        { value: '5+ Guests', label: '5+ Guests' }
                                    ]}
                                />
                            </div>

                            <Button onClick={handleSearch} className="h-full w-full py-4 rounded-xl flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {t('hero.search.button')}
                            </Button>
                        </div>
                    </GlassPanel>
                </div>

                <div className="lg:col-span-5 relative h-[600px] hidden lg:block">
                    <GlassPanel className="absolute top-0 right-0 w-80 h-96 p-2 z-10 transform translate-x-4">
                        <div className="w-full h-full rounded-[16px] overflow-hidden relative">
                            <Image
                                src="/images/hero-interior.jpg"
                                alt="Interior"
                                fill
                                sizes="(max-width: 768px) 100vw, 320px"
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-medium text-[var(--t-primary)] uppercase tracking-wide">{t('hero.kyoto')}</div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="absolute bottom-0 left-0 w-72 h-80 p-2 z-20 transform -translate-x-4">
                        <div className="w-full h-full rounded-[16px] overflow-hidden relative">
                            <Image
                                src="/images/hero-detail.jpg"
                                alt="Detail"
                                fill
                                sizes="(max-width: 768px) 100vw, 288px"
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-medium text-[var(--t-primary)] uppercase tracking-wide">{t('hero.malibu')}</div>
                        </div>
                    </GlassPanel>

                    {/* Orbit Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] border border-[var(--c-blue-azure)]/20 rounded-full z-0 pointer-events-none animate-orbit-slow opacity-40"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[var(--c-blue-azure)]/40 rounded-full z-0 pointer-events-none animate-orbit-glow"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[var(--c-blue-deep)]/30 rounded-full z-0 pointer-events-none animate-orbit-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-[var(--c-blue-deep)]/20 rounded-full z-0 pointer-events-none opacity-50"></div>
                </div>
            </div>
        </header>
    );
};

export default HeroSection;
