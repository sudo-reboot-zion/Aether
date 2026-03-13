import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: { id: string; label: string; icon: LucideIcon }[];
    isCollapsed?: boolean;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ activeTab, setActiveTab, navItems, isCollapsed }) => {
    return (
        <nav className={`flex flex-col gap-4 flex-grow font-sans ${isCollapsed ? 'items-center' : ''}`}>
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-4 transition-all duration-200 text-left
                        ${isCollapsed ? 'p-3 rounded-xl justify-center' : 'p-3.5 rounded-2xl'}
                        ${activeTab === item.id
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-[var(--c-blue-haze)] hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <item.icon className="w-5 h-5 stroke-[1.5] flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                </button>
            ))}
        </nav>
    );
};

export default ProfileNavigation;
