import {
    principalCV,
    uintCV,
    fetchCallReadOnlyFunction,
    ClarityType,
    cvToValue,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS, NETWORK } from '../config';
import { rateLimiter } from '../rate-limiter';
import { UserBadge, BadgeMetadata, BADGE_TYPES, BadgeType, BadgeTypeInfo } from './types';
import { getBadgeMetadata, getBadgeTypeInfo } from './core';

export async function hasBadge(user: string, badgeType: number): Promise<boolean> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.BADGE,
            functionName: "has-badge",
            functionArgs: [principalCV(user), uintCV(badgeType)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        return result.type === ClarityType.BoolTrue;
    } catch (error) {
        console.error("Error checking if user has badge:", error);
        return false;
    }
}

export async function getUserBadge(
    user: string,
    badgeType: number
): Promise<UserBadge | null> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.BADGE,
            functionName: "get-user-badge",
            functionArgs: [principalCV(user), uintCV(badgeType)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        if (result.type === ClarityType.OptionalNone) {
            return null;
        }

        if (result.type !== ClarityType.OptionalSome || !result.value) {
            return null;
        }

        const data = cvToValue(result.value);
        const badgeIdRaw = data["badge-id"];
        const earnedRaw = data.earned;

        const badgeId = typeof badgeIdRaw === 'object' && badgeIdRaw?.value ? badgeIdRaw.value : badgeIdRaw;
        const earned = typeof earnedRaw === 'object' && earnedRaw?.value ? earnedRaw.value : earnedRaw;

        return {
            badgeId: Number(badgeId),
            earned: earned === true || earned === 'true',
        };
    } catch (error) {
        return null;
    }
}

export async function getAllUserBadges(user: string): Promise<(BadgeMetadata & { id: number })[]> {
    try {
        const results: (BadgeMetadata & { id: number })[] = [];
        const badgeTypes = Object.values(BADGE_TYPES);

        const userBadges = await Promise.all(
            badgeTypes.map(async (badgeType: number) => {
                const userBadge = await getUserBadge(user, badgeType);
                return userBadge;
            })
        );

        for (const userBadge of userBadges) {
            if (userBadge && userBadge.earned) {
                const metadata = await getBadgeMetadata(userBadge.badgeId);
                if (metadata) {
                    results.push({
                        id: userBadge.badgeId,
                        ...metadata,
                    });
                }
            }
        }

        return results;
    } catch (error) {
        console.error("Error fetching all user badges:", error);
        return [];
    }
}

export async function getAllBadgeTypes(): Promise<(BadgeTypeInfo & { type: BadgeType })[]> {
    try {
        const badgeTypes = Object.values(BADGE_TYPES);
        const results = await Promise.all(
            badgeTypes.map(async (type: number) => {
                const info = await getBadgeTypeInfo(type);
                if (info) {
                    return { ...info, type: type as BadgeType };
                }
                return null;
            })
        );

        return results.filter((r): r is (BadgeTypeInfo & { type: BadgeType }) => r !== null);
    } catch (error) {
        console.error("Error fetching all badge types:", error);
        return [];
    }
}
