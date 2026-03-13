import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../../ui/GlassPanel';
import Identicon from '../../ui/Identicon';
import { UserPersona } from '@/redux/slices/userSlice';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfileMenuProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    shortenedAddress: string;
    stxAddress: string;
    persona: UserPersona;
    togglePersona: (target: UserPersona) => void;
    disconnectWallet: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
    isOpen, setOpen, shortenedAddress, stxAddress, persona, togglePersona, disconnectWallet
}) => {
    const { t } = useTranslation();

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!isOpen)}
                className="flex items-center gap-3 pl-4 pr-3 py-1.5 rounded-full bg-[var(--c-blue-deep)]/5 border border-[var(--c-blue-deep)]/10 hover:bg-[var(--c-blue-deep)]/10 transition-all group"
            >
                <span className="text-[10px] font-mono text-[var(--c-blue-deep)] font-medium">
                    {shortenedAddress}
                </span>
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center bg-white/5">
                    <Identicon address={stxAddress} size={28} />
                </div>
                <svg
                    viewBox="0 0 24 24"
                    className={`w-3 h-3 text-[var(--c-blue-deep)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
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
    );
};

export default ProfileMenu;
