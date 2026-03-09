"use client";
import React from 'react';
import Skeleton from './Skeleton';
import GlassPanel from './GlassPanel';

const ProfileStatsSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[1, 2, 3, 4].map((i) => (
                <GlassPanel key={i} className="p-6 flex flex-col gap-2 border-white/40 shadow-sm">
                    <Skeleton variant="text" className="w-20 h-3 opacity-60" />
                    <Skeleton variant="text" className="w-16 h-8" />
                </GlassPanel>
            ))}
        </div>
    );
};

export default ProfileStatsSkeleton;
