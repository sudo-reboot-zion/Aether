import { Review } from '../../redux/slices/redux.types';
import { getReview, getReviewCount, getUserAverageRating } from './read';

export async function getAllReviews(): Promise<Review[]> {
    try {
        const reviewCount = await getReviewCount();
        if (reviewCount === 0) return [];

        const reviews: Review[] = [];

        for (let i = 0; i < reviewCount; i++) {
            const review = await getReview(i);
            if (review) {
                reviews.push(review);
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
        return allReviews.filter(r => r.reviewee === user);
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        return [];
    }
}

export async function getReviewsByUser(user: string): Promise<Review[]> {
    try {
        const allReviews = await getAllReviews();
        return allReviews.filter(r => r.reviewer === user);
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
