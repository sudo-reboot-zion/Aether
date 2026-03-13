import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    Compass,
    User,
    MessageSquare,
    MoreHorizontal,
    BarChart3
} from 'lucide-react';
import { DashboardSidebarProps } from '@/redux/slices/redux.types';
import ProfileImage from '../profile/ProfileImage';

const DashboardSidebar: React.FC<DashboardSidebarProps & {
    activeItem?: string;
    setActiveItem?: (id: string) => void;
    userData?: any;
}> = ({
    persona,
    activeItem = 'dashboard',
    setActiveItem,
    userData
}) => {
        const [isCollapsed, setIsCollapsed] = useState(false);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const userAddress = userData?.profile?.stxAddress?.testnet;
        const shortAddress = userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Not Connected';
        const userName = userData?.profile?.name || (persona === 'HOST' ? 'Host' : 'Traveler');

        const navItems = [
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
            { id: 'explore', icon: Compass, label: 'Explore', href: '/collection' },
            ...(persona === 'HOST' ? [{ id: 'analytics', icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' }] : []),
            { id: 'messages', icon: MessageSquare, label: 'Messages', href: '/profile?tab=messages' },
            { id: 'profile', icon: User, label: 'Profile', href: '/profile' }
        ];

        return (
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 88 : 380 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`flex flex-col gap-8 relative z-50 shadow-[4px_0_24px_rgba(0,0,0,0.05)] rounded-r-[32px] h-full overflow-y-auto scroll-hide group/sidebar p-8 py-10
            ${persona === 'HOST' ? 'bg-[#0F1D2C] text-white border-r border-white/5' : 'bg-[var(--c-blue-deep)] text-white border-r border-white/5'}`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute right-4 top-8 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover/sidebar:opacity-100 z-50 text-white/70 hover:text-white"
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>

                {/* Logo */}
                <Link href="/" className={`flex items-center gap-3 font-semibold text-xl tracking-tight text-white/90 ${isCollapsed ? 'justify-center' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 flex-shrink-0 text-[var(--c-blue-azure)]">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>AETHER</motion.span>}
                </Link>

                {/* Identity Section */}
                <div className={`flex flex-col gap-4 mt-4 ${isCollapsed ? 'items-center' : ''}`}>
                    <ProfileImage
                        profileImage={userData?.profile?.image || '/images/generic-avatar.png'}
                        isUploading={false}
                        onUploadClick={() => { }} // Read-only on dashboard
                        address={userAddress}
                        isCollapsed={isCollapsed}
                    />
                    {!isCollapsed && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-2xl font-medium leading-tight font-serif mb-1 truncate">
                                Hi {userName.split(' ')[0]}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${userAddress ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                                <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">{shortAddress}</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Navigation */}
                <nav className={`flex flex-col gap-2 mt-2 ${isCollapsed ? 'items-center' : ''}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setActiveItem?.(item.id)}
                            title={isCollapsed ? item.label : undefined}
                            className={`flex items-center gap-4 transition-all duration-200 
                            ${isCollapsed ? 'p-3 rounded-xl justify-center' : 'p-3.5 rounded-2xl'}
                            ${activeItem === item.id
                                    ? 'bg-white/10 text-white font-medium shadow-lg shadow-black/10'
                                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className="flex-shrink-0" />
                            {!isCollapsed && <span className="text-[13px] font-sans tracking-wide">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Pinned Bottom Item (Quick Chat) */}
                <div className={`mt-auto pt-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
                    <Link
                        href="/profile?tab=messages"
                        className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white group
                        ${isCollapsed ? 'w-12 h-12 justify-center rounded-full' : ''}`}
                        title="Open Messages"
                    >
                        <MessageSquare size={18} className="flex-shrink-0" />
                        {!isCollapsed && <span className="text-[11px] font-sans uppercase tracking-widest font-bold">Quick Chat</span>}
                    </Link>
                </div>
            </motion.aside>
        );
    };

export default DashboardSidebar;


