import React from 'react';
import Link from 'next/link';

const NavLogo = () => {
    return (
        <Link href="/" className="flex items-center gap-3 font-semibold text-2xl tracking-tight text-[var(--t-primary)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M7 19a4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 .1-1 7 7 0 0 1 13.8 0l.1 1a4 4 0 0 1 4 4 4 4 0 0 1-4 4H7z" />
            </svg>
            <span className="font-serif tracking-widest text-xl opacity-90">AETHER</span>
        </Link>
    );
};

export default NavLogo;
