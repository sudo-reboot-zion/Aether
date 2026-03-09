"use client";
import React from 'react';
import GlassPanel from '../ui/GlassPanel';
import Link from 'next/link';
import Button from '../ui/Button';
import { useTranslation } from '@/hooks/useTranslation';


const ArchitectureSection = () => {
    const { t } = useTranslation();
    return (
        <section className="max-w-[1100px] mx-auto px-6 mb-32">
            <GlassPanel className="p-12 border border-[rgba(255,255,255,0.6)] bg-[var(--c-white-glass)]">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6">{t('about.architecture.title')}</h2>
                    <h3 className="text-4xl font-light text-[var(--t-primary)] mb-8 font-serif">{t('about.architecture.subtitle')}</h3>
                    <p className="text-lg text-[var(--t-primary)] font-medium mb-12 leading-relaxed">
                        {t('about.architecture.description')}
                    </p>
                    <div className="flex justify-center mb-16">
                        <Link href="/manifesto">
                            <Button variant="outline" className="border-[var(--c-blue-azure)] text-[var(--c-blue-azure)] hover:bg-[var(--c-blue-azure)] hover:text-white px-8">
                                {t('philosophy.manifesto')}
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-[rgba(61,124,184,0.1)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--c-blue-azure)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <h4 className="font-sans text-sm uppercase tracking-wide font-semibold text-[var(--t-primary)] mb-3">{t('about.architecture.features.ownership.title')}</h4>
                        <p className="text-sm text-[var(--t-secondary)] font-light">{t('about.architecture.features.ownership.desc')}</p>
                    </div>
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-[rgba(61,124,184,0.1)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--c-blue-azure)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h4 className="font-sans text-sm uppercase tracking-wide font-semibold text-[var(--t-primary)] mb-3">{t('about.architecture.features.transferable.title')}</h4>
                        <p className="text-sm text-[var(--t-secondary)] font-light">{t('about.architecture.features.transferable.desc')}</p>
                    </div>
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-[rgba(61,124,184,0.1)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--c-blue-azure)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h4 className="font-sans text-sm uppercase tracking-wide font-semibold text-[var(--t-primary)] mb-3">{t('about.architecture.features.settlements.title')}</h4>
                        <p className="text-sm text-[var(--t-secondary)] font-light">{t('about.architecture.features.settlements.desc')}</p>
                    </div>
                </div>
            </GlassPanel>
        </section>
    );
};

export default ArchitectureSection;
