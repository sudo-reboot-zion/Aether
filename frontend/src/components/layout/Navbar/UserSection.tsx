import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import Button from '../../ui/Button';
import ProfileMenu from './ProfileMenu';
import { useTranslation } from '@/hooks/useTranslation';
import { UserPersona } from '@/redux/slices/userSlice';

interface UserSectionProps {
    userData: any;
    mounted: boolean;
    hasNotifications: boolean;
    shortenedAddress: string;
    persona: UserPersona;
    profileOpen: boolean;
    setProfileOpen: (open: boolean) => void;
    togglePersona: (target: UserPersona) => void;
    connectWallet: () => void;
    disconnectWallet: () => void;
    clearNotifications: () => void;
}

const UserSection: React.FC<UserSectionProps> = ({
    userData, mounted, hasNotifications, shortenedAddress, persona,
    profileOpen, setProfileOpen, togglePersona, connectWallet, disconnectWallet,
    clearNotifications
}) => {
    const { t } = useTranslation();

    if (!mounted) return null;

    return userData ? (
        <div className="flex items-center gap-4">
            {/* Message Alert */}
            <Link
                href="/profile?tab=messages"
                onClick={clearNotifications}
                className="relative p-2 rounded-full hover:bg-[var(--c-blue-deep)]/5 transition-colors group"
            >
                <MessageSquare className="w-5 h-5 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors opacity-70" />
                {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </Link>

            <ProfileMenu
                isOpen={profileOpen}
                setOpen={setProfileOpen}
                shortenedAddress={shortenedAddress}
                stxAddress={userData.profile?.stxAddress?.testnet || ''}
                persona={persona}
                togglePersona={togglePersona}
                disconnectWallet={disconnectWallet}
            />
        </div>
    ) : (
        <Button onClick={connectWallet} className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[var(--c-blue-deep)]/10">
            {t('nav.connect')}
        </Button>
    );
};

export default UserSection;
