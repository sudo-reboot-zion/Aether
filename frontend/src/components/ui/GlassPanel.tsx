import React from 'react';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', hover = true }) => {
    const hoverClass = hover
        ? "hover:bg-[var(--c-white-glass-hover)] hover:shadow-[0_8px_32px_-4px_rgba(27,64,102,0.1)] hover:-translate-y-1"
        : "";

    return (
        <div
            className={`
        bg-[var(--c-white-glass)] 
        backdrop-blur-[24px] 
        border border-[rgba(255,255,255,0.4)] 
        rounded-[var(--radius-lg)] 
        shadow-[0_4px_24px_-1px_rgba(27,64,102,0.05)] 
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${hoverClass} 
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default GlassPanel;
