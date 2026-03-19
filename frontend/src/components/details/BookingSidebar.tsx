"use client";
import Button from '../ui/Button';
import { CurrencyDisplay } from '../ui/CurrencyDisplay';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassPanel from '../ui/GlassPanel';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { useNetwork } from '@/hooks/useNetwork';
import { APP_CONFIG } from '@/lib/config';
import { useToast } from '@/hooks/useToast';

interface BookingSidebarProps {
    propertyId?: number;
    pricePerNight?: number;
    hostAddress?: string;
    maxGuests?: number;
}

const BookingSidebar = ({
    propertyId,
    pricePerNight = 0,
    hostAddress = '',
    maxGuests = 2
}: BookingSidebarProps) => {
    const { userData, connectWallet } = useAuth();
    const { blockHeight } = useNetwork();
    const { bookProperty } = useBookings();
    const { t } = useTranslation();
    const router = useRouter();
    const { toast } = useToast();
    const [isBooking, setIsBooking] = useState(false);


    const [numNights, setNumNights] = useState(3);
    const [selectedGuests, setSelectedGuests] = useState(1);
    const guestAddress = userData?.profile?.stxAddress?.testnet;

    // Exact blockchain math alignment (microStacks)
    const baseAmountMicro = pricePerNight * numNights;
    const platformFeeMicro = Math.floor((baseAmountMicro * APP_CONFIG.PLATFORM_FEE_PERCENT) / 100);
    const totalMicro = baseAmountMicro + platformFeeMicro;

    const priceSTX = pricePerNight / 1000000;
    const platformFeeSTX = platformFeeMicro / 1000000;
    const totalSTX = totalMicro / 1000000;
    const handleReserve = async () => {
        if (!guestAddress) {
            toast({
                title: "Authentication Required",
                description: "Please connect your wallet first",
                variant: "destructive"
            });
            return;
        }

        if (propertyId === undefined) {
            toast({
                title: "Context Error",
                description: "Property context not found",
                variant: "destructive"
            });
            return;
        }

        setIsBooking(true);
        try {
            // Estimate block heights: 1 block ≈ 10 mins
            // Reduced from 144 (24h) to 1 for easier Testnet testing
            const currentHeight = blockHeight || 1000;
            const checkIn = currentHeight;
            const checkOut = checkIn + (numNights * 144);

            await bookProperty(
                propertyId,
                checkIn,
                checkOut,
                numNights,
                pricePerNight,
                guestAddress,
                hostAddress,
                (txId: string) => {
                    const params = new URLSearchParams({
                        txId,
                        propertyId: propertyId.toString(),
                        price: (priceSTX * numNights).toString(),
                        checkIn: checkIn.toString()
                    });
                    router.push(`/confirmation?${params.toString()}`);
                }
            );
        } catch (err) {
            console.error('Booking error:', err);
        } finally {
            setIsBooking(false);
        }
    };

    const CalendarDay = ({ day, disabled, active }: { day: string | number, disabled?: boolean, active?: boolean }) => (
        <div className={`py-2 text-center rounded ${disabled ? 'text-[var(--t-secondary)] opacity-30 cursor-default' : 'cursor-pointer hover:bg-[rgba(27,64,102,0.05)]'} ${active ? 'bg-[var(--c-blue-azure)] text-white hover:bg-[var(--c-blue-azure)]' : ''} ${!disabled && !active ? 'text-[var(--t-primary)]' : ''}`}>
            {day}
        </div>
    );

    return (
        <aside className="sticky top-32">
            <GlassPanel className="p-8 bg-white/70 backdrop-blur-[24px]">
                <div className="flex items-baseline mb-6">
                    <span className="text-[2.5rem] font-normal">
                        <CurrencyDisplay amount={priceSTX} />
                    </span>
                    <span className="text-base font-sans text-[var(--t-secondary)] ml-1">{t('booking.night')}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 border border-[rgba(27,64,102,0.1)] rounded-lg bg-white/50">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--t-secondary)] mb-1">{t('booking.stayDuration')}</div>
                        <select
                            className="bg-transparent w-full outline-none font-sans text-sm"
                            value={numNights}
                            onChange={(e) => setNumNights(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 14].map(n => <option key={n} value={n}>{n} {t('booking.nights')}</option>)}
                        </select>
                    </div>
                    <div className="p-3 border border-[rgba(27,64,102,0.1)] rounded-lg bg-white/50">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--t-secondary)] mb-1">{t('booking.guests')}</div>
                        <select
                            className="bg-transparent w-full outline-none font-sans text-sm"
                            value={selectedGuests}
                            onChange={(e) => setSelectedGuests(parseInt(e.target.value))}
                        >
                            {Array.from({ length: maxGuests }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n} {t('booking.guests')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[rgba(27,64,102,0.1)]">
                    <div className="flex justify-between mb-3 font-sans text-sm">
                        <span>
                            <CurrencyDisplay amount={priceSTX} /> x {numNights} {t('booking.nights').toLowerCase()}
                        </span>
                        <span><CurrencyDisplay amount={priceSTX * numNights} /></span>
                    </div>
                    <div className="flex justify-between mb-3 font-sans text-sm">
                        <span>{t('booking.platformFee')} ({APP_CONFIG.PLATFORM_FEE_PERCENT}%)</span>
                        <span><CurrencyDisplay amount={platformFeeSTX} precision={4} /></span>
                    </div>
                    <div className="flex justify-between mt-4 items-end">
                        <span className="font-semibold text-lg">{t('booking.total')}</span>
                        <div className="text-right">
                            <div className="text-xs font-sans font-bold text-[var(--c-blue-azure)] uppercase tracking-tight mb-0.5">Final Settlement</div>
                            <span className="text-2xl font-bold text-[var(--t-primary)]">
                                <CurrencyDisplay amount={totalSTX} />
                            </span>
                        </div>
                    </div>
                    {/* Explicitly show STX if in USD mode for wallet verification */}
                    <div className="mt-2 text-[10px] font-sans text-right opacity-40 uppercase tracking-widest font-bold">
                        Exact Transfer: {totalSTX.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} STX
                    </div>
                </div>

                {!userData ? (
                    <Button
                        className="w-full mt-6 py-4 rounded-xl text-base shadow-xl"
                        onClick={connectWallet}
                    >
                        {t('booking.connect')}
                    </Button>
                ) : guestAddress === hostAddress ? (
                    <Button
                        className="w-full mt-6 py-4 rounded-xl text-base shadow-xl"
                        onClick={() => router.push('/dashboard')}
                    >
                        {t('booking.manage')}
                    </Button>
                ) : (
                    <Button
                        className="w-full mt-6 py-4 rounded-xl text-base shadow-xl"
                        onClick={handleReserve}
                        disabled={isBooking}
                    >
                        {isBooking ? t('booking.processing') : t('booking.reserve')}
                    </Button>
                )}

                <div className="flex items-center justify-center gap-2 mt-4 py-1.5 px-3 bg-[rgba(27,64,102,0.05)] rounded-full w-full font-sans text-[10px] text-[var(--t-primary)] uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {t('booking.escrow')}
                </div>
            </GlassPanel>
        </aside>
    );
};

export default BookingSidebar;
