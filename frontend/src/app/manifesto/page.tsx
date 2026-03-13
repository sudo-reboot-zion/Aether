"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ManifestoHero from '@/components/manifesto/ManifestoHero';
import ManifestoGrid from '@/components/manifesto/ManifestoGrid';
import InquireCTA from '@/components/manifesto/InquireCTA';
import AetherIcon from '@/components/ui/AetherIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { GenerativeLoader } from '@/components/ui/GenerativeLoader';

export default function ManifestoPage() {
    const { t } = useTranslation();
    const [isInitialLoading, setIsInitialLoading] = React.useState(true);

    return (
        <main className="max-w-[1440px] mx-auto min-h-screen px-6 md:px-12 py-16 flex flex-col items-center font-serif">
            {isInitialLoading && (
                <GenerativeLoader
                    duration={2500}
                    messages={["Synthesizing truth...", "Decoding ethos...", "Manifesting future..."]}
                    onComplete={() => setIsInitialLoading(false)}
                />
            )}
            {/* Header / Brand Indicator */}
            <header className="text-center mb-24">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-3 text-2xl mb-8 font-semibold tracking-tight text-[var(--t-primary)] hover:opacity-80 transition-opacity"
                >
                    <AetherIcon className="w-8 h-8" />
                    AETHER
                </Link>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[var(--t-secondary)]">
                    {t('manifesto.hero.subtitle')}
                </p>

            </header>

            <ManifestoHero />

            <ManifestoGrid />

            <InquireCTA />

            <Footer />
        </main>
    );
}
