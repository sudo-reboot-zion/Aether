import { Review } from '../../redux/slices/redux.types';
import { getReview, getReviewCount, getUserAverageRating } from './read';

export async function getAllReviews(): Promise<Review[]> {
    try {
        const reviewCount = await getReviewCount();
        if (reviewCount === 0) return [];

        const reviews: Review[] = [];
        const batchSize = 10;

        for (let i = 0; i < reviewCount; i += batchSize) {
            const batchPromises = [];
            for (let j = 0; j < batchSize && (i + j) < reviewCount; j++) {
                batchPromises.push(getReview(i + j));
            }

            const results = await Promise.all(batchPromises);
            results.forEach(r => {
                if (r) reviews.push(r);
            });

            // Brief delay to avoid hitting rate limits if there are many reviews
            if (i + batchSize < reviewCount) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        return reviews;
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        return [];
    }
}

export async function getUserReviews(user: string): Promise<Review[]> {
    try {
        const allReviews = await getAllReviews();
        const normalizedUser = user.toLowerCase();
        return allReviews.filter(r => r.reviewee.toLowerCase() === normalizedUser);
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        return [];
    }
}

export async function getReviewsByUser(user: string): Promise<Review[]> {
    try {
        const allReviews = await getAllReviews();
        const normalizedUser = user.toLowerCase();
        return allReviews.filter(r => r.reviewer.toLowerCase() === normalizedUser);
    } catch (error) {
        console.error("Error fetching reviews by user:", error);
        return [];
    }
}

export async function getBookingReviews(bookingId: number): Promise<Review[]> {
    try {
        const allReviews = await getAllReviews();
        return allReviews.filter(r => r.bookingId === bookingId);
    } catch (error) {
        console.error("Error fetching booking reviews:", error);
        return [];
    }
}

export function formatAverageRating(ratingTimes100: number): number {
    return ratingTimes100 / 100;
}

export async function getUserFormattedRating(user: string): Promise<number> {
    const rating = await getUserAverageRating(user);
    return formatAverageRating(rating);
}
