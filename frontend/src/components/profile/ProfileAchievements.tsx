import React from 'react';
import { Award } from 'lucide-react';

interface ProfileAchievementsProps {
    persona: 'GUEST' | 'HOST';
    badges: any[];
    badgeTypes: any[];
    isCollapsed?: boolean;
}

const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ persona, badges, badgeTypes, isCollapsed }) => {
    return (
        <div className={`py-6 border-y border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed && (
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">
                    {persona === 'HOST' ? 'Host Reputation' : 'Traveler Achievements'} ({badges.length})
                </div>
            )}
            <div className={`flex flex-wrap gap-3 ${isCollapsed ? 'flex-col items-center' : ''}`}>
                {badges.length === 0 ? (
                    <div className="text-[11px] text-white/30 italic">No accolades yet...</div>
                ) : (
                    badges.map((badge, idx) => {
                        const typeInfo = badgeTypes.find((t: any) => t.type === badge.badgeType);
                        if (!typeInfo && !badge.metadataUri) return null;

                        return (
                            <div key={idx} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group relative cursor-help border border-white/5 hover:bg-white/20 transition-colors">
                                <Award className={`w-5 h-5 ${persona === 'HOST' ? 'text-[var(--c-blue-azure)]' : 'text-emerald-400'}`} />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-white text-black text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                    <div className="font-bold border-b border-black/5 pb-1 mb-1">{typeInfo?.name || `Achievement #${badge.badgeType}`}</div>
                                    <div className="text-black/60 font-sans">{typeInfo?.description || 'Synchronizing with blockchain...'}</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProfileAchievements;
