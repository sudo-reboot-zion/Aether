export const DISPUTE_STATUS = {
    PENDING: "pending",
    RESOLVED: "resolved",
    REJECTED: "rejected",
} as const;

export interface Dispute {
    bookingId: number;
    raisedBy: string;
    reason: string;
    evidence: string;
    status: string;
    resolution: string;
    refundPercentage: number;
    createdAt: number;
    resolvedAt: number;
}

export interface BookingDispute {
    disputeId: number;
    exists: boolean;
}
