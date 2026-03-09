export const MIN_RATING = 1;
export const MAX_RATING = 5;

export interface Review {
    bookingId: number;
    reviewer: string;
    reviewee: string;
    rating: number;
    comment: string;
    createdAt: number;
}

export interface UserStats {
    totalReviews: number;
    totalRatingSum: number;
    averageRating: number;
}
