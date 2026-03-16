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
import { parseClarityNumber, parseClarityString } from '../parse-utils';

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
        const innerValue = result.type === ClarityType.OptionalSome ? result.value : result;
        if (!innerValue) return null;

        const data = cvToValue(innerValue);

        return {
            id: reviewId,
            bookingId: parseClarityNumber(data["booking-id"]),
            reviewer: parseClarityString(data.reviewer),
            reviewee: parseClarityString(data.reviewee),
            rating: parseClarityNumber(data.rating),
            comment: parseClarityString(data.comment),
            createdAt: parseClarityNumber(data["created-at"]),
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

        if (result.type === ClarityType.OptionalNone) {
            // Return zeroed stats instead of null to prevent NaN in components
            return { totalReviews: 0, averageRating: 0 };
        }

        const innerValue = result.type === ClarityType.OptionalSome ? result.value : result;
        if (!innerValue) return { totalReviews: 0, averageRating: 0 };

        const data = cvToValue(innerValue);

        return {
            totalReviews: parseClarityNumber(data["total-reviews"]),
            averageRating: parseClarityNumber(data["average-rating"]),
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return { totalReviews: 0, averageRating: 0 };
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
        return parseClarityNumber(cvToValue(result));
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
        return parseClarityNumber(cvToValue(result));
    } catch (error) {
        console.error("Error fetching user average rating:", error);
        return 0;
    }
}


