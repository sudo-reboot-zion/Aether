'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSTXPrice } from '@/lib/coin';

type CurrencyMode = 'STX' | 'USD';

interface CurrencyContextType {
    currencyMode: CurrencyMode;
    stxPriceBtc: number; // For future-proofing if BTC is needed
    stxPriceUsd: number;
    toggleCurrency: () => void;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('STX');
    const [stxPriceUsd, setStxPriceUsd] = useState<number>(2.5); // Default fallback
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load preference
        const saved = localStorage.getItem('aether_currency_mode');
        if (saved === 'USD' || saved === 'STX') {
            setCurrencyMode(saved as CurrencyMode);
        }

        // Fetch price
        const loadPrice = async () => {
            const price = await fetchSTXPrice();
            setStxPriceUsd(price);
            setIsLoading(false);
        };
        loadPrice();

        // Refresh price every 5 minutes
        const interval = setInterval(loadPrice, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleCurrency = () => {
        const newMode = currencyMode === 'STX' ? 'USD' : 'STX';
        setCurrencyMode(newMode);
        localStorage.setItem('aether_currency_mode', newMode);
    };

    return (
        <CurrencyContext.Provider value={{
            currencyMode,
            stxPriceUsd,
            stxPriceBtc: 0, // Placeholder
            toggleCurrency,
            isLoading
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
