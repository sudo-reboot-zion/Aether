import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = '' }) => {
    return (
        <Link
            href={href}
            className={`
        relative opacity-80 hover:opacity-100 transition-opacity 
        after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] 
        after:bg-[var(--t-primary)] after:transition-all after:duration-300 after:opacity-50 
        hover:after:w-full
        ${className}
      `}
        >
            {children}
        </Link>
    );
};

export default NavLink;
