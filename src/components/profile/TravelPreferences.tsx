"use client";
import React, { useEffect, useState } from 'react';
import { Clock, Wind, ThumbsUp, Wifi, Target, Sparkles, Shield, Zap, Coffee, Edit2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import ProtocolSelector from './ProtocolSelector';


const ICON_MAP = {
    1: Clock,
    2: Wind,
    3: ThumbsUp,
    4: Wifi,
    5: Target,
    6: Sparkles,
    7: Shield,
    8: Zap,
    9: Coffee
};

const TEXT_MAP = {
    1: 'Early Check-in',
    2: 'High Altitude',
    3: 'Top Verified',
    4: 'Gigabit Fiber',
    5: 'Deep Silence',
    6: 'Ultra Clean',
    7: 'Secure Access',
    8: 'Fast Response',
    9: 'Premium Coffee'
};

const TravelPreferences = () => {
    const { userData } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet || '';
    const { fetchUserPreferences, updatePreferences, isLoading } = useProfile();
    const [preferences, setPreferences] = useState<{ vibes: number[], amenities: number[] } | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (userAddress) {
            fetchUserPreferences(userAddress).then(setPreferences);
        }
    }, [userAddress, fetchUserPreferences]);

    const handleSaveProtocol = async (vibes: number[], amenities: number[]) => {
        await updatePreferences(vibes, amenities);
        // Optimistic update
        setPreferences({ vibes, amenities });
        setIsEditing(false);
    };

    const activePrefs = [
        ...(preferences?.vibes || []),
        ...(preferences?.amenities || [])
    ];

    if (isEditing) {
        return (
            <section className="mb-12">
                <ProtocolSelector
                    initialVibes={preferences?.vibes}
                    initialAmenities={preferences?.amenities}
                    onSave={handleSaveProtocol}
                    onClose={() => setIsEditing(false)}
                />
            </section>
        );
    }

    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-[var(--t-primary)] font-semibold">Travel Protocol</h2>
                {activePrefs.length > 0 && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-[var(--c-blue-azure)] hover:opacity-70 transition-opacity font-sans text-xs font-bold uppercase tracking-wider"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Protocol
                    </button>
                )}
            </div>

            {(activePrefs.length === 0 && !isLoading) ? (
                <div className="bg-white/40 border border-dashed border-black/10 rounded-[32px] p-10 flex flex-col items-center justify-center text-center gap-3">
                    <div className="p-3 bg-white rounded-full text-blue-400 shadow-sm mb-1">
                        <Target className="w-6 h-6" />
                    </div>
                    <p className="text-[var(--t-primary)] font-serif text-lg font-medium">Protocol not yet defined</p>
                    <p className="text-[var(--t-secondary)] text-sm font-sans max-w-[280px] mb-2">Define your travel signatures to customize your stays across the network.</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-[var(--t-primary)] text-white px-8 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-black/5"
                    >
                        Define Protocol
                    </button>
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {activePrefs.map((id, index) => {
                        const Icon = (ICON_MAP as any)[id] || Target;
                        const text = (TEXT_MAP as any)[id] || `Tag #${id}`;
                        return (
                            <div key={index} className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-[0_4px_12px_rgba(61,52,47,0.03)] border border-[rgba(0,0,0,0.02)] transition-colors hover:bg-[var(--c-cream)] cursor-default">
                                <Icon className="w-4 h-4 text-[var(--c-blue-azure)]" />
                                <span className="text-[var(--t-primary)] text-sm font-medium font-sans">{text}</span>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="animate-pulse bg-white/20 h-10 w-32 rounded-full" />
                    )}
                </div>
            )}
        </section>
    );
};

export default TravelPreferences;
