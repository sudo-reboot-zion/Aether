export const PLATFORM_FEE_BPS = 200;
export const BPS_DENOMINATOR = 10000;

export const BOOKING_STATUS = {
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    DISPUTED: "disputed",
    RESOLVED: "resolved",
    PENDING: "pending",
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export interface Property {
    owner: string;
    pricePerNight: number;
    locationTag: number;
    categoryTag: number;
    metadataUri: string;
    active: boolean;
    createdAt: number;
}

export interface Booking {
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
