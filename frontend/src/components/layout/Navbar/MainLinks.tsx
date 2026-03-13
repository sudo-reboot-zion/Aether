import React from 'react';
import NavLink from '../../ui/NavLink';
import { useTranslation } from '@/hooks/useTranslation';

const MainLinks = () => {
    const { t } = useTranslation();

    return (
        <div className="hidden md:flex items-center gap-10 font-sans text-[11px] tracking-[0.2em] text-[var(--t-primary)] uppercase font-bold">
            <NavLink href="/collection">{t('nav.collection')}</NavLink>
            <NavLink href="/about">{t('nav.about')}</NavLink>
        </div>
    );
};

export default MainLinks;
