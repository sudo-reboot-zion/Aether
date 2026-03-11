import type React from 'react';
import type { CachedBooking } from '@/redux/slices/bookingsSlice';

export interface AnalyticsHeaderProps {
    onBack?: () => void;
}

export interface AnalyticsKPIStripProps {
    totalEarned: number;
    totalPending: number;
    activeListings: number;
    totalListings: number;
    avgRating: number;
    totalReviews: number;
}

export interface RecentActivityTableProps {
    bookings: CachedBooking[];
}

export interface AnalyticsStatBadgeProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
    accent: string;
}

export interface AnalyticsEarningsChartProps {
    bookings: Pick<CachedBooking, 'hostPayout' | 'status'>[];
}

export interface AnalyticsOccupancyChartProps {
    activeListings: number;
    totalListings: number;
    occupancyRate: number;
    completedBookings: number;
}