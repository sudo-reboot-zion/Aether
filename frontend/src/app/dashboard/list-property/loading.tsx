"use client";
import React from 'react';
import GenerativeLoader from '@/components/ui/GenerativeLoader/GenerativeLoader';

export default function Loading() {
    return <GenerativeLoader
        duration={1500}
        messages={[
            "Syncing with Bitcoin layers...",
            "Finalizing metadata crystals..."
        ]}
    />;
}
