"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bell } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import NavLink from '../ui/NavLink';
import Button from '../ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { UserPersona } from '@/redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux';
import { fetchSessions, clearNotifications } from '@/redux/slices/bookingChatSlice';
import Identicon from '../ui/Identicon';

const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [languageOpen, setLanguageOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();
    const { userData, persona, setPersona, connectWallet, disconnectWallet } = useAuth();
    const { hasNotifications, isOpen: isChatOpen } = useSelector((state: RootState) => state.bookingChat);

    // Ref for handling click outside
    const profileRef = React.useRef<HTMLDivElement>(null);
    const langRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Polling for notifications
    React.useEffect(() => {
        const address = userData?.profile?.stxAddress?.testnet;
        if (!address) return;

        // Initial fetch
        dispatch(fetchSessions(address));

        // Poll every 30 seconds
        const interval = setInterval(() => {
            if (!isChatOpen) {
                dispatch(fetchSessions(address));
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [userData, dispatch, isChatOpen]);

    const handleLanguageChange = (lang: string) => {
        changeLanguage(lang);
        setLanguageOpen(false);
    };

    const togglePersona = (target: UserPersona) => {
        if (persona !== target) {
            setPersona(target);
        }
    };

    const shortenedAddress = userData?.profile?.stxAddress?.testnet
        ? `${userData.profile.stxAddress.testnet.slice(0, 4)}...${userData.profile.stxAddress.testnet.slice(-4)}`
        : '';

    return (
        <nav className="fixed top-0 w-full z-50 px-8 py-6 transition-all duration-300">
            <GlassPanel className="max-w-[1440px] mx-auto flex justify-between items-center px-8 py-4">
                <Link href="/" className="flex items-center gap-3 font-semibold text-2xl tracking-tight text-[var(--t-primary)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="font-serif tracking-widest text-xl opacity-90">AETHER</span>
                </Link>

                <div className="hidden md:flex items-center gap-10 font-sans text-[11px] tracking-[0.2em] text-[var(--t-primary)] uppercase font-bold">
                    <NavLink href="/collection">{t('nav.collection')}</NavLink>
                    <NavLink href="/about">{t('nav.about')}</NavLink>
                </div>

                <div className="flex items-center gap-6">
                    {/* Language Switcher */}
                    <div
                        className="relative"
                        onMouseEnter={() => setLanguageOpen(true)}
                        onMouseLeave={() => setLanguageOpen(false)}
                    >
                        <div className="flex items-center gap-2.5 cursor-pointer py-2 px-1 hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--t-primary)] opacity-50">
                                <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
                            </svg>
                            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--t-primary)] font-bold">
                                {language}
                            </span>
                        </div>

                        <AnimatePresence>
                            {languageOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full right-0 pt-2 z-50"
                                >
                                    <GlassPanel className="min-w-[140px] overflow-hidden !bg-white/95 border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.1)] py-2 rounded-2xl">
                                        {['en', 'ja', 'es', 'fr'].map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => handleLanguageChange(lang)}
                                                className={`w-full text-left px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--t-primary)] hover:bg-[var(--c-blue-azure)]/10 transition-colors font-bold ${language === lang ? 'opacity-100' : 'opacity-50'}`}
                                            >
                                                {lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : lang === 'es' ? 'Español' : 'Français'}
                                            </button>
                                        ))}
                                    </GlassPanel>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Auth Section */}
                    {mounted && userData ? (
                        <div className="flex items-center gap-4">
                            {/* Message Alert */}
                            <Link
                                href="/profile?tab=messages"
                                onClick={() => dispatch(clearNotifications())}
                                className="relative p-2 rounded-full hover:bg-[var(--c-blue-deep)]/5 transition-colors group"
                            >
                                <MessageSquare className="w-5 h-5 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors opacity-70" />
                                {hasNotifications && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                )}
                            </Link>

                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-3 pl-4 pr-3 py-1.5 rounded-full bg-[var(--c-blue-deep)]/5 border border-[var(--c-blue-deep)]/10 hover:bg-[var(--c-blue-deep)]/10 transition-all group"
                                >
                                    <span className="text-[10px] font-mono text-[var(--c-blue-deep)] font-medium">
                                        {shortenedAddress}
                                    </span>
                                    <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center bg-white/5">
                                        <Identicon address={userData.profile.stxAddress.testnet} size={28} />
                                    </div>
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={`w-3 h-3 text-[var(--c-blue-deep)] transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute top-full right-0 pt-3 z-50 origin-top-right"
                                        >
                                            <GlassPanel className="w-64 !bg-white/95 border border-white/60 shadow-[0_30px_60px_rgba(27,64,102,0.15)] rounded-[24px] overflow-hidden p-0">
                                                {/* Persona Segmented Control */}
                                                <div className="p-4 bg-[var(--c-blue-deep)]/5 border-b border-black/5">
                                                    <div className="flex bg-white/50 p-1 rounded-xl relative border border-black/5">
                                                        <motion.div
                                                            className="absolute inset-y-1 rounded-[10px] bg-[var(--c-blue-deep)] shadow-lg z-0"
                                                            initial={false}
                                                            animate={{
                                                                left: persona === 'GUEST' ? '4px' : '50%',
                                                                right: persona === 'GUEST' ? '50%' : '4px',
                                                            }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                                        />
                                                        <button
                                                            onClick={() => togglePersona('GUEST')}
                                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider relative z-10 transition-colors duration-300 ${persona === 'GUEST' ? 'text-white' : 'text-[var(--t-secondary)]'}`}
                                                        >
                                                            Guest
                                                        </button>
                                                        <button
                                                            onClick={() => togglePersona('HOST')}
                                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider relative z-10 transition-colors duration-300 ${persona === 'HOST' ? 'text-white' : 'text-[var(--t-secondary)]'}`}
                                                        >
                                                            Host
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Navigation Links */}
                                                <div className="py-2">
                                                    <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--c-blue-azure)]/5 transition-colors group">
                                                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                                                        </svg>
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--t-primary)]">{t('nav.dashboard')}</span>
                                                    </Link>
                                                    <Link href="/profile" className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--c-blue-azure)]/5 transition-colors group">
                                                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                                        </svg>
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--t-primary)]">{t('nav.profile')}</span>
                                                    </Link>
                                                    {persona === 'HOST' && (
                                                        <Link href="/dashboard/list-property" className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--c-blue-azure)]/5 transition-colors group">
                                                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                <path d="M5 12h14M12 5v14" />
                                                            </svg>
                                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--t-primary)]">{t('nav.addListing')}</span>
                                                        </Link>
                                                    )}
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 border-t border-black/5 bg-black/[0.02]">
                                                    <button
                                                        onClick={disconnectWallet}
                                                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl hover:bg-red-50 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/80 hover:text-red-500 transition-all"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                                                        </svg>
                                                        {t('nav.disconnect')}
                                                    </button>
                                                </div>
                                            </GlassPanel>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={connectWallet} className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[var(--c-blue-deep)]/10">
                            {t('nav.connect')}
                        </Button>
                    )}
                </div>
            </GlassPanel>
        </nav>
    );
};

export default Navbar;
