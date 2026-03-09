import {
    principalCV,
    uintCV,
    fetchCallReadOnlyFunction,
    ClarityType,
    cvToValue,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS, NETWORK } from '../config';
import { Review, UserStats } from '../../redux/slices/redux.types';

import { rateLimiter } from '../rate-limiter';

export async function getReview(reviewId: number): Promise<Review | null> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.REPUTATION,
            functionName: "get-review",
            functionArgs: [uintCV(reviewId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        if (result.type === ClarityType.OptionalNone) return null;
        if (result.type !== ClarityType.OptionalSome || !result.value) return null;

        const data = cvToValue(result.value);

        return {
            id: reviewId,
            bookingId: Number(data["booking-id"] || 0),
            reviewer: data.reviewer,
            reviewee: data.reviewee,
            rating: Number(data.rating || 0),
            comment: data.comment,
            createdAt: Number(data["created-at"] || 0),
        };
    } catch (error) {
        console.error("Error fetching review:", error);
        return null;
    }
}

export async function getUserStats(user: string): Promise<UserStats | null> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.REPUTATION,
            functionName: "get-user-stats",
            functionArgs: [principalCV(user)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        if (result.type === ClarityType.OptionalNone) return null;
        if (result.type !== ClarityType.OptionalSome || !result.value) return null;

        const data = cvToValue(result.value);

        return {
            totalReviews: Number(data["total-reviews"] || 0),
            averageRating: Number(data["average-rating"] || 0),
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return null;
    }
}

export async function hasReviewed(bookingId: number, reviewer: string): Promise<boolean> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.REPUTATION,
            functionName: "has-reviewed",
            functionArgs: [uintCV(bookingId), principalCV(reviewer)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));
        return result.type === ClarityType.BoolTrue;
    } catch (error) {
        console.error("Error checking if user has reviewed:", error);
        return false;
    }
}

export async function getReviewCount(): Promise<number> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.REPUTATION,
            functionName: "get-review-count",
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));
        return Number(cvToValue(result) || 0);
    } catch (error) {
        console.error("Error fetching review count:", error);
        return 0;
    }
}

export async function getUserAverageRating(user: string): Promise<number> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.REPUTATION,
            functionName: "get-user-average-rating",
            functionArgs: [principalCV(user)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));
        return Number(cvToValue(result) || 0);
    } catch (error) {
        console.error("Error fetching user average rating:", error);
        return 0;
    }
}


