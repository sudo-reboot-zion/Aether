"use client";
import React from 'react';
import Link from 'next/link';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { Home, Compass, Mail } from 'lucide-react';

const InquireSection = () => {
    const { t } = useTranslation();

    return (
        <section className="max-w-[1200px] mx-auto px-6 mb-40">
            <div className="text-center mb-16">
                <h3 className="text-5xl font-light text-[var(--t-primary)] mb-6 font-serif">{t('about.inquire.title')}</h3>
                <p className="text-lg text-[var(--t-secondary)] max-w-2xl mx-auto font-sans opacity-80 leading-relaxed">
                    {t('about.inquire.description')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* Owners Path */}
                <GlassPanel className="p-12 flex flex-col items-center text-center !bg-white/40 border border-white/60 hover:shadow-2xl transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--c-blue-deep)]/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <Home className="w-8 h-8 text-[var(--c-blue-deep)] opacity-60" />
                    </div>
                    <h4 className="text-2xl font-serif text-[var(--t-primary)] mb-4">{t('about.inquire.host.title')}</h4>
                    <p className="text-sm text-[var(--t-secondary)] font-sans mb-10 leading-relaxed opacity-70">
                        {t('about.inquire.host.desc')}
                    </p>
                    <Link href="/dashboard/list-property" className="w-full">
                        <Button className="w-full py-4 rounded-xl text-[10px] tracking-[0.2em]">{t('about.inquire.host.button')}</Button>
                    </Link>
                </GlassPanel>

                {/* Travelers Path */}
                <GlassPanel className="p-12 flex flex-col items-center text-center !bg-white/40 border border-white/60 hover:shadow-2xl transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--c-blue-azure)]/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <Compass className="w-8 h-8 text-[var(--c-blue-azure)] opacity-60" />
                    </div>
                    <h4 className="text-2xl font-serif text-[var(--t-primary)] mb-4">{t('about.inquire.traveler.title')}</h4>
                    <p className="text-sm text-[var(--t-secondary)] font-sans mb-10 leading-relaxed opacity-70">
                        {t('about.inquire.traveler.desc')}
                    </p>
                    <Link href="/collection" className="w-full">
                        <Button variant="outline" className="w-full py-4 rounded-xl text-[10px] tracking-[0.2em]">{t('about.inquire.traveler.button')}</Button>
                    </Link>
                </GlassPanel>
            </div>

            {/* Subtle Direct Contact */}
            <div className="flex flex-col items-center pt-8 border-t border-black/5">
                <div className="flex items-center gap-3 text-[var(--t-secondary)] mb-4">
                    <Mail className="w-4 h-4 opacity-40" />
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">{t('about.inquire.emailLabel')}</span>
                </div>
                <a
                    href={`mailto:${t('about.inquire.email')}`}
                    className="text-xl font-serif text-[var(--t-primary)] hover:text-[var(--c-blue-azure)] transition-colors border-b border-black/10 pb-1"
                >
                    {t('about.inquire.email')}
                </a>
            </div>
        </section>
    );
};

export default InquireSection;
