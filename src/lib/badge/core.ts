import {
    principalCV,
    uintCV,
    stringAsciiCV,
    fetchCallReadOnlyFunction,
    ClarityType,
    cvToValue,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS, NETWORK } from '../config';
import { rateLimiter } from '../rate-limiter';
import { BadgeMetadata, BadgeTypeInfo } from "./types";


/**
 * Robustly unwraps any ClarityValue objects (including nested ones) into primitives.
 * This prevents the "Objects are not valid as a React child" error when rendering metadata.
 */
function unwrapCVValue(val: any): any {
    if (val === null || val === undefined) return val;

    // If it's a ClarityValue-like object with type and value
    if (typeof val === 'object' && 'type' in val && 'value' in val) {
        return unwrapCVValue(val.value);
    }

    // If it's an array, unwrap each element
    if (Array.isArray(val)) {
        return val.map(unwrapCVValue);
    }

    // If it's a plain object (tuple/map), unwrap each property
    if (typeof val === 'object' && val.constructor === Object) {
        const unwrapped: any = {};
        for (const [key, value] of Object.entries(val)) {
            unwrapped[key] = unwrapCVValue(value);
        }
        return unwrapped;
    }

    // Primitive or already unwrapped
    return val;
}

export async function getBadgeMetadata(badgeId: number): Promise<BadgeMetadata | null> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.BADGE,
            functionName: "get-badge-metadata",
            functionArgs: [uintCV(badgeId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        if (result.type === ClarityType.OptionalNone) {
            return null;
        }

        if (result.type !== ClarityType.OptionalSome || !result.value) {
            return null;
        }

        const rawData = cvToValue(result.value);
        const data = unwrapCVValue(rawData);

        const badgeType = data["badge-type"];
        const earnedAt = data["earned-at"];

        return {
            badgeType: Number(badgeType),
            owner: String(data.owner),
            earnedAt: Number(earnedAt),
            metadataUri: String(data["metadata-uri"] || ""),
        };
    } catch (error) {
        console.error("Error fetching badge metadata:", error);
        return null;
    }
}

export async function getBadgeTypeInfo(badgeType: number): Promise<BadgeTypeInfo | null> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.BADGE,
            functionName: "get-badge-type-info",
            functionArgs: [uintCV(badgeType)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        if (result.type === ClarityType.OptionalNone) {
            return null;
        }

        if (result.type !== ClarityType.OptionalSome || !result.value) {
            return null;
        }

        const rawData = cvToValue(result.value);
        const data = unwrapCVValue(rawData);

        return {
            name: String(data.name || ""),
            description: String(data.description || ""),
            imageUri: String(data["image-uri"] || ""),
            active: Boolean(data.active),
        };
    } catch (error) {
        console.error(`Error fetching badge type info for ${badgeType}:`, error);
        return null;
    }
}

export async function getOwner(badgeId: number): Promise<string | null> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.BADGE,
            functionName: "get-owner",
            functionArgs: [uintCV(badgeId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        if (result.type === ClarityType.OptionalNone) return null;
        if (result.type !== ClarityType.OptionalSome || !result.value) return null;
        const ownerData = cvToValue(result.value);

        if (ownerData === null) {
            return null;
        }

        return ownerData as string;
    } catch (error) {
        console.error("Error fetching badge owner:", error);
        return null;
    }
}

export async function getTotalBadges(): Promise<number> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.BADGE,
            functionName: "get-total-badges",
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        return Number(cvToValue(result));
    } catch (error) {
        console.error("Error fetching total badges:", error);
        return 0;
    }
}
