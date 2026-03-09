export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'disputed' | 'resolved';

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
