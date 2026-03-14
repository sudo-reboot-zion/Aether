import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface CurrencyDisplayProps {
    amount: number; // Amount in STX
    className?: string;
    showSymbol?: boolean;
    precision?: number;
    allowToggle?: boolean;
}

/**
 * Reusable component for displaying currency with automatic STX/USD conversion
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
    amount,
    className = "",
    showSymbol = true,
    precision = 2,
    allowToggle = true
}) => {
    const { currencyMode: globalMode, stxPriceUsd } = useCurrency();
    const [localMode, setLocalMode] = useState<'STX' | 'USD' | null>(null);

    const activeMode = localMode || globalMode;

    const toggleLocal = (e: React.MouseEvent) => {
        if (!allowToggle) return;
        e.preventDefault();
        e.stopPropagation();
        setLocalMode(activeMode === 'STX' ? 'USD' : 'STX');
    };

    const content = activeMode === 'USD' ? (
        <span className="flex items-center gap-1.5">
            {showSymbol && "$"}
            {(amount * stxPriceUsd).toLocaleString(undefined, {
                minimumFractionDigits: precision,
                maximumFractionDigits: precision
            })}
        </span>
    ) : (
        <span className="flex items-center gap-1.5">
            {amount.toLocaleString(undefined, {
                minimumFractionDigits: precision,
                maximumFractionDigits: Math.max(precision, amount < 1 ? 4 : 2)
            })}
            {showSymbol && " STX"}
        </span>
    );

    return (
        <button
            onClick={toggleLocal}
            disabled={!allowToggle}
            className={`inline-flex items-center gap-2 group transition-all duration-300 ${allowToggle ? 'cursor-pointer hover:bg-black/5 px-2 py-1 -mx-2 rounded-lg' : ''} ${className}`}
            title={allowToggle ? `Click to switch to ${activeMode === 'STX' ? 'USD' : 'STX'}` : undefined}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMode}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    {content}
                </motion.div>
            </AnimatePresence>

            {allowToggle && (
                <RefreshCw
                    className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity rotate-0 group-hover:rotate-180 duration-500"
                    strokeWidth={2.5}
                />
            )}
        </button>
    );
};
