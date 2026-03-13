"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GlassPanel from '../ui/GlassPanel';
import Image from 'next/image';
import SafeImage from '../ui/SafeImage';
import { useProperties } from '@/hooks/useProperties';
import { fetchIPFSMetadata, getIPFSUrl, PropertyMetadata } from '@/lib/ipfs';
import { Clock, MapPin, Receipt, CreditCard } from 'lucide-react';
import { encodePropertyId } from '@/lib/urls';
import Identicon from '../ui/Identicon';

const InfoBlock = ({ label, value, mono = false, icon: Icon, children }: { label: string, value?: string, mono?: boolean, icon?: any, children?: React.ReactNode }) => (
    <div className="mb-8">
        <div className="font-sans text-[10px] text-[var(--t-secondary)] uppercase mb-2 tracking-[0.2em] font-bold opacity-60 flex items-center gap-2">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
        </div>
        {value && (
            <div className={`text-[var(--t-primary)] ${mono ? 'font-mono text-xs bg-[var(--c-cream)] border border-black/5 px-3 py-1.5 rounded-lg inline-block' : 'font-serif text-xl font-medium'}`}>
                {value}
            </div>
        )}
        {children}
    </div>
);

const ReceiptRow = ({ label, value, isTotal = false }: { label: string, value: string, isTotal?: boolean }) => (
    <div className={`flex justify-between mb-3 font-sans text-xs ${isTotal ? 'text-base font-bold pt-4 border-t border-black/5 mt-4 text-[var(--t-primary)]' : 'font-medium text-[var(--t-secondary)]'}`}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

import { APP_CONFIG } from '@/lib/config';

const BookingDetails = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { properties } = useProperties();
    const [metadata, setMetadata] = useState<PropertyMetadata | null>(null);

    const txId = searchParams.get('txId') || 'Pending...';
    const propertyId = searchParams.get('propertyId');
    const priceStr = searchParams.get('price') || '0.00';
    const checkIn = searchParams.get('checkIn') || '...';

    const [hostAddress, setHostAddress] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (propertyId) {
                const prop = properties.find(p => p.id.toString() === propertyId);
                if (prop) {
                    setHostAddress(prop.owner);
                }
                if (prop?.metadataUri) {
                    const data = await fetchIPFSMetadata(prop.metadataUri);
                    setMetadata(data);
                }
            }
        };
        load();
    }, [propertyId, properties]);

    const propertyTitle = metadata?.title || `Sanctuary #${propertyId ? encodePropertyId(Number(propertyId)) : '---'}`;
    const hostName = metadata?.hostName || 'Verified Superhost';
    const price = parseFloat(priceStr);
    const platformFee = price * (APP_CONFIG.PLATFORM_FEE_PERCENT / 100);
    const networkFee = 0.001; // Typically small static estimate for UX
    const totalEscrowed = price + platformFee + networkFee;

    const handleContact = () => {
        if (!hostAddress) return;
        // Redirect to profile messages and pass booking/partner info
        const params = new URLSearchParams();
        params.set('tab', 'messages');
        if (propertyId) params.set('bookingId', propertyId);
        params.set('partner', hostAddress);
        router.push(`/profile?${params.toString()}`);
    };

    return (
        <GlassPanel className="p-12 !bg-[var(--c-white-glass)] border border-white/50 shadow-2xl shadow-black/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                <InfoBlock label="Voucher ID" value={`ATH-${propertyId ? encodePropertyId(Number(propertyId)) : '---'}-${txId.slice(2, 6).toUpperCase()}`} icon={Receipt} />
                <InfoBlock label="Signature Hash" value={txId.slice(0, 10) + '...'} mono icon={CreditCard} />
            </div>

            <InfoBlock label="Stay Details" icon={MapPin}>
                <p className="text-2xl font-serif mb-3 font-medium text-[var(--t-primary)]">{propertyTitle}</p>
                <p className="text-sm font-sans opacity-70 leading-[1.6] font-medium text-[var(--t-secondary)] uppercase tracking-widest">
                    Arrival Block: #{checkIn} • Key Active Immediately
                </p>
                <div className="mt-4 p-4 rounded-2xl bg-[var(--c-cream)]/50 border border-black/5 text-xs text-[var(--t-secondary)] leading-relaxed italic">
                    "Upon arrival, your Aether digital signature will automatically synchronize with the on-chain lock at {propertyTitle}."
                </div>
            </InfoBlock>

            <div className="border-t border-black/5 pt-10 mb-10">
                <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-6 font-bold opacity-60">
                    SETTLEMENT SUMMARY
                </h3>
                <ReceiptRow label={`${propertyTitle} Stay`} value={`${price.toFixed(2)} STX`} />
                <ReceiptRow label={`Service Fee (${APP_CONFIG.PLATFORM_FEE_PERCENT}%)`} value={`${platformFee.toFixed(3)} STX`} />
                <ReceiptRow label="Network Fee" value={`${networkFee.toFixed(3)} STX`} />
                <div className="h-[1px] bg-black/5 my-6" />
                <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-serif text-[var(--t-primary)] font-medium">Total Escrowed</span>
                    <span className="text-2xl font-serif text-[var(--t-primary)] font-bold">{totalEscrowed.toFixed(3)} STX</span>
                </div>
            </div>

            <div className="mt-10 pt-10 border-t border-black/5">
                <div className="flex items-center gap-6">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-white/5 flex items-center justify-center">
                        {metadata?.images?.[1] ? (
                            <SafeImage src={metadata.images[1]} alt={hostName} fill className="object-cover" />
                        ) : hostAddress ? (
                            <Identicon address={hostAddress} size={56} />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">HOST</div>
                        )}
                    </div>
                    <div>
                        <div className="text-xl font-serif leading-none mb-2 font-medium text-[var(--t-primary)]">{hostName}</div>
                        <div className="font-sans text-[10px] text-[var(--t-secondary)] opacity-60 uppercase tracking-widest font-bold">Aether Trusted Node</div>
                    </div>
                    <button
                        onClick={handleContact}
                        className="ml-auto bg-white border border-black/10 text-[var(--t-primary)] px-6 py-2.5 rounded-xl font-sans text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                        Contact
                    </button>
                </div>
            </div>
        </GlassPanel>
    );
};

export default BookingDetails;
