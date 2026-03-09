"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { useLanguage } from '@/hooks/useLanguage';

interface NavbarLanguageSwitcherProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

const NavbarLanguageSwitcher: React.FC<NavbarLanguageSwitcherProps> = ({ isOpen, onOpenChange }) => {
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    onOpenChange(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
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
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 pt-2 z-50"
          >
            <GlassPanel className="min-w-[140px] overflow-hidden !bg-white/95 border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.1)] py-2 rounded-2xl">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--t-primary)] hover:bg-[var(--c-blue-azure)]/10 transition-colors font-bold ${language === lang.code ? 'opacity-100' : 'opacity-50'}`}
                >
                  {lang.label}
                </button>
              ))}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarLanguageSwitcher;
