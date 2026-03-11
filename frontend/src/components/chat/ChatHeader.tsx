import React from 'react';
import { X, Wifi, WifiOff } from 'lucide-react';
import { AetherLogo } from './AetherLogo';

interface ChatHeaderProps {
    sessionLabel: string;
    statusLabel: string;
    isConnected: boolean;
    isLoggedIn: boolean;
    displayPartner: string;
    onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    sessionLabel,
    statusLabel,
    isConnected,
    isLoggedIn,
    displayPartner,
    onClose
}) => {
    return (
        <div
            className="px-8 py-5 flex items-center justify-between shrink-0"
            style={{ background: 'linear-gradient(135deg, #1B4066 0%, #2457A4 100%)' }}
        >
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <AetherLogo className="w-5 h-5 text-white" />
                </div>
                <div>
                    <div className="text-white font-serif text-lg font-medium leading-tight">{sessionLabel}</div>
                    <div className="text-white/60 font-sans text-[11px] uppercase tracking-wider mt-0.5">{statusLabel}</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    {isConnected
                        ? <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                        : <WifiOff className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/80">
                        {isConnected ? displayPartner : isLoggedIn ? 'Connecting…' : 'Connect Wallet'}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
