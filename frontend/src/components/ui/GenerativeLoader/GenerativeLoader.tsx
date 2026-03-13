"use client"

import React, { useEffect, useRef, useState } from 'react';
import AlchemyEngine from './AlchemyEngine';
import Sparkles, { Sparkle } from './Sparkles';
import StatusDisplay from './StatusDisplay';

const DEFAULT_MESSAGES = [
    "Awakening the core...",
    "Weaving neural threads...",
    "Architecting the sanctuary...",
    "Syncing with Bitcoin layers...",
    "Finalizing metadata crystals...",
    "Almost manifest..."
];

interface GenerativeLoaderProps {
    duration?: number;
    messages?: string[];
    completeMessage?: string;
    onComplete?: () => void;
}

const GenerativeLoader: React.FC<GenerativeLoaderProps> = ({
    duration = 12000,
    messages = DEFAULT_MESSAGES,
    completeMessage = "Manifested",
    onComplete
}) => {
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(messages[0]);
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const sparkleIdRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const updateLoader = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const currentProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(currentProgress);

            const messageIndex = Math.floor((currentProgress / 100) * messages.length);
            if (messageIndex < messages.length) {
                setStatusMessage(messages[messageIndex]);
            }

            if (Math.random() > 0.92) {
                createSparkle();
            }

            if (elapsed < duration) {
                requestAnimationFrame(updateLoader);
            } else {
                setStatusMessage(completeMessage);
                if (onComplete) {
                    setTimeout(onComplete, 800);
                }
            }
        };

        const animationId = requestAnimationFrame(updateLoader);
        return () => cancelAnimationFrame(animationId);
    }, [duration, messages, completeMessage, onComplete]);

    const createSparkle = () => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 50;
        const x = Math.cos(angle) * radius + 180;
        const y = Math.sin(angle) * radius + 225;
        const duration = 1.2 + Math.random();
        const id = sparkleIdRef.current++;

        setSparkles(prev => [...prev, { id, x, y, duration }]);

        setTimeout(() => {
            setSparkles(prev => prev.filter(s => s.id !== id));
        }, duration * 1000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.gridBg} />
                <AlchemyEngine />
                <Sparkles sparkles={sparkles} />
                <StatusDisplay statusMessage={statusMessage} progress={progress} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed' as const,
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(245, 243, 235, 0.7)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999
    },
    card: {
        width: '360px',
        aspectRatio: '4 / 5',
        backgroundColor: 'var(--c-cream)',
        borderRadius: '32px',
        position: 'relative' as const,
        boxShadow: '0 24px 64px -12px rgba(27, 40, 102, 0.15), 0 0 0 1px rgba(27, 40, 102, 0.05)',
        overflow: 'hidden' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center'
    },
    gridBg: {
        position: 'absolute' as const,
        inset: 0,
        backgroundImage: `
      linear-gradient(rgba(159, 186, 209, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(159, 186, 209, 0.1) 1px, transparent 1px)
    `,
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
        zIndex: 0
    }
};

export default GenerativeLoader;
