import React from 'react';

interface Sparkle {
    id: number;
    x: number;
    y: number;
    duration: number;
}

interface SparklesProps {
    sparkles: Sparkle[];
}

const Sparkles: React.FC<SparklesProps> = ({ sparkles }) => {
    return (
        <div style={styles.sparklesContainer}>
            {sparkles.map(sparkle => (
                <div
                    key={sparkle.id}
                    style={{
                        ...styles.sparkle,
                        left: `${sparkle.x}px`,
                        top: `${sparkle.y}px`,
                        animation: `sparkleFloat ${sparkle.duration}s ease-out forwards`
                    }}
                />
            ))}
            <style>{`
        @keyframes sparkleFloat {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

const styles = {
    sparklesContainer: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none' as const,
        zIndex: 1
    },
    sparkle: {
        position: 'absolute' as const,
        width: '3px',
        height: '3px',
        background: 'var(--c-cream)',
        borderRadius: '50%',
        boxShadow: '0 0 8px var(--c-blue-haze)'
    }
};

export default Sparkles;
export type { Sparkle };
