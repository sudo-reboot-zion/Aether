"use client";
import React from 'react';
import GlassPanel from '../ui/GlassPanel';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

const MissionSection = () => {
    const { t } = useTranslation();
    return (
        <section className="px-6 mb-32">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                    <GlassPanel className="p-3">
                        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl">
                            <Image
                                src="/images/philosophy-experience.jpg"
                                alt="Aether Design"
                                fill
                                className="object-cover editorial-image"
                            />
                        </div>
                    </GlassPanel>
                </div>
                <div className="lg:col-span-5 lg:pl-12">
                    <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-4">{t('about.mission.title')}</h3>
                    <p className="text-3xl font-medium text-[var(--t-primary)] leading-snug font-serif">
                        {t('about.mission.description')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
