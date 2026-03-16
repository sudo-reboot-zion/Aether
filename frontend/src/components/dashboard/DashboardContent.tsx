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
import { useTranslation } from '@/hooks/useTranslation';

const DashboardContent: React.FC<DashboardContentProps> = ({ persona, myProperties, myTrips, isLoading, userReviews = [] }) => {
    const { t } = useTranslation();
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
                    {persona === 'HOST' ? t('dashboard.hostTitle') : t('dashboard.guestTitle')}
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
                            title={t('emptyStates.noManagedSanctuaries.title')}
                            description={t('emptyStates.noManagedSanctuaries.description')}
                            action={{
                                label: t('emptyStates.noManagedSanctuaries.action'),
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
                                        name={property.id < 0 ? t('dashboard.pendingListing') : (property.metadata?.title || `Sanctuary #${property.id}`)}
                                        location={property.owner.slice(0, 10) + '...'}
                                        status={property.active ? t('dashboard.active') : t('dashboard.hidden')}
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
                            title={t('emptyStates.noRecentTrips.title')}
                            description={t('emptyStates.noRecentTrips.description')}
                            action={{
                                label: t('emptyStates.noRecentTrips.action'),
                                onClick: () => { window.location.href = '/collection' }
                            }}
                        />
                    ) : (
                        myTrips.map((booking, idx) => (
                            <Link key={idx} href={`/details/${encodePropertyId(booking.propertyId)}`} className="block hover:scale-[1.01] transition-transform">
                                <div className="bg-white/60 p-5 rounded-2xl border border-black/5 flex justify-between items-center group">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-[var(--c-blue-azure)] mb-1">Sanctuary #{booking.propertyId}</div>
                                        <div className="text-lg font-light group-hover:text-[var(--c-blue-azure)] transition-colors">{t('dashboard.checkInBlock')} {booking.checkIn}</div>
                                    </div>
                                    <div className="text-right text-xs text-[var(--t-secondary)] uppercase font-bold tracking-tighter">
                                        {t('dashboard.status')} {booking.status}
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
