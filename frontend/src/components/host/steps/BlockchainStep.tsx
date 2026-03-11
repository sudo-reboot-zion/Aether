'use client';
import { CONTRACT_ADDRESS } from '@/lib/config';
import { Fuel, Activity, Code, ShieldCheck, ChevronDown } from 'lucide-react';

interface BlockchainStepProps {
    blockchain: {
        escrow: string;
    };
    setBlockchain: (blockchain: any) => void;
}

const BlockchainStep: React.FC<BlockchainStepProps> = ({ blockchain, setBlockchain }) => {
    const selectClasses = "w-full px-6 py-4 rounded-[20px] border border-white/20 bg-white/40 backdrop-blur-md font-sans text-sm text-[var(--t-primary)] focus:outline-none focus:border-[var(--c-blue-azure)]/50 transition-all appearance-none cursor-pointer";
    const labelClasses = "block font-sans text-[11px] uppercase tracking-[0.25em] text-[var(--t-secondary)] mb-2 font-bold opacity-70";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[24px] bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-md border border-white/40 group hover:border-[var(--c-blue-azure)]/30 transition-colors">
                    <label className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-2 font-bold opacity-60">
                        <Fuel className="w-3 h-3" /> Est. Deployment Gas
                    </label>
                    <div className="font-serif text-2xl text-[var(--t-primary)]">0.0042 STX</div>
                </div>
                <div className="p-6 rounded-[24px] bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-md border border-white/40 group hover:border-emerald-500/30 transition-colors">
                    <label className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-2 font-bold opacity-60">
                        <Activity className="w-3 h-3" /> Network Status
                    </label>
                    <div className="flex items-center gap-2 font-serif text-2xl text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses + " flex items-center gap-2"}>
                    <Code className="w-3 h-3" /> Registry Smart Contract
                </label>
                <div className="px-6 py-4 rounded-[20px] bg-[var(--c-blue-deep)]/5 border border-white/20 font-mono text-[10px] text-[var(--t-secondary)] break-all opacity-80 leading-relaxed group-hover:bg-[var(--c-blue-deep)]/10 transition-colors">
                    {CONTRACT_ADDRESS}.aether-property-registry
                </div>
            </div>

            <div>
                <label className={labelClasses + " flex items-center gap-2"}>
                    <ShieldCheck className="w-3 h-3" /> Escrow Logic
                </label>
                <div className="relative">
                    <select
                        value={blockchain.escrow}
                        onChange={(e) => setBlockchain({ ...blockchain, escrow: e.target.value })}
                        className={`${selectClasses} pr-12`}
                    >
                        <option>Standard Aether Escrow (1% fee)</option>
                        <option>Multi-sig Secure (User Managed)</option>
                        <option>Direct P2P (Trust-based)</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[var(--t-primary)]">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockchainStep;
