"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import Identicon from '../ui/Identicon';
import PersonaSelector from './PersonaSelector';
import ProfileDropdownNav from './ProfileDropdownNav';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { UserPersona } from '@/redux/slices/userSlice';

interface NavbarProfileDropdownProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NavbarProfileDropdown: React.FC<NavbarProfileDropdownProps> = ({ isOpen, onOpenChange }) => {
  const profileRef = React.useRef<HTMLDivElement>(null);
  const { userData, persona, setPersona, disconnectWallet } = useAuth();
  const { t } = useTranslation();

  const shortenedAddress = userData?.profile?.stxAddress?.testnet
    ? `${userData.profile.stxAddress.testnet.slice(0, 4)}...${userData.profile.stxAddress.testnet.slice(-4)}`
    : '';

  const togglePersona = (target: UserPersona) => {
    if (persona !== target) {
      setPersona(target);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onOpenChange]);

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="flex items-center gap-3 pl-4 pr-3 py-1.5 rounded-full bg-[var(--c-blue-deep)]/5 border border-[var(--c-blue-deep)]/10 hover:bg-[var(--c-blue-deep)]/10 transition-all group"
      >
        <span className="text-[10px] font-mono text-[var(--c-blue-deep)] font-medium">
          {shortenedAddress}
        </span>
        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center bg-white/5">
          <Identicon address={userData?.profile?.stxAddress?.testnet || ''} size={28} />
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
              <PersonaSelector currentPersona={persona} onPersonaChange={togglePersona} />
              <ProfileDropdownNav persona={persona} />

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

export default NavbarProfileDropdown;
