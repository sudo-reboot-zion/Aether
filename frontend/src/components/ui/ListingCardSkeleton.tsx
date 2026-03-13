"use client";
import React from 'react';
import Skeleton from './Skeleton';
import GlassPanel from './GlassPanel';

interface ListingCardSkeletonProps {
    layout?: 'grid' | 'list';
}

const ListingCardSkeleton: React.FC<ListingCardSkeletonProps> = ({ layout = 'grid' }) => {
    if (layout === 'list') {
        return (
            <GlassPanel className="overflow-hidden group flex flex-row h-full border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-4 gap-8 items-stretch mb-4">
                <div className="relative aspect-[16/10] w-1/3 min-w-[300px] overflow-hidden rounded-[20px]">
                    <Skeleton className="w-full h-full rounded-none" />
                </div>

                <div className="flex-1 py-2 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <Skeleton variant="text" className="w-1/2 h-8" />
                            <Skeleton className="w-16 h-6 rounded-full" />
                        </div>
                        <Skeleton variant="text" className="w-1/3 h-4 opacity-60 mb-6" />
                        <div className="flex gap-8 mb-6">
                            <Skeleton className="w-24 h-4 rounded-md" />
                            <Skeleton className="w-24 h-4 rounded-md" />
                        </div>
                    </div>

                    <div className="mt-auto pt-5 flex justify-between items-center border-t border-black/5">
                        <div className="space-y-1">
                            <Skeleton variant="text" className="w-20 h-6" />
                            <Skeleton variant="text" className="w-32 h-3" />
                        </div>
                        <Skeleton className="w-32 h-10 rounded-full" />
                    </div>
                </div>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel className="overflow-hidden group flex flex-col h-full border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" className="w-3/4" />
                        <Skeleton variant="text" className="w-1/2 opacity-60" />
                    </div>
                    <Skeleton className="w-16 h-6 rounded-full" />
                </div>

                <div className="mt-auto pt-4 flex justify-between items-center border-t border-black/5">
                    <div className="space-y-1">
                        <Skeleton variant="text" className="w-12 h-3" />
                        <Skeleton variant="text" className="w-20" />
                    </div>
                    <Skeleton className="w-24 h-9 rounded-full" />
                </div>
            </div>
        </GlassPanel>
    );
};

export default ListingCardSkeleton;
