"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassPanel from '../ui/GlassPanel';
import NavLink from '../ui/NavLink';
import Button from '../ui/Button';
import NavbarLanguageSwitcher from './NavbarLanguageSwitcher';
import NavbarNotificationIcon from './NavbarNotificationIcon';
import NavbarProfileDropdown from './NavbarProfileDropdown';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { useNavbarNotifications } from '@/hooks/useNavbarNotifications';

const Navbar = () => {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const { userData, connectWallet } = useAuth();

  // Setup notifications polling
  useNavbarNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 px-8 py-6 transition-all duration-300">
      <GlassPanel className="max-w-[1440px] mx-auto flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-semibold text-2xl tracking-tight text-[var(--t-primary)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="font-serif tracking-widest text-xl opacity-90">AETHER</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 font-sans text-[11px] tracking-[0.2em] text-[var(--t-primary)] uppercase font-bold">
          <NavLink href="/collection">{t('nav.collection')}</NavLink>
          <NavLink href="/about">{t('nav.about')}</NavLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <NavbarLanguageSwitcher isOpen={languageOpen} onOpenChange={setLanguageOpen} />

          {/* Auth Section */}
          {mounted && userData ? (
            <div className="flex items-center gap-4">
              <NavbarNotificationIcon />
              <NavbarProfileDropdown isOpen={profileOpen} onOpenChange={setProfileOpen} />
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
