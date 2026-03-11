import { Dispute } from './types';
import { getDispute, getDisputeCount } from './read';

export async function getAllDisputes(): Promise<(Dispute & { id: number })[]> {
    try {
        const disputeCount = await getDisputeCount();
        if (disputeCount === 0) return [];

        const disputes: (Dispute & { id: number })[] = [];

        for (let i = 0; i < disputeCount; i++) {
            const dispute = await getDispute(i);
            if (dispute) {
                disputes.push({ id: i, ...dispute });
            }
        }

        return disputes;
    } catch (error) {
        console.error("Error fetching all disputes:", error);
        return [];
    }
}
