import React from 'react';
import Link from 'next/link';

const NavLogo = () => {
    return (
        <Link href="/" className="flex items-center gap-3 font-semibold text-2xl tracking-tight text-[var(--t-primary)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-serif tracking-widest text-xl opacity-90">AETHER</span>
        </Link>
    );
};

export default NavLogo;
