import {
    uintCV,
    fetchCallReadOnlyFunction,
    ClarityType,
    cvToValue,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS, NETWORK } from '../config';
import { Dispute, BookingDispute } from "./types";

export async function getDispute(disputeId: number): Promise<Dispute | null> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.DISPUTE,
            functionName: "get-dispute",
            functionArgs: [uintCV(disputeId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });

        if (result.type === ClarityType.OptionalNone) return null;
        if (result.type !== ClarityType.OptionalSome || !result.value) return null;

        const data = cvToValue(result.value);

        return {
            bookingId: Number(data["booking-id"]),
            raisedBy: data["raised-by"],
            reason: data.reason,
            evidence: data.evidence,
            status: data.status,
            resolution: data.resolution,
            refundPercentage: Number(data["refund-percentage"]),
            createdAt: Number(data["created-at"]),
            resolvedAt: Number(data["resolved-at"]),
        };
    } catch (error) {
        console.error("Error fetching dispute:", error);
        return null;
    }
}

export async function getBookingDispute(bookingId: number): Promise<BookingDispute | null> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.DISPUTE,
            functionName: "get-booking-dispute",
            functionArgs: [uintCV(bookingId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });

        if (result.type === ClarityType.OptionalNone) return null;
        if (result.type !== ClarityType.OptionalSome || !result.value) return null;

        const data = cvToValue(result.value);

        return {
            disputeId: Number(data["dispute-id"]),
            exists: data.exists,
        };
    } catch (error) {
        console.error("Error fetching booking dispute:", error);
        return null;
    }
}

export async function isDisputeResolved(disputeId: number): Promise<boolean> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.DISPUTE,
            functionName: "is-dispute-resolved",
            functionArgs: [uintCV(disputeId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });
        return result.type === ClarityType.BoolTrue;
    } catch (error) {
        console.error("Error checking if dispute is resolved:", error);
        return false;
    }
}

export async function getDisputeStatus(disputeId: number): Promise<string | null> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.DISPUTE,
            functionName: "get-dispute-status",
            functionArgs: [uintCV(disputeId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });
        if (result.type === ClarityType.OptionalNone) return null;
        if (result.type !== ClarityType.OptionalSome || !result.value) return null;
        return cvToValue(result.value) as string;
    } catch (error) {
        console.error("Error fetching dispute status:", error);
        return null;
    }
}

export async function getDisputeCount(): Promise<number> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.DISPUTE,
            functionName: "get-dispute-count",
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });
        return Number(cvToValue(result));
    } catch (error) {
        console.error("Error fetching dispute count:", error);
        return 0;
    }
}

export async function getContractOwner(): Promise<string | null> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.DISPUTE,
            functionName: "get-contract-owner",
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });
        return cvToValue(result);
    } catch (error) {
        console.error("Error fetching contract owner:", error);
        return null;
    }
}
