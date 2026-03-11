'use client';
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface Amenity {
    icon: string; // Now refers to a Lucide icon name
    label: string;
    active: boolean;
}

interface AmenitiesStepProps {
    amenities: Amenity[];
    setAmenities: (amenities: Amenity[]) => void;
}

const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ amenities, setAmenities }) => {
    const toggleAmenity = (index: number) => {
        const newAmenities = amenities.map((amenity, i) =>
            i === index ? { ...amenity, active: !amenity.active } : amenity
        );
        setAmenities(newAmenities);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[var(--t-secondary)] mb-6 font-bold opacity-60">Luxury Features & Amenities</label>
            <div className="flex flex-wrap gap-4">
                {amenities.map((amenity, index) => {
                    const IconComponent = (LucideIcons as any)[amenity.icon] || LucideIcons.HelpCircle;

                    return (
                        <button
                            key={index}
                            onClick={() => toggleAmenity(index)}
                            className={`px-8 py-5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-3 border ${amenity.active
                                ? 'bg-[var(--c-blue-deep)] text-white border-transparent shadow-xl -translate-y-1'
                                : 'bg-white/40 text-[var(--t-primary)] border-white/40 hover:bg-white/60'
                                }`}
                        >
                            <IconComponent size={18} strokeWidth={2} />
                            {amenity.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AmenitiesStep;
