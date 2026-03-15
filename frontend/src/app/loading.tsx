"use client";
import React from 'react';
import GenerativeLoader from '@/components/ui/GenerativeLoader/GenerativeLoader';

export default function Loading() {
    return <GenerativeLoader duration={1500} messages={["Awakening the core...", "Architecting the sanctuary..."]} />;
}
