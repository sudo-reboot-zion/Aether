"use client";
import React, { useState } from 'react';
import { Clock, Wind, ThumbsUp, Wifi, Target, Sparkles, Shield, Zap, Coffee, X, Check } from 'lucide-react';

const VIBES = [
    { id: 2, name: 'High Altitude', icon: Wind },
    { id: 5, name: 'Deep Silence', icon: Target },
    { id: 6, name: 'Ultra Clean', icon: Sparkles },
    { id: 3, name: 'Top Verified', icon: ThumbsUp },
];

const AMENITIES = [
    { id: 1, name: 'Early Check-in', icon: Clock },
    { id: 4, name: 'Gigabit Fiber', icon: Wifi },
    { id: 7, name: 'Secure Access', icon: Shield },
    { id: 8, name: 'Fast Response', icon: Zap },
    { id: 9, name: 'Premium Coffee', icon: Coffee },
];

interface ProtocolSelectorProps {
    initialVibes?: number[];
    initialAmenities?: number[];
    onSave: (vibes: number[], amenities: number[]) => void;
    onClose: () => void;
    isSaving?: boolean;
}

const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
    initialVibes = [],
    initialAmenities = [],
    onSave,
    onClose,
    isSaving = false
}) => {
    const [selectedVibes, setSelectedVibes] = useState<number[]>(initialVibes);
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>(initialAmenities);

    const toggleVibe = (id: number) => {
        setSelectedVibes(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id].slice(0, 10)
        );
    };

    const toggleAmenity = (id: number) => {
        setSelectedAmenities(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id].slice(0, 10)
        );
    };

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-black/5 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-serif text-[var(--t-primary)] font-semibold">Configure Protocol</h3>
                    <p className="text-sm text-[var(--t-secondary)] font-sans">Select your on-chain travel signatures</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <X className="w-5 h-5 text-[var(--t-secondary)]" />
                </button>
            </div>

            <div className="space-y-8">
                {/* Vibes Section */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-4 px-1">Sanctuary Vibes</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {VIBES.map(vibe => {
                            const Icon = vibe.icon;
                            const isSelected = selectedVibes.includes(vibe.id);
                            return (
                                <button
                                    key={vibe.id}
                                    onClick={() => toggleVibe(vibe.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 text-left
                                        ${isSelected
                                            ? 'bg-[var(--c-blue-azure)] border-[var(--c-blue-azure)] text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/50 border-black/5 text-[var(--t-primary)] hover:border-black/20'}`}
                                >
                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[var(--c-blue-azure)]'}`} />
                                    <span className="text-sm font-medium font-sans">{vibe.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Amenities Section */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-4 px-1">Essential Amenities</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {AMENITIES.map(amenity => {
                            const Icon = amenity.icon;
                            const isSelected = selectedAmenities.includes(amenity.id);
                            return (
                                <button
                                    key={amenity.id}
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 text-left
                                        ${isSelected
                                            ? 'bg-[var(--c-blue-azure)] border-[var(--c-blue-azure)] text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/50 border-black/5 text-[var(--t-primary)] hover:border-black/20'}`}
                                >
                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[var(--c-blue-azure)]'}`} />
                                    <span className="text-sm font-medium font-sans">{amenity.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-6 border-t border-black/5 flex gap-4">
                <button
                    onClick={() => onSave(selectedVibes, selectedAmenities)}
                    disabled={isSaving}
                    className="flex-1 bg-[var(--t-primary)] text-white py-4 rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <span className="animate-pulse">Committing to Blockchain...</span>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Commit Protocol
                        </>
                    )}
                </button>
                <button
                    onClick={onClose}
                    className="px-8 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] bg-white border border-black/5 text-[var(--t-primary)] hover:bg-black/5 transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ProtocolSelector;
