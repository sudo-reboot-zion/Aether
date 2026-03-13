"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, ShieldCheck, TrendingUp, Check } from 'lucide-react';
import { Persona } from '@/redux/slices/redux.types';

interface PersonaIntelligenceProps {
    persona: Persona;
    stats?: { totalReviews: number; averageRating: number } | null;
    badges?: any[];
    totalEarned?: number;
}

const PersonaIntelligence: React.FC<PersonaIntelligenceProps> = ({
    persona,
    stats,
    badges = [],
    totalEarned = 0
}) => {
    // averageRating is stored as (rating * 100) on-chain
    const avgRating = stats ? (stats.averageRating / 100) : 0;
    const totalReviews = stats?.totalReviews ?? 0;

    const tier = totalReviews > 50 ? 'Elite' : totalReviews > 10 ? 'Veteran' : 'Newcomer';

    // SVG ring calc // Old variable name was 'r'
    // const r = 26;
    // const circumference = 2 * Math.PI * r;
    // const ratingFraction = Math.min(avgRating / 5, 1);
    // const ringOffset = circumference * (1 - ratingFraction);

    // Circular progress math // New variable name is 'radius'
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const ratingFraction = avgRating / 5;
    const ringOffset = circumference * (1 - ratingFraction);

    return (
        <div className="bg-white/60 backdrop-blur-md border border-black/5 rounded-[32px] p-8 shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--t-primary)] font-bold mb-8">
                Persona Intelligence
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r={radius}
                                className="fill-none stroke-black/5"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="32"
                                cy="32"
                                r={radius}
                                className="fill-none stroke-[var(--c-blue-azure)]"
                                strokeWidth="4"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: ringOffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-sm font-bold">{avgRating.toFixed(1)}</span>
                            <Star size={8} className="text-[var(--c-blue-azure)] fill-[var(--c-blue-azure)]" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="text-lg font-serif tracking-tight text-[var(--t-primary)]">{tier} Persona</div>
                        <div className="text-xs text-[var(--t-secondary)] font-sans">{totalReviews} Verified Transmissions</div>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={10}
                                    className={`${s <= Math.round(avgRating) ? 'text-[var(--c-blue-azure)] fill-[var(--c-blue-azure)]' : 'text-black/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-white/40 p-1 rounded-2xl border border-black/5">
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white/50 transition-colors">
                        <Award size={16} className="text-[var(--c-blue-azure)] mb-2" />
                        <div className="text-sm font-bold text-[var(--t-primary)]">{badges.length}</div>
                        <div className="text-[8px] uppercase tracking-widest text-[var(--t-secondary)] font-bold">Badges</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border-x border-black/5 hover:bg-white/50 transition-colors">
                        <TrendingUp size={16} className="text-[var(--c-blue-azure)] mb-2" />
                        <div className="text-sm font-bold text-[var(--t-primary)]">{totalEarned.toFixed(1)}</div>
                        <div className="text-[8px] uppercase tracking-widest text-[var(--t-secondary)] font-bold">STX Value</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white/50 transition-colors">
                        <ShieldCheck size={16} className="text-emerald-500 mb-2" />
                        <div className="text-sm font-bold text-[var(--t-primary)]">{totalReviews > 0 ? 'I' : '0'}</div>
                        <div className="text-[8px] uppercase tracking-widest text-[var(--t-secondary)] font-bold">Verified</div>
                    </div>
                </div>

                <div className="bg-white/30 px-5 py-4 rounded-2xl text-[11px] text-[var(--t-secondary)] font-sans leading-relaxed border border-black/5">
                    {persona === 'HOST'
                        ? totalReviews > 0
                            ? `Your ${avgRating.toFixed(1)}★ reputation places you among Aether's ${tier.toLowerCase()} hosts. Keep delivering exceptional stays to unlock Superhost status.`
                            : 'Complete your first hosted stay to start building your guest reputation on the Stacks blockchain. Reputation is permanently recorded.'
                        : totalReviews > 0
                            ? `As a ${tier.toLowerCase()} traveler, your ${avgRating.toFixed(1)}★ history fast-tracks your booking requests with top hosts.`
                            : 'Begin your journey through Aether and stay at curated sanctuaries to build your immutable traveler reputation.'
                    }
                </div>
            </div>
        </div>
    );
};

export default PersonaIntelligence;
