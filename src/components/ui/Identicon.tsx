"use client";
import React, { useMemo } from 'react';

interface IdenticonProps {
    address: string;
    size?: number;
    className?: string;
}

/**
 * A professional GitHub-style identicon component.
 * It generates a symmetric 5x5 grid of pixels based on the given address.
 */
const Identicon: React.FC<IdenticonProps> = ({ address, size = 40, className = "" }) => {
    const grid = useMemo(() => {
        // Simple hash function for string to number
        let hash = 0;
        for (let i = 0; i < address.length; i++) {
            hash = ((hash << 5) - hash) + address.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }

        // Generate a 5x5 grid (25 pixels)
        // We only need to generate 15 values (3 columns) because of symmetry
        const pixels: boolean[] = [];
        for (let i = 0; i < 15; i++) {
            pixels.push(((hash >> i) & 1) === 1);
        }

        // Create the symmetric grid
        const fullGrid: boolean[] = [];
        for (let row = 0; row < 5; row++) {
            // Col 0, 1, 2
            const c0 = pixels[row * 3 + 0];
            const c1 = pixels[row * 3 + 1];
            const c2 = pixels[row * 3 + 2];
            // Col 3 = Col 1, Col 4 = Col 0
            fullGrid.push(c0, c1, c2, c1, c0);
        }

        return {
            fullGrid,
            color: hash
        };
    }, [address]);

    // Curated premium palette
    const PALETTE = [
        '#2457A4', // Azure
        '#1B4066', // Deep Blue
        '#3B82F6', // Blue 500
        '#6366F1', // Indigo 500
        '#8B5CF6', // Violet 500
        '#EC4899', // Pink 500
        '#F43F5E', // Rose 500
        '#10B981', // Emerald 500
        '#06B6D4', // Cyan 500
        '#F59E0B', // Amber 500
    ];

    const color = PALETTE[Math.abs(grid.color % PALETTE.length)];
    const pixelSize = size / 5;

    return (
        <div
            className={`overflow-hidden shrink-0 ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: '#f3f4f6', // Light gray background
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(5, 1fr)'
            }}
        >
            {grid.fullGrid.map((isActive, i) => (
                <div
                    key={i}
                    style={{
                        backgroundColor: isActive ? color : 'transparent',
                        width: '100%',
                        height: '100%'
                    }}
                />
            ))}
        </div>
    );
};

export default Identicon;
