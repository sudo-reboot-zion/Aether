'use client';
import React from 'react';
import { Rocket } from 'lucide-react';

import { MapPin, Tag, Wallet, ShieldCheck } from 'lucide-react';

interface ReviewStepProps {
    formData: any;
    pricing: any;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, pricing }) => {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--c-blue-azure)] to-[var(--c-blue-deep)] rounded-[28px] mx-auto flex items-center justify-center text-white mb-6 shadow-2xl relative">
                    <div className="absolute inset-0 bg-white/20 rounded-inherit blur-xl animate-pulse" />
                    <Rocket size={32} strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-3xl text-[var(--t-primary)] mb-2">Final Review</h2>
                <p className="font-sans text-sm text-[var(--t-secondary)] opacity-60">Establish your sanctuary's domain on the blockchain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-[24px] bg-white/40 border border-white/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-[var(--t-secondary)] mb-3">
                        <Tag size={14} className="opacity-50" />
                        <span className="font-sans text-[10px] uppercase font-bold tracking-widest">Ownership Path</span>
                    </div>
                    <div className="text-xl font-serif text-[var(--t-primary)]">{formData.propertyName}</div>
                    <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[var(--t-secondary)] mt-1 opacity-60">{formData.type} • Smart Estate</div>
                </div>

                <div className="p-6 rounded-[24px] bg-white/40 border border-white/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-[var(--t-secondary)] mb-3">
                        <MapPin size={14} className="opacity-50" />
                        <span className="font-sans text-[10px] uppercase font-bold tracking-widest">Location Tag</span>
                    </div>
                    <div className="text-xl font-serif text-[var(--t-primary)]">{formData.location}</div>
                    <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[var(--t-secondary)] mt-1 opacity-60">Verified Domain 00{formData.categoryTag}</div>
                </div>

                <div className="p-6 rounded-[24px] bg-[var(--c-blue-deep)]/5 border border-[var(--c-blue-deep)]/10 col-span-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[var(--c-blue-deep)]">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--t-secondary)] opacity-60">Nightly Rate</div>
                            <div className="text-2xl font-serif text-[var(--t-primary)]">{pricing.nightlyPrice} STX</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-sans font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-1 flex items-center gap-1.5 justify-center">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            On-Chain Verified
                        </div>
                        <div className="text-[10px] font-sans text-[var(--t-secondary)] opacity-50">+ Security Deposit: {pricing.securityDeposit} STX</div>
                    </div>
                </div>
            </div>

            <p className="font-sans text-[11px] text-[var(--t-secondary)] opacity-60 text-center leading-relaxed">
                By publishing, you acknowledge that this metadata will be permanently stored on IPFS and the property registration will be minted to your Stacks address.
            </p>
        </div>
    );
};

export default ReviewStep;
