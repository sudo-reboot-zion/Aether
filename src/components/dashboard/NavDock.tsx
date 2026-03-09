import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Compass, User, MoreHorizontal, Home } from 'lucide-react';
import { NavDockProps } from '@/redux/slices/redux.types';



const NavDock: React.FC<NavDockProps> = ({ activeItem, setActiveItem }) => {
    const navItems = [
        {
            id: 'dashboard',
            icon: <LayoutDashboard size={20} />,
            href: '/dashboard'
        },
        {
            id: 'explore',
            icon: <Compass size={20} />,
            href: '/collection'
        },
        {
            id: 'profile',
            icon: <User size={20} />,
            href: '/profile'
        },
        {
            id: 'more',
            icon: <MoreHorizontal size={20} />,
            href: '#'
        }
    ];

    return (
        <nav className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col items-center py-8 gap-8 bg-[var(--c-surface)] backdrop-blur-xl border border-[rgba(255,255,255,0.4)] rounded-full shadow-lg z-50 w-[88px]">
            <Link href="/" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm hover:scale-105 transition-transform active:scale-95">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[var(--t-primary)]">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </Link>

            {navItems.map(item => (
                <Link
                    key={item.id}
                    href={item.href}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 
                        ${activeItem === item.id
                            ? 'bg-[var(--c-cream)] text-[var(--t-primary)] shadow-sm'
                            : 'text-[var(--t-secondary)] hover:bg-[rgba(0,0,0,0.03)] hover:text-[var(--t-primary)]'
                        }`}
                    onClick={() => setActiveItem(item.id)}
                >
                    {item.icon}
                </Link>
            ))}

            <div className="flex-grow"></div>
        </nav>
    );
};

export default NavDock;
