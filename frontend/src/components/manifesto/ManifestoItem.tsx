import React from 'react';

interface ManifestoItemProps {
    number: string;
    title: string;
    description: string;
}

const ManifestoItem: React.FC<ManifestoItemProps> = ({ number, title, description }) => {
    return (
        <>
            <div className="space-y-6">
                <span className="text-4xl opacity-30 italic font-serif text-[var(--t-primary)] block">
                    {number}
                </span>
                <h2 className="text-4xl font-normal leading-tight font-serif text-[var(--t-primary)]">
                    {title}
                </h2>
            </div>
            <div className="flex flex-col justify-center">
                <p className="font-light text-lg leading-relaxed text-[var(--t-secondary)] font-sans">
                    {description}
                </p>
            </div>
        </>
    );
};

export default ManifestoItem;
