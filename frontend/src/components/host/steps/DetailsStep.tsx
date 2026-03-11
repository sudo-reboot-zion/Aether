'use client';
import { LOCATIONS } from '@/constants/locations';
import { VIBES } from '@/constants/vibes';
import { Home, Sparkles, MapPin, AlignLeft, ChevronDown } from 'lucide-react';

interface DetailsStepProps {
    formData: {
        propertyName: string;
        type: string;
        location: string;
        categoryTag: number;
        description: string;
    };
    setFormData: (data: any) => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ formData, setFormData }) => {
    const inputClasses = "w-full px-6 py-4 rounded-[20px] border border-white/20 bg-white/40 backdrop-blur-md font-sans text-sm text-[var(--t-primary)] focus:outline-none focus:border-[var(--c-blue-azure)]/50 transition-all placeholder:text-[var(--t-secondary)]/40";
    const labelClasses = "block font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--t-secondary)] mb-2 font-bold opacity-70";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses + " flex items-center gap-2"}>
                        <Home className="w-3 h-3" /> Property Name
                    </label>
                    <input
                        type="text"
                        value={formData.propertyName}
                        onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                        placeholder="e.g. The Azure Sanctuary"
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label className={labelClasses + " flex items-center gap-2"}>
                        <Sparkles className="w-3 h-3" /> Property Vibe (On-Chain Category)
                    </label>
                    <div className="relative">
                        <select
                            value={formData.categoryTag}
                            onChange={(e) => setFormData({ ...formData, categoryTag: parseInt(e.target.value) })}
                            className={`${inputClasses} appearance-none cursor-pointer pr-12`}
                        >
                            <option value={0} disabled>Select Architectural Vibe</option>
                            {VIBES.map(vibe => (
                                <option key={vibe.id} value={vibe.id}>{vibe.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses + " flex items-center gap-2"}>
                    <MapPin className="w-3 h-3" /> Location
                </label>
                <div className="relative">
                    <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className={`${inputClasses} appearance-none cursor-pointer pr-12`}
                    >
                        <option value="" disabled>Select Location</option>
                        {LOCATIONS.map(loc => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses + " flex items-center gap-2"}>
                    <AlignLeft className="w-3 h-3" /> Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the architectural story and soul of your property..."
                    rows={5}
                    className={`${inputClasses} resize-none`}
                />
            </div>
        </div >
    );
};

export default DetailsStep;
