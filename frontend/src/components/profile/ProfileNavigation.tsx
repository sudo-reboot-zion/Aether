import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: { id: string; label: string; icon: LucideIcon }[];
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ activeTab, setActiveTab, navItems }) => {
    return (
        <nav className="flex flex-col gap-4 flex-grow font-sans">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200 text-left
                        ${activeTab === item.id
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-[var(--c-blue-haze)] hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <item.icon className="w-5 h-5 stroke-[1.5]" />
                    {item.label}
                </button>
            ))}
        </nav>
    );
};

export default ProfileNavigation;
