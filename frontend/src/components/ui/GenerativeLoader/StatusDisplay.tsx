import React from 'react';

interface StatusDisplayProps {
    statusMessage: string;
    progress: number;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ statusMessage, progress }) => {
    return (
        <div style={styles.statusContainer}>
            <div
                key={statusMessage} // Force re-render for animation
                style={styles.statusText}
            >
                {statusMessage}
            </div>
            <div style={styles.progressTrack}>
                <div
                    style={{ ...styles.progressBar, width: `${progress}%` }}
                />
            </div>
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

const styles = {
    statusContainer: {
        position: 'absolute' as const,
        bottom: '48px',
        width: '80%',
        textAlign: 'center' as const,
        zIndex: 10
    },
    statusText: {
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--t-primary)',
        marginBottom: '16px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        animation: 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        fontFamily: 'var(--font-sans)',
        opacity: 0
    },
    progressTrack: {
        width: '100%',
        height: '3px',
        background: 'rgba(27, 64, 102, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative' as const
    },
    progressBar: {
        position: 'absolute' as const,
        left: 0,
        top: 0,
        height: '100%',
        background: 'var(--c-blue-azure)',
        borderRadius: '4px',
        boxShadow: '0 0 10px rgba(61, 124, 184, 0.4)',
        transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
    }
};

export default StatusDisplay;
