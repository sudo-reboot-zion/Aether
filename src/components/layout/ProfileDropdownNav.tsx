"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { UserPersona } from '@/redux/slices/userSlice';

interface ProfileDropdownNavProps {
  persona: UserPersona;
}

const ProfileDropdownNav: React.FC<ProfileDropdownNavProps> = ({ persona }) => {
  const { t } = useTranslation();

  return (
    <div className="py-2">
      <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--c-blue-azure)]/5 transition-colors group">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--t-primary)]">{t('nav.dashboard')}</span>
      </Link>

      <Link href="/profile" className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--c-blue-azure)]/5 transition-colors group">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
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
  );
};

export default ProfileDropdownNav;
