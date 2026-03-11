"use client";

import React, { useState } from 'react';
import { Star, X, Sparkles, Send } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';

interface ReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    booking: any;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    booking
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit(rating, comment);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md animate-in zoom-in-95 duration-300">
                <GlassPanel className="p-8 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--c-blue-azure)] opacity-10 blur-[64px] rounded-full" />
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500 opacity-10 blur-[64px] rounded-full" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-[var(--t-secondary)]" />
                    </button>

                    <div className="flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--c-blue-azure)]/10 flex items-center justify-center text-[var(--c-blue-azure)]">
                            <Sparkles className="w-8 h-8" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-serif text-[var(--t-primary)] mb-2">Build the Legacy</h2>
                            <p className="text-xs text-[var(--t-primary)] uppercase tracking-[0.2em] font-bold opacity-80">
                                Leave a review for Sanctuary #{booking?.propertyId}
                            </p>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex gap-2 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-all hover:scale-110 active:scale-90"
                                >
                                    <Star
                                        className={`w-8 h-8 ${(hover || rating) >= star
                                            ? 'fill-[var(--c-blue-azure)] text-[var(--c-blue-azure)]'
                                            : 'text-gray-300 fill-transparent'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Comment area */}
                        <div className="w-full text-left space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--t-primary)] ml-1 opacity-80">Your Experience</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe the atmosphere, the details, and the host's hospitality..."
                                className="w-full h-32 bg-white/60 border border-black/10 rounded-2xl p-4 text-sm font-normal text-[var(--t-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--c-blue-azure)]/20 transition-all resize-none placeholder:text-gray-500"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0}
                            className="w-full h-12 rounded-full bg-[var(--c-blue-deep)] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:scale-100 hover:scale-[1.02] transition-all shadow-xl shadow-blue-900/10"
                        >
                            <Send className="w-4 h-4" /> Broadcast Review
                        </button>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default ReviewDialog;
