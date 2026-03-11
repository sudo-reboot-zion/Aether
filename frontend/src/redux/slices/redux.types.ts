import type React from 'react';
import type { CachedBooking } from '@/redux/slices/bookingsSlice';
import type { Booking as LocalBooking } from './redux.types';

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
    bookings: Pick<LocalBooking, 'hostPayout' | 'status'>[];
}

export interface AnalyticsOccupancyChartProps {
    activeListings: number;
    totalListings: number;
    occupancyRate: number;
    completedBookings: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed' | 'resolved';

export interface Booking {
    id: number;
    propertyId: number;
    guest: string;
    host: string;
    checkIn: number;
    checkOut: number;
    totalAmount: number;
    platformFee: number;
    hostPayout: number;
    status: BookingStatus;
    createdAt: number;
    escrowedAmount: number;
}

export interface BookingSidebarProps {
    propertyId: number;
    pricePerNight: number;
    owner: string;
}

export type DisputeStatus = 'open' | 'resolved' | 'dismissed';

export interface Dispute {
    id: number;
    bookingId: number;
    initiator: string;
    reason: string;
    status: DisputeStatus;
    createdAt: number;
    evidence?: string;
}

export interface Review {
    id: number;
    bookingId: number;
    reviewer: string;
    reviewee: string;
    rating: number;
    comment: string;
    createdAt: number;
}

export interface UserStats {
    totalReviews: number;
    averageRating: number;
    totalBookings?: number;
    totalEarned?: number;
}
export type Persona = 'GUEST' | 'HOST';

export interface DashboardContentProps {
    persona: Persona;
    myProperties: any[];
    myTrips: any[];
    isLoading?: boolean;
    userReviews?: any[];
}

export interface DashboardHeaderProps {
    persona: Persona;
    userName?: string;
}

export interface DashboardSidebarProps {
    persona: Persona;
    hostRequests: any[];
    myTrips: any[];
    handleRelease: (id: number) => void;
    handleDispute: (id: number) => void;
    handleResolveDispute: (bookingId: number) => void;
    handleReview?: (booking: any) => void;
    stats?: { totalReviews: number; averageRating: number } | null;
    badges?: any[];
    totalEarned?: number;
}

export interface DashboardStatsProps {
    persona: Persona;
    myProperties: any[];
    myTrips: any[];
    hostRequests?: any[];
    isLoading?: boolean;
    stats?: { totalReviews: number; averageRating: number } | null;
    badges?: any[];
}

export interface NavDockProps {
    activeItem: string;
    setActiveItem: (id: string) => void;
}

export interface StatCardProps {
    label: string;
    value: string;
    description: string;
    trend: 'up' | 'neutral' | 'down';
    trendValue: string;
}

export interface PropertyItemProps {
    id?: number;
    name: string;
    location: string;
    status: string;
    isActive: boolean;
    image: string;
    onToggle: () => void;
}

export interface RequestCardDetails {
    dates: string;
    guests: string;
    price?: string;
    status?: string;
}

export interface RequestCardProps {
    user: string;
    type: 'inquiry' | 'question' | 'booking' | 'action_required' | 'completed';
    details?: RequestCardDetails;
    quote?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    onReply?: () => void;
    onRelease?: () => void;
    onDispute?: () => void;
    onResolveDispute?: () => void;
    onReview?: () => void;
}
export interface PropertyMetadata {
    title: string;
    description: string;
    location: string;
    pricePerNight?: number;
    images: string[];
    /** @deprecated Use `images` array instead */
    image?: string;
    amenities: string[];
    vibes?: string[];
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    locationTag?: number;
    categoryTag?: number;
}

export interface Property {
    id: number;
    owner: string;
    pricePerNight: number;
    locationTag: number;
    categoryTag: number;
    metadataUri: string;
    active: boolean;
    createdAt: number;
    metadata?: PropertyMetadata;
}

export interface ListingPreviewProps {
    title: string;
    description: string;
    images: string[];
    pricePerNight: number;
    location: string;
    amenities: string[];
    vibes: string[];
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
}

export interface PropertyCardProps {
    id: number;
    title: string;
    location: string;
    pricePerNight: number;
    images: string[];
    active: boolean;
}

export interface GalleryProps {
    images: string[];
    title?: string;
}

export interface PropertyInfoProps {
    title: string;
    description: string;
    amenities: string[];
    vibes: string[];
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    location: string;
    owner: string;
}

export interface FilterBarProps {
    onFilter: (filters: PropertyFilters) => void;
    className?: string;
}

export interface PropertyFilters {
    location?: number;
    category?: number;
    maxPrice?: number;
    vibes?: string[];
}

export interface VibeCardProps {
    slug: string;
    label: string;
    icon?: string;
    selected?: boolean;
    onSelect?: (slug: string) => void;
}
export interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
    variant?: SkeletonVariant;
    className?: string;
}

export interface EmptyStateAction {
    label: string;
    onClick: () => void;
}

export interface EmptyStateProps {
    title: string;
    description: string;
    action?: EmptyStateAction;
}

export interface NavLinkProps {
    href: string;
    label: string;
    active?: boolean;
}

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}
