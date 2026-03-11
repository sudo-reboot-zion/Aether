import {
    principalCV,
    fetchCallReadOnlyFunction,
    cvToValue,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS, NETWORK } from '../config';

export async function getSavedProperties(userAddress: string): Promise<number[]> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.PROFILE,
            functionName: "get-saved-properties",
            functionArgs: [principalCV(userAddress)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });

        const data = cvToValue(result);
        return Array.isArray(data) ? data.map((v: any) => Number(v.value || v)) : [];
    } catch (error) {
        console.error("Error fetching saved properties:", error);
        return [];
    }
}

export async function getUserPreferences(userAddress: string) {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.PROFILE,
            functionName: "get-user-preferences",
            functionArgs: [principalCV(userAddress)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        });

        return cvToValue(result);
    } catch (error) {
        console.error("Error fetching user preferences:", error);
        return null;
    }
}
