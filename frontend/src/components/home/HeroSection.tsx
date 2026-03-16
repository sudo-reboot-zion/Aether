"use client";
import React from 'react';
import Image from 'next/image';
import GlassPanel from '../ui/GlassPanel';
import { useTranslation } from '@/hooks/useTranslation';
import ProtocolStatsPanel from './ProtocolStatsPanel';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <header className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col justify-center">
            <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 flex flex-col gap-8 z-10">
                    <div className="flex items-center gap-6 group mb-4">
                        {/* Sovereign Mark - Architectural Anchor */}
                        <div className="relative flex items-center h-12">
                            <div className="w-[1px] h-full bg-[var(--c-blue-azure)]/30 absolute left-1/2 -translate-x-1/2 group-hover:h-16 transition-all duration-700"></div>
                            <div className="relative z-10 w-8 h-8 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-sm border border-[var(--c-blue-azure)]/20 shadow-sm animate-float">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--c-blue-azure)] group-hover:rotate-45 transition-transform duration-700">
                                    <rect x="3" y="3" width="18" height="18" rx="1" />
                                    <path d="M12 3v18" />
                                    <path d="M3 12h18" />
                                    <circle cx="12" cy="12" r="4" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="font-sans text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--t-primary)] opacity-60">Digital Sovereignty</span>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-1.5 w-1.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--c-blue-azure)] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--c-blue-azure)]" />
                                </span>
                                <span className="font-sans text-[11px] uppercase font-medium tracking-[0.15em] text-[var(--t-primary)] whitespace-nowrap">
                                    {t('hero.badge')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] text-[var(--t-primary)]">
                        {t('hero.title')} <br />
                        <span className="italic">{t('hero.italic')}</span> {t('hero.direct')}
                    </h1>

                    <p className="text-xl md:text-2xl text-[var(--t-primary)] opacity-80 font-light max-w-2xl leading-relaxed">
                        {t('hero.description')}
                    </p>

                    <ProtocolStatsPanel />
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
