import { uintCV, stringUtf8CV } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACTS } from '../config';

export async function raiseDispute({
    bookingId,
    reason,
    evidence,
}: {
    bookingId: number;
    reason: string;
    evidence: string;
}) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.DISPUTE,
        functionName: "raise-dispute",
        functionArgs: [
            uintCV(bookingId),
            stringUtf8CV(reason),
            stringUtf8CV(evidence),
        ],
    };
}

export async function resolveDispute({
    disputeId,
    resolution,
    refundPercentage,
}: {
    disputeId: number;
    resolution: string;
    refundPercentage: number;
}) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.DISPUTE,
        functionName: "resolve-dispute",
        functionArgs: [
            uintCV(disputeId),
            stringUtf8CV(resolution),
            uintCV(refundPercentage),
        ],
    };
}
