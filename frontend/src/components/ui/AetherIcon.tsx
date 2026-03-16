import React from 'react';

interface AetherIconProps {
    className?: string;
}

const AetherIcon: React.FC<AetherIconProps> = ({ className = "w-8 h-8" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 19a4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 .1-1 7 7 0 0 1 13.8 0l.1 1a4 4 0 0 1 4 4 4 4 0 0 1-4 4H7z" />
    </svg>
);

export default AetherIcon;
