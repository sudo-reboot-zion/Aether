"use client";
import React from 'react';
import { Calendar, Heart, Settings, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import ProfileImage from './ProfileImage';
import ProfileAchievements from './ProfileAchievements';
import ProfileNavigation from './ProfileNavigation';
import { useProfileSidebar } from '@/hooks/useProfileSidebar';

interface ProfileSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, setActiveTab }) => {
    const {
        userData, isLoading, persona, userAddress,
        badges, badgeTypes, profileImage, isUploading,
        fileInputRef, handleImageUpload, userName, shortAddress
    } = useProfileSidebar();

    if (isLoading) {
        return (
            <aside className="bg-[var(--c-blue-deep)] text-white p-8 flex flex-col gap-8 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] rounded-r-3xl h-full animate-pulse">
                <div className="h-8 w-32 bg-white/10 rounded-lg" />
                <div className="flex flex-col gap-4">
                    <div className="w-[88px] h-[88px] rounded-full bg-white/10" />
                    <div className="h-6 w-48 bg-white/10 rounded" />
                    <div className="h-4 w-32 bg-white/10 rounded" />
                </div>
            </aside>
        );
    }

    return (
        <aside className={`p-8 flex flex-col gap-8 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] rounded-r-3xl h-full overflow-y-auto scroll-hide transition-colors duration-500
            ${persona === 'HOST' ? 'bg-[#0F1D2C] text-white' : 'bg-[var(--c-blue-deep)] text-white'}`}>
            <Link href="/" className="flex items-center gap-3 font-semibold text-xl tracking-tight text-white/90">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                AETHER
            </Link>

            <div className="flex flex-col gap-4">
                <ProfileImage
                    profileImage={profileImage}
                    isUploading={isUploading}
                    onUploadClick={() => fileInputRef.current?.click()}
                    address={userAddress}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                />
                <div>
                    <h1 className="text-3xl font-medium leading-tight font-serif mb-1 truncate">
                        Hi {typeof userName === 'string' ? userName.split(' ')[0] : (String(persona) === 'HOST' ? 'Host' : 'Traveler')}
                    </h1>
                    <div className="flex items-center gap-3 mt-1 cursor-pointer group" title="Click to copy address" onClick={() => {
                        if (userAddress) {
                            navigator.clipboard.writeText(userAddress);
                            alert("Address copied to clipboard");
                        }
                    }}>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/5 group-hover:bg-black/30 transition-all`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${userAddress ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                            <span className="font-mono text-[10px] text-white/90 tracking-tighter uppercase">{shortAddress}</span>
                        </div>
                        <p className="text-[var(--c-blue-haze)] text-[10px] font-sans uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {String(persona) === 'HOST' ? 'Sanctuary Owner' : 'Verified Guest'}
                        </p>
                    </div>
                </div>
            </div>

            <ProfileAchievements persona={persona} badges={badges} badgeTypes={badgeTypes} />

            <ProfileNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                navItems={[
                    { id: 'bookings', label: 'My Bookings', icon: Calendar },
                    { id: 'messages', label: 'Messages', icon: MessageSquare },
                    { id: 'favorites', label: 'Favorites', icon: Heart },
                    { id: 'preferences', label: 'Preferences', icon: Settings }
                ]}
            />
        </aside>
    );
};

export default ProfileSidebar;
