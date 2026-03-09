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
    totalEarned = 0,
}) => {
    // averageRating is stored as (rating * 100) on-chain
    const avgRating = stats ? (stats.averageRating / 100) : 0;
    const totalReviews = stats?.totalReviews ?? 0;
    const badgeCount = badges.length;

    const tier = avgRating >= 4.5 ? 'Superhost' : avgRating >= 3.5 ? 'Trusted' : avgRating > 0 ? 'New Host' : 'Getting Started';
    const tierColor = avgRating >= 4.5 ? '#1B4066' : avgRating >= 3.5 ? '#3D7CB8' : '#9FBAD1';

    // SVG ring calc
    const r = 26;
    const circumference = 2 * Math.PI * r;
    const ratingFraction = Math.min(avgRating / 5, 1);
    const ringOffset = circumference * (1 - ratingFraction);

    return (
        <div className="mt-auto">
            <div className="text-xs uppercase tracking-widest text-[var(--t-secondary)] font-semibold mb-4">
                Persona Intelligence
            </div>

            <div className="rounded-[24px] overflow-hidden border border-white/20 shadow-lg shadow-[rgba(27,64,102,0.08)]">
                <div
                    className="px-5 py-4 flex items-center gap-4"
                    style={{ background: `linear-gradient(135deg, ${tierColor} 0%, #1B4066 100%)` }}
                >
                    <div className="relative shrink-0">
                        <svg width="64" height="64" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                            <circle
                                cx="32" cy="32" r={r}
                                fill="none"
                                stroke="white"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={`${circumference}`}
                                strokeDashoffset={ringOffset}
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px', transition: 'stroke-dashoffset 1.2s ease' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-white text-sm font-light leading-none">
                                {totalReviews > 0 ? avgRating.toFixed(1) : '–'}
                            </span>
                            <Star size={8} className="text-white/60 mt-0.5" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{tier}</div>
                        <div className="text-white/60 text-[10px] font-sans mt-0.5">
                            {totalReviews > 0 ? `${totalReviews} verified review${totalReviews > 1 ? 's' : ''}` : 'No reviews yet'}
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                            {Array(5).fill(0).map((_, i) => (
                                <Star
                                    key={i}
                                    size={10}
                                    className={i < Math.round(avgRating) ? 'text-white' : 'text-white/20'}
                                    fill={i < Math.round(avgRating) ? 'white' : 'transparent'}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white/50 grid grid-cols-3 divide-x divide-black/5">
                    <div className="flex flex-col items-center gap-1 py-4 px-2">
                        <Award size={14} className="text-[var(--c-blue-azure)]" />
                        <span className="text-lg font-light text-[var(--t-primary)]">{badgeCount}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[var(--t-secondary)] font-sans text-center">Badges</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 py-4 px-2">
                        <TrendingUp size={14} className="text-[var(--c-blue-azure)]" />
                        <span className="text-lg font-light text-[var(--t-primary)]">{totalEarned.toFixed(0)}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[var(--t-secondary)] font-sans text-center">STX Value</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 py-4 px-2">
                        <ShieldCheck size={14} className="text-[var(--c-blue-azure)]" />
                        <span className="text-lg font-light text-[var(--t-primary)]">
                            {totalReviews > 0 ? <Check size={14} className="text-emerald-500 inline-block mb-1" /> : <span className="text-gray-300">0</span>}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-[var(--t-secondary)] font-sans text-center">Verified</span>
                    </div>
                </div>

                <div className="bg-white/30 px-4 py-3 text-[10px] text-[var(--t-secondary)] font-sans leading-relaxed">
                    {persona === 'HOST'
                        ? totalReviews > 0
                            ? `Your ${avgRating.toFixed(1)}★ reputation places you among Aether's ${tier.toLowerCase()} hosts. Keep delivering exceptional stays to unlock Superhost status.`
                            : 'Complete your first hosted stay to start building your on-chain reputation. Your reputation score is permanently recorded on Stacks.'
                        : totalReviews > 0
                            ? `You have ${totalReviews} verified stay${totalReviews > 1 ? 's' : ''} on your blockchain record. A strong review history unlocks better properties and lower platform fees.`
                            : 'Complete your first stay and leave a review to begin building your guest reputation on the Stacks blockchain.'
                    }
                </div>
            </div>
        </div>
    );
};

export default PersonaIntelligence;
