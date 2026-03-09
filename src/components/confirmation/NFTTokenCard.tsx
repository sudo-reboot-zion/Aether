import React from 'react';
import { ShieldCheck, ExternalLink, Key, FileCode, Lock } from 'lucide-react';

interface NFTTokenCardProps {
    txId?: string;
}

const NFTTokenCard: React.FC<NFTTokenCardProps> = ({ txId = '0x...' }) => {
    return (
        <div className="bg-[var(--c-blue-deep)] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-[#A0D2EB]" />
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold mb-1">Authorization</div>
                        <div className="text-xs font-bold text-[#4ADE80] flex items-center gap-1.5 justify-end">
                            <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse"></span>
                            Finalized
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-3 text-4xl font-light tracking-tight mb-2">
                        <Key className="w-8 h-8 opacity-40" />
                        Aether Key
                    </div>
                    <div className="text-xs opacity-40 font-mono flex items-center gap-2">
                        {txId.slice(0, 12)}...{txId.slice(-12)}
                        <a
                            href={`https://explorer.stacks.co/txid/${txId}?chain=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold mb-1 flex items-center gap-1.5 text-white/80">
                            <FileCode className="w-2.5 h-2.5" /> Standard
                        </div>
                        <div className="text-sm font-medium">SIP-009 NFT</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold mb-1 flex items-center gap-1.5 justify-end text-white/80">
                            <Lock className="w-2.5 h-2.5" /> Security
                        </div>
                        <div className="text-sm font-medium">Bitcoin Anchored</div>
                    </div>
                </div>
            </div>

            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
        </div>
    );
};

export default NFTTokenCard;
