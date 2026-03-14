"use client";
import React from 'react';
import PropertyItem from './PropertyItem';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import { getIPFSUrl } from '@/lib/ipfs';
import { openContractCall } from '@stacks/connect';
import { togglePropertyStatus } from '@/lib/escrow/write';
import { userSession } from '@/lib/stacks';
import Link from 'next/link';
import { encodePropertyId } from '@/lib/urls';
import RecentReviewsList from './RecentReviewsList';
import type { Review } from '@/lib/reputation/types';
import { DashboardContentProps } from '@/redux/slices/redux.types';

const DashboardContent: React.FC<DashboardContentProps> = ({ persona, myProperties, myTrips, isLoading, userReviews = [] }) => {
    const handleToggleStatus = async (propertyId: number) => {
        if (propertyId < 0) return;

        try {
            const txOptions = await togglePropertyStatus(propertyId);

            await openContractCall({
                ...txOptions,
                userSession,
                onFinish: (data: { txId: string }) => {
                    console.log("Toggle transaction broadcasted:", data.txId);
                },
                onCancel: () => console.log("Transaction canceled"),
            });
        } catch (error) {
            console.error("Failed to toggle property status:", error);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-normal text-[var(--t-primary)]">
                    {persona === 'HOST' ? 'Your Managed Sanctuaries' : 'Your Recent Trips'}
                </h2>
            </div>

            <div className="flex flex-col gap-3">
                {isLoading && myProperties.length === 0 && myTrips.length === 0 ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white/40 p-5 rounded-2xl border border-black/5 flex justify-between items-center animate-pulse">
                            <div className="flex flex-col gap-2">
                                <Skeleton variant="text" className="w-24 h-3" />
                                <Skeleton variant="text" className="w-48 h-5" />
                            </div>
                            <Skeleton variant="text" className="w-20 h-3" />
                        </div>
                    ))
                ) : persona === 'HOST' ? (
                    myProperties.length === 0 ? (
                        <EmptyState
                            title="No Managed Sanctuaries"
                            description="Your collection of curated properties on the blockchain is currently empty. List your first sanctuary to begin your journey as a host."
                            action={{
                                label: "List a Property",
                                onClick: () => { window.location.href = '/dashboard/list-property' }
                            }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 flex flex-col gap-3">
                                {myProperties.map(property => (
                                    <PropertyItem
                                        key={`prop-${property.id}`}
                                        id={property.id}
                                        name={property.id < 0 ? 'Pending Listing...' : (property.metadata?.title || `Sanctuary #${property.id}`)}
                                        location={property.owner.slice(0, 10) + '...'}
                                        status={property.active ? 'Active' : 'Hidden'}
                                        isActive={property.active}
                                        image={(property.metadata?.images && property.metadata.images.length > 0) ? getIPFSUrl(property.metadata.images[0]) : (property.metadata?.image ? getIPFSUrl(property.metadata.image) : "#E0E0E0")}
                                        onToggle={() => handleToggleStatus(property.id)}
                                    />
                                ))}
                            </div>
                            <div className="lg:col-span-1">
                                <RecentReviewsList reviews={userReviews} />
                            </div>
                        </div>
                    )
                ) : (
                    myTrips.length === 0 ? (
                        <EmptyState
                            title="No Recent Trips"
                            description="You haven't embarked on any journeys yet. Explore our curated collection of sanctuaries to find your next destination."
                            action={{
                                label: "Explore Collection",
                                onClick: () => { window.location.href = '/collection' }
                            }}
                        />
                    ) : (
                        myTrips.map((booking, idx) => (
                            <Link key={idx} href={`/details/${encodePropertyId(booking.propertyId)}`} className="block hover:scale-[1.01] transition-transform">
                                <div className="bg-white/60 p-5 rounded-2xl border border-black/5 flex justify-between items-center group">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-[var(--c-blue-azure)] mb-1">Sanctuary #{booking.propertyId}</div>
                                        <div className="text-lg font-light group-hover:text-[var(--c-blue-azure)] transition-colors">Check-in Block: {booking.checkIn}</div>
                                    </div>
                                    <div className="text-right text-xs text-[var(--t-secondary)] uppercase font-bold tracking-tighter">
                                        Status: {booking.status}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default DashboardContent;
