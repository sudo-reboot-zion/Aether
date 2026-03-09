"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';


const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="pt-24 pb-12 px-6 border-t border-[rgba(27,64,102,0.1)] mt-12 bg-white/30 backdrop-blur-md">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 font-semibold text-2xl tracking-tight text-[var(--t-primary)] mb-6">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            AETHER
                        </div>
                        <p className="text-[var(--t-primary)] font-medium text-sm leading-relaxed mb-6">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-4 items-center">
                            <a href="#" className="text-[var(--t-primary)] hover:text-[var(--c-blue-azure)] transition-colors" aria-label="X (Twitter)">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="text-[var(--t-primary)] hover:text-[var(--c-blue-azure)] transition-colors" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="text-[var(--t-primary)] hover:text-[var(--c-blue-azure)] transition-colors" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6 font-bold">{t('footer.discovery')}</h4>
                        <ul className="space-y-4 font-normal text-[var(--t-primary)] text-sm">
                            <li><Link href="/collection" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.collection')}</Link></li>
                            <li><Link href="/collection" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.trending')}</Link></li>
                            <li><Link href="/collection" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.vibes')}</Link></li>
                            <li><Link href="/manifesto" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.manifesto')}</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6 font-bold">{t('footer.hosting')}</h4>
                        <ul className="space-y-4 font-normal text-[var(--t-primary)] text-sm">
                            <li><Link href="/dashboard" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.listSanctuary')}</Link></li>
                            <li><Link href="/dashboard" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.hostDashboard')}</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.hostingStandards')}</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.safetyTrust')}</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6 font-bold">{t('footer.support')}</h4>
                        <ul className="space-y-4 font-normal text-[var(--t-primary)] text-sm mb-6">
                            <li><Link href="/about" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.about')}</Link></li>
                            <li><a href="#" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.help')}</a></li>
                        </ul>
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-[var(--t-secondary)] font-bold">{t('footer.newsletter')}</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder={t('footer.emailPlaceholder')}
                                    className="bg-white/50 border border-[rgba(27,64,102,0.1)] rounded-lg px-3 py-2 w-full text-xs font-serif outline-none focus:border-[var(--c-blue-azure)] transition-colors placeholder:text-[var(--t-primary)]/40"
                                />
                                <button className="bg-[var(--t-primary)] text-white px-3 py-2 rounded-lg hover:bg-[var(--c-blue-azure)] transition-colors shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[rgba(27,64,102,0.05)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-8">
                        <div className="text-[10px] text-[var(--t-secondary)] font-sans font-medium uppercase tracking-widest">
                            {t('footer.copyright')}
                        </div>
                        <div className="flex gap-4 text-[9px] text-[var(--t-secondary)]/40 font-sans font-medium uppercase tracking-[0.2em]">
                            <a href="https://explorer.hiro.so" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.protocol')}</a>
                            <a href="https://stacks.co" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--c-blue-azure)] transition-colors">{t('footer.network')}</a>
                        </div>
                    </div>
                    <div className="flex gap-8 text-[10px] text-[var(--t-secondary)] font-sans font-medium uppercase tracking-widest">
                        <a href="#" className="hover:text-[var(--t-primary)] transition-colors">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-[var(--t-primary)] transition-colors">{t('footer.terms')}</a>
                    </div>


                </div>
            </div>
        </footer>
    );
};

export default Footer;
