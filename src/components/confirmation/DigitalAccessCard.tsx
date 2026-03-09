import React from 'react';
import { Lock, Activity, RefreshCw } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';

const DigitalAccessCard = () => {
    return (
        <GlassPanel className="p-10 mt-10 !bg-[var(--c-white-glass)]">
            <h3 className="font-sans text-[0.7rem] uppercase tracking-[0.15em] text-[var(--t-secondary)] mb-6 font-bold opacity-70 flex items-center gap-2">
                <Activity className="w-3 h-3 text-[var(--c-blue-azure)]" />
                NODE PROTOCOL
            </h3>
            <p className="text-base mb-8 font-serif text-[var(--t-primary)] leading-[1.6] opacity-90">
                Your cryptographic signature will synchronize with the sanctuary node 2 blocks before arrival. Simply perform a proximity handshake to engage secondary authorization.
            </p>
            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-4 uppercase text-xs tracking-[0.2em] font-bold border-[var(--c-blue-azure)] text-[var(--c-blue-azure)] hover:bg-[var(--c-blue-azure)] hover:text-white transition-all rounded-xl group"
            >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Sync Identity Signature
            </Button>
        </GlassPanel>
    );
};

export default DigitalAccessCard;
