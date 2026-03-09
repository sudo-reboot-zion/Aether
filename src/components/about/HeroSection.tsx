"use client";
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const HeroSection = () => {
    const { t } = useTranslation();
    return (
        <section className="pt-48 pb-24 px-6">
            <div className="max-w-[1100px] mx-auto">
                <div className="mb-32">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(27,64,102,0.1)] bg-[rgba(255,255,255,0.3)] w-fit mb-8">
                        <span className="font-sans text-xs uppercase tracking-wider text-[var(--t-secondary)]">{t('about.hero.badge')}</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-light leading-[0.95] text-[var(--t-primary)] mb-12">
                        {t('about.hero.title')} <br />
                        {t('about.hero.titleLine2')} <span className="italic font-serif">{t('about.hero.sovereignty')}</span>
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <p className="text-2xl font-normal text-[var(--t-primary)] leading-relaxed font-serif">
                            {t('about.hero.desc1')}
                        </p>
                        <p className="text-lg text-[var(--t-primary)] font-sans font-medium leading-relaxed pt-2">
                            {t('about.hero.desc2')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
