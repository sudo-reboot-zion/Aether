"use client";
import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'rectangle' | 'circle' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    width,
    height,
    variant = 'rectangle'
}) => {
    const style: React.CSSProperties = {
        width: width,
        height: height
    };

    const variantClasses = {
        rectangle: 'rounded-xl',
        circle: 'rounded-full',
        text: 'rounded-md h-[1em]'
    };

    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-neutral-200/50 via-neutral-100/40 to-neutral-200/50 ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
