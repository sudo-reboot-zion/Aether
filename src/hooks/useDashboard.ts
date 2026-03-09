import { useState, useEffect, useCallback } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { useDispute } from '@/hooks/useDispute';
import { useReputation } from '@/hooks/useReputation';
import { useBadges } from '@/hooks/useBadges';
import { useAetherDialog } from '@/hooks/useAetherDialog';

export function useDashboard() {
    const { userData, persona } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet || '';

    const { properties, fetchProperties, isLoading: propertiesLoading } = useProperties();
    const { bookings, fetchUserBookings, isLoading: bookingsLoading, releasePayment } = useBookings();
    const { fetchUserStats } = useReputation(userAddress);
    const { badges, fetchUserBadges } = useBadges(userAddress);

    const [activeNav, setActiveNav] = useState('dashboard');
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
    const [reviewedBookingIds, setReviewedBookingIds] = useState<Set<number>>(new Set());

    const { raiseDispute, resolveDispute, fetchDisputeStatus } = useDispute();
    const { submitReview, checkBookingReviewed, fetchUserStats: fetchUserStatsReputation, fetchUserReviews, reputationStats, userReviews } = useReputation(userAddress);
    const { confirm, prompt } = useAetherDialog();

    useEffect(() => {
        fetchProperties();
        if (userAddress) {
            fetchUserBookings(userAddress);
            fetchUserBadges(userAddress);
            fetchUserStatsReputation(userAddress);
            fetchUserReviews(userAddress);
        }
    }, [fetchProperties, fetchUserBookings, fetchUserBadges, fetchUserStatsReputation, fetchUserReviews, userAddress]);

    // Check review status for completed bookings
    useEffect(() => {
        const checkReviews = async () => {
            if (!userAddress || bookings.length === 0) return;

            const completedBookings = bookings.filter(b => b.status === 'completed' && b.guest === userAddress);
            const reviewedIds = new Set<number>();

            for (const booking of completedBookings) {
                const reviewed = await checkBookingReviewed(booking.id, userAddress);
                if (reviewed) {
                    reviewedIds.add(booking.id);
                }
            }

            setReviewedBookingIds(reviewedIds);
        };

        checkReviews();
    }, [bookings, userAddress, checkBookingReviewed]);

    const myProperties = properties.filter(p => userAddress && p.owner === userAddress);

    // Show active stays and completed stays that need reviews
    const myTrips = bookings.filter(b => b.guest === userAddress).map(b => ({
        ...b,
        hasReviewed: reviewedBookingIds.has(b.id)
    }));

    // Hosts should see confirmed and completed bookings (for earnings history)
    const hostRequests = bookings.filter(b =>
        b.host === userAddress && (b.status === 'confirmed' || b.status === 'completed')
    );

    const handleOpenReview = useCallback((booking: any) => {
        setSelectedBookingForReview(booking);
        setIsReviewDialogOpen(true);
    }, []);

    const handleRelease = useCallback(async (bookingId: number) => {
        const confirmed = await confirm(
            'Release Payment',
            'Are you sure you want to release payment to the host? This action is final and confirms your successful stay.'
        );
        if (confirmed) {
            await releasePayment(bookingId);
        }
    }, [confirm, releasePayment]);

    const handleDispute = useCallback(async (bookingId: number) => {
        const reason = await prompt(
            'Open Dispute',
            'Please describe the reason for your dispute. Our protocol intelligence will review the case.'
        );
        if (reason) {
            await raiseDispute(reason, 'User provided reason', bookingId);
        }
    }, [prompt, raiseDispute]);

    const handleResolveDispute = useCallback(async (bookingId: number) => {
        const confirmed = await confirm(
            'Resolve Dispute',
            'Are you sure you want to resolve this dispute? For testing, this will issue a 100% refund to the guest.'
        );
        if (confirmed) {
            const dispute = await fetchDisputeStatus(bookingId);
            if (dispute && 'disputeId' in dispute) {
                await resolveDispute(dispute.disputeId as number, 'Resolved via dashboard', 100);
            }
        }
    }, [confirm, fetchDisputeStatus, resolveDispute]);

    const markAsReviewed = useCallback((bookingId: number) => {
        setReviewedBookingIds(prev => new Set(prev).add(bookingId));
    }, []);

    return {
        userData,
        persona,
        propertiesLoading,
        bookingsLoading,
        activeNav,
        setActiveNav,
        myProperties,
        myTrips,
        hostRequests,
        handleRelease,
        handleDispute,
        handleResolveDispute,
        handleOpenReview,
        isReviewDialogOpen,
        setIsReviewDialogOpen,
        selectedBookingForReview,
        reviewedBookingIds,
        markAsReviewed,
        submitReview,
        stats: reputationStats,
        userReviews,
        badges
    };
}
