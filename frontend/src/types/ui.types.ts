import React from 'react';

export interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
    variant?: SkeletonVariant;
    className?: string;
}

export interface EmptyStateAction {
    label: string;
    onClick: () => void;
}

export interface EmptyStateProps {
    title: string;
    description: string;
    action?: EmptyStateAction;
}

export interface NavLinkProps {
    href: string;
    label: string;
    active?: boolean;
}

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}
