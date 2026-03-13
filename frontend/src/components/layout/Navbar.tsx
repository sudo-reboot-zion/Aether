"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { UserPersona } from '@/redux/slices/userSlice';
import { clearNotifications, fetchSessions } from '@/redux/slices/bookingChatSlice';

import GlassPanel from '../ui/GlassPanel';
import NavLogo from './Navbar/NavLogo';
import MainLinks from './Navbar/MainLinks';
import LanguageSwitcher from './Navbar/LanguageSwitcher';
import UserSection from './Navbar/UserSection';

const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [languageOpen, setLanguageOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { language, changeLanguage } = useLanguage();
    const { userData, persona, setPersona, connectWallet, disconnectWallet } = useAuth();
    const { hasNotifications, isOpen: isChatOpen } = useSelector((state: RootState) => state.bookingChat);

    const profileRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const address = userData?.profile?.stxAddress?.testnet;
        if (!address) return;

        dispatch(fetchSessions(address));

        const interval = setInterval(() => {
            if (!isChatOpen) {
                dispatch(fetchSessions(address));
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [userData, dispatch, isChatOpen]);

    const handleLanguageChange = (lang: string) => {
        changeLanguage(lang);
        setLanguageOpen(false);
    };

    const togglePersona = (target: UserPersona) => {
        if (persona !== target) {
            setPersona(target);
        }
    };

    const shortenedAddress = userData?.profile?.stxAddress?.testnet
        ? `${userData.profile.stxAddress.testnet.slice(0, 4)}...${userData.profile.stxAddress.testnet.slice(-4)}`
        : '';

    return (
        <nav className="fixed top-0 w-full z-50 px-8 py-6 transition-all duration-300">
            <GlassPanel className="max-w-[1440px] mx-auto flex justify-between items-center px-8 py-4">
                <NavLogo />
                <MainLinks />

                <div className="flex items-center gap-6">
                    <div ref={langRef}>
                        <LanguageSwitcher
                            language={language}
                            isOpen={languageOpen}
                            onToggle={setLanguageOpen}
                            onLanguageChange={handleLanguageChange}
                        />
                    </div>

                    <div ref={profileRef}>
                        <UserSection
                            userData={userData}
                            mounted={mounted}
                            hasNotifications={hasNotifications}
                            shortenedAddress={shortenedAddress}
                            persona={persona}
                            profileOpen={profileOpen}
                            setProfileOpen={setProfileOpen}
                            togglePersona={togglePersona}
                            connectWallet={connectWallet}
                            disconnectWallet={disconnectWallet}
                            clearNotifications={() => dispatch(clearNotifications())}
                        />
                    </div>
                </div>
            </GlassPanel>
        </nav>
    );
};

export default Navbar;
