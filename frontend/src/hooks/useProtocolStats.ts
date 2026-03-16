"use client";
import { useState, useEffect } from 'react';
import { getPropertyNonce, getBookingNonce } from '@/lib/escrow/read';
import { NETWORK_TYPE } from '@/lib/config';

export interface ProtocolStats {
    totalProperties: number;
    totalBookings: number;
    completedBookings: number;
    network: string;
    isLoading: boolean;
}

export function useProtocolStats(): ProtocolStats {
    const [totalProperties, setTotalProperties] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [completedBookings, setCompletedBookings] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchStats = async () => {
            try {
                const [propNonce, bookingNonce] = await Promise.all([
                    getPropertyNonce(),
                    getBookingNonce(),
                ]);

                if (cancelled) return;

                // Nonces are the NEXT ID, so total is nonce
                setTotalProperties(propNonce);
                setTotalBookings(bookingNonce);

                // For completed bookings, for now we can fetch all and count, 
                // but since it's a high level stat, we can use a more efficient heuristic 
                // or just leave it at 0 if no real data. 
                // However, let's try to get a real count for "Completed" by checking status 
                // if the number of bookings is small.
                const { getAllBookings } = await import('@/lib/escrow/query');
                const allBookings = await getAllBookings(50); // Fetch recent 50
                const completedCount = allBookings.filter(b => b.status === 'completed').length;

                setCompletedBookings(completedCount);
            } catch (err) {
                console.error('[useProtocolStats] Error fetching stats:', err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchStats();
        return () => { cancelled = true; };
    }, []);

    return {
        totalProperties,
        totalBookings,
        completedBookings,
        network: NETWORK_TYPE === 'mainnet' ? 'Mainnet' : 'Testnet',
        isLoading,
    };
}
