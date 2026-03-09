import React from 'react';

interface AetherIconProps {
    className?: string;
}

const AetherIcon: React.FC<AetherIconProps> = ({ className = "w-8 h-8" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

export default AetherIcon;
