import React from 'react';

const AlchemyEngine = () => {
    return (
        <div style={styles.alchemyEngine}>
            {/* SVG Filter for Goo effect */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            <div style={{ ...styles.orb, ...styles.orbCore }} />
            <div style={{ ...styles.orb, ...styles.orbSatellite, ...styles.s1 }} />
            <div style={{ ...styles.orb, ...styles.orbSatellite, ...styles.s2 }} />
            <div style={{ ...styles.orb, ...styles.orbSatellite, ...styles.s3 }} />

            <style>{`
        @keyframes pulseCore {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.8; }
        }
        @keyframes orbit1 {
          0% { transform: rotate(0deg) translateX(45px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(45px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          0% { transform: rotate(120deg) translateX(65px) rotate(-120deg) scale(0.8); }
          100% { transform: rotate(-240deg) translateX(65px) rotate(240deg) scale(0.8); }
        }
        @keyframes orbit3 {
          0% { transform: rotate(240deg) translateX(35px) rotate(-240deg) scale(0.6); }
          50% { transform: rotate(300deg) translateX(85px) rotate(-300deg) scale(0.9); }
          100% { transform: rotate(600deg) translateX(35px) rotate(-600deg) scale(0.6); }
        }
      `}</style>
        </div>
    );
};

const styles = {
    alchemyEngine: {
        position: 'relative' as const,
        width: '200px',
        height: '200px',
        filter: "url('#goo')",
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    orb: {
        position: 'absolute' as const,
        background: 'var(--c-blue-azure)',
        borderRadius: '50%',
        mixBlendMode: 'screen' as const,
        filter: 'blur(2px)',
        opacity: 0.8
    },
    orbCore: {
        width: '64px',
        height: '64px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'pulseCore 4s ease-in-out infinite',
        background: 'var(--c-blue-azure)',
        boxShadow: '0 0 20px var(--c-blue-azure)'
    },
    orbSatellite: {
        width: '36px',
        height: '36px',
        top: '50%',
        left: '50%',
        marginTop: '-18px',
        marginLeft: '-18px'
    },
    s1: {
        animation: 'orbit1 7s infinite linear',
        background: 'var(--c-blue-haze)',
        opacity: 0.6
    },
    s2: {
        animation: 'orbit2 10s infinite linear',
        background: 'var(--c-blue-deep)',
        opacity: 0.7
    },
    s3: {
        animation: 'orbit3 8s infinite ease-in-out',
        background: 'var(--c-blue-azure)',
        opacity: 0.5
    }
};

export default AlchemyEngine;
