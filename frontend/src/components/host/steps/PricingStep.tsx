import React from 'react';
import { Coins, Lock, Zap } from 'lucide-react';

interface PricingStepProps {
    pricing: {
        nightlyPrice: string;
        securityDeposit: string;
        smartPricing: boolean;
    };
    setPricing: (pricing: any) => void;
}

const PricingStep: React.FC<PricingStepProps> = ({ pricing, setPricing }) => {
    const inputClasses = "w-full px-6 py-4 rounded-[20px] border border-white/20 bg-white/40 backdrop-blur-md font-sans text-sm text-[var(--t-primary)] focus:outline-none focus:border-[var(--c-blue-azure)]/50 transition-all placeholder:text-[var(--t-secondary)]/40";
    const labelClasses = "block font-sans text-[11px] uppercase tracking-[0.25em] text-[var(--t-secondary)] mb-2 font-bold opacity-70";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={labelClasses + " flex items-center gap-2"}>
                        <Coins className="w-3 h-3" /> Nightly Price (STX)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={pricing.nightlyPrice}
                            onChange={(e) => setPricing({ ...pricing, nightlyPrice: e.target.value })}
                            step="1"
                            min="1"
                            placeholder="0"
                            className={inputClasses}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-sans text-[10px] uppercase font-bold text-[var(--t-secondary)] opacity-50">Per Night</div>
                    </div>
                </div>
                <div>
                    <label className={labelClasses + " flex items-center gap-2"}>
                        <Lock className="w-3 h-3" /> Security Deposit (STX)
                    </label>
                    <input
                        type="number"
                        value={pricing.securityDeposit}
                        onChange={(e) => setPricing({ ...pricing, securityDeposit: e.target.value })}
                        step="1"
                        min="0"
                        placeholder="0"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-between group hover:bg-white/40 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--c-blue-azure)]/10 flex items-center justify-center text-[var(--c-blue-azure)]">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-serif text-xl text-[var(--t-primary)] mb-1">Smart Yield Optimization</div>
                        <p className="font-sans text-xs text-[var(--t-secondary)] opacity-70">Automatically adjust pricing based on Stacks network gas fees and demand.</p>
                    </div>
                </div>
                <button
                    onClick={() => setPricing({ ...pricing, smartPricing: !pricing.smartPricing })}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-500 ${pricing.smartPricing ? 'bg-[var(--c-blue-azure)]' : 'bg-white/40 border border-white/60'}`}
                >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-500 ${pricing.smartPricing ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>
    );
};

export default PricingStep;
