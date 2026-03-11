import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import type { Review } from '@/redux/slices/redux.types';

interface RecentReviewsListProps {
    reviews: Review[];
    isLoading?: boolean;
}

const RecentReviewsList: React.FC<RecentReviewsListProps> = ({ reviews, isLoading }) => {
    return (
        <GlassPanel className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-medium text-[var(--t-primary)]">Guest Reviews</h3>
                    <p className="text-xs text-[var(--t-secondary)] font-sans mt-0.5">What guests are saying</p>
                </div>
                <MessageSquare size={16} className="text-[var(--c-blue-azure)]" />
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-4 mt-4 animate-pulse">
                    {[1, 2].map(i => (
                        <div key={i} className="flex flex-col gap-2 pb-4 border-b border-black/5 last:border-0">
                            <div className="h-4 bg-black/5 rounded w-1/4"></div>
                            <div className="h-10 bg-black/5 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-[var(--t-secondary)] text-sm font-sans">
                    No reviews received yet.
                </div>
            ) : (
                <div className="flex flex-col gap-4 mt-2 max-h-[400px] overflow-y-auto scroll-hide pr-2">
                    {reviews.slice().sort((a, b) => b.createdAt - a.createdAt).map((review, i) => (
                        <div key={i} className="flex flex-col gap-2 pb-4 border-b border-black/5 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[var(--c-blue-azure)]/10 flex items-center justify-center text-[var(--c-blue-azure)] text-xs font-medium">
                                        {review.reviewer.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">{review.reviewer.substring(0, 5)}...{review.reviewer.slice(-4)}</div>
                                        <div className="text-[10px] text-[var(--t-secondary)] font-sans">
                                            Booking #{review.bookingId}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {Array(5).fill(0).map((_, idx) => (
                                        <Star
                                            key={idx}
                                            size={12}
                                            className={idx < review.rating ? 'text-amber-400' : 'text-gray-200'}
                                            fill={idx < review.rating ? 'currentColor' : 'transparent'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-[var(--t-secondary)] font-sans leading-relaxed mt-1 italic">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </GlassPanel>
    );
};

export default RecentReviewsList;
