"use client";
import React from 'react';
import Image from 'next/image';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';


const PhilosophySection = () => {
    const { t } = useTranslation();
    return (
        <section className="py-24 bg-white/20 backdrop-blur-sm border-y border-white/40">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-start pt-20">
                    <div className="relative lg:translate-y-24">
                        {/* Main Image Container with specific tilt */}
                        <div className="relative z-10 transition-transform hover:scale-[1.02] duration-700 max-w-[480px]">
                            <GlassPanel className="p-3 rotate-[3deg] w-full aspect-[0.85/1] relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden group border-white/60">
                                <div className="relative w-full h-full rounded-[14px] overflow-hidden">
                                    <Image
                                        src="/images/philosophy-experience.jpg"
                                        alt="Experience"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 480px"
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            </GlassPanel>

                            {/* Verification Badge Overlap - centered on bottom edge */}
                            <GlassPanel className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-5 flex items-center gap-5 z-20 shadow-xl border border-white/80 bg-white/60 backdrop-blur-2xl rounded-[20px] min-w-[300px]">
                                <div className="bg-[var(--c-blue-azure)]/10 p-4 rounded-full">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6 text-[var(--c-blue-azure)]">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                </div>
                                <div className="pr-2">
                                    <div className="font-sans text-[0.6rem] uppercase text-[var(--t-secondary)] tracking-[0.25em] font-bold mb-1 opacity-60">{t('philosophy.verification')}</div>
                                    <div className="font-serif text-lg text-[var(--t-primary)] leading-none font-medium">{t('philosophy.blockchainSecured')}</div>
                                </div>
                            </GlassPanel>
                        </div>

                        {/* Decorative background aura */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--c-blue-haze)]/20 rounded-full blur-[120px] -z-10" />
                    </div>

                    <div className="pt-2">
                        <h2 className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[var(--t-secondary)] mb-6 font-bold">{t('philosophy.vision')}</h2>
                        <h3 className="text-5xl md:text-6xl font-light text-[var(--t-primary)] mb-8 leading-[1.1] font-serif">{t('philosophy.title')}</h3>
                        <p className="text-xl text-[var(--t-primary)] opacity-70 mb-10 font-serif leading-relaxed max-w-xl">
                            {t('philosophy.description')}
                        </p>

                        <div className="space-y-8 max-w-lg">
                            <div className="flex items-start gap-6 group">
                                <div className="mt-1 transition-transform group-hover:scale-110 duration-500">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--c-blue-azure)]">
                                        <path d="M12 3v4M3 12h4m14-9l-2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-serif font-normal mb-2 text-[var(--t-primary)]">{t('philosophy.p2p.title')}</h4>
                                    <p className="text-sm text-[var(--t-secondary)] leading-relaxed opacity-80">{t('philosophy.p2p.desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="mt-1 transition-transform group-hover:scale-110 duration-500">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--c-blue-azure)]">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-serif font-normal mb-2 text-[var(--t-primary)]">{t('philosophy.security.title')}</h4>
                                    <p className="text-sm text-[var(--t-secondary)] leading-relaxed opacity-80">{t('philosophy.security.desc')}</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/manifesto">
                            <Button className="mt-12 px-10 py-4 text-xs tracking-widest uppercase font-bold bg-[var(--c-blue-deep)] hover:bg-[var(--c-blue-azure)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                {t('philosophy.manifesto')}
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default PhilosophySection;
