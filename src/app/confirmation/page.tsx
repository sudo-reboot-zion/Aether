'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import NFTTokenCard from '../../components/confirmation/NFTTokenCard';
import DigitalAccessCard from '../../components/confirmation/DigitalAccessCard';
import BookingDetails from '../../components/confirmation/BookingDetails';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const txId = searchParams.get('txId') || 'Pending...';
    const propertyId = searchParams.get('propertyId');

    return (
        <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16 animate-in slide-in-from-bottom-4 fade-in duration-700">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-[rgba(16,185,129,0.1)] text-[#065F46] rounded-full font-sans text-[10px] font-bold uppercase tracking-wider mb-6">
                    <Check className="w-4 h-4 stroke-[3]" />
                    Reservation Secured
                </div>
                <h1 className="text-6xl font-normal text-[var(--t-primary)] mb-4 tracking-tight">
                    Your stay is confirmed.
                </h1>
                <p className="text-xl opacity-70 text-[var(--t-primary)] font-serif italic">
                    We've minted your digital key to the Stacks Network.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
                <div className="flex flex-col gap-6">
                    <NFTTokenCard txId={txId} />
                    <DigitalAccessCard />
                    <Link href="/dashboard" className="mt-4 flex items-center justify-center gap-2 h-14 rounded-2xl bg-[var(--c-blue-deep)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--c-blue-azure)] transition-all shadow-lg shadow-blue-900/10 group">
                        Return to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div>
                    <BookingDetails />
                </div>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[var(--c-cream)] via-[var(--c-fog)] to-[var(--c-blue-haze)] relative overflow-x-hidden font-serif">
            <Navbar />
            <div className="pt-32 pb-24 px-6">
                <Suspense fallback={<div className="text-center py-20 font-serif italic text-[var(--t-secondary)]">Resolving blockchain data...</div>}>
                    <ConfirmationContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
