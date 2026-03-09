"use client";
import React from 'react';
import GlassPanel from './GlassPanel';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon,
    action,
    className = "",
    compact = false
}) => {
    if (compact) {
        return (
            <div className={`text-center py-8 px-4 border border-dashed border-black/10 rounded-2xl ${className}`}>
                {icon && <div className="mb-2 opacity-30 flex justify-center">{icon}</div>}
                <h4 className="text-sm font-medium text-[var(--t-primary)] mb-1">{title}</h4>
                <p className="text-[11px] text-[var(--t-secondary)] opacity-60 font-sans italic mb-3">{description}</p>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-blue-azure)] hover:underline"
                    >
                        {action.label}
                    </button>
                )}
            </div>
        );
    }

    return (
        <GlassPanel className={`p-12 text-center flex flex-col items-center justify-center ${className}`}>
            {icon ? (
                <div className="mb-6 opacity-20">{icon}</div>
            ) : (
                <div className="w-16 h-16 mb-6 rounded-full bg-[var(--c-blue-azure)] opacity-5 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--c-blue-deep)]">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
            <h3 className="text-2xl font-light text-[var(--t-primary)] mb-3 font-serif italic">{title}</h3>
            <p className="text-[var(--t-secondary)] opacity-60 max-w-sm mb-8 font-sans leading-relaxed">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-8 py-3 rounded-xl bg-[var(--c-blue-deep)] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                    {action.label}
                </button>
            )}
        </GlassPanel>
    );
};

export default EmptyState;
