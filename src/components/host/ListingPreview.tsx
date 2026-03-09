'use client';
import React from 'react';
import Image from 'next/image';
import GlassPanel from '../ui/GlassPanel';
import * as LucideIcons from 'lucide-react';
import { VIBES } from '@/constants/vibes';

interface ListingPreviewProps {
    formData: any;
    selectedImage: string;
    activeAmenities: any[];
    nightlyPrice: string;
}

const ListingPreview: React.FC<ListingPreviewProps> = ({ formData, selectedImage, activeAmenities, nightlyPrice }) => {
    return (
        <div className="sticky top-32 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--t-secondary)] font-bold opacity-60">Live Preview</h3>
            </div>

            <GlassPanel className="p-4 overflow-hidden border-white/60 shadow-2xl bg-white/50 backdrop-blur-2xl">
                <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden mb-6 group">
                    {selectedImage ? (
                        <Image src={selectedImage} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                        <div className="w-full h-full bg-[var(--c-blue-haze)]/10 flex flex-col items-center justify-center gap-4 text-[var(--t-secondary)] text-sm border-2 border-dashed border-white/40">
                            <div className="w-16 h-16 rounded-full bg-white/40 flex items-center justify-center opacity-40">
                                <LucideIcons.Image size={32} strokeWidth={1} />
                            </div>
                            <span className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">No Visualization Available</span>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-sans font-bold text-[var(--t-primary)] uppercase tracking-widest shadow-lg">
                            {formData.type || 'Property'}
                        </div>
                        {formData.categoryTag > 0 && (
                            <div className="bg-[var(--c-blue-azure)]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-sans font-bold text-white uppercase tracking-widest shadow-lg">
                                {VIBES.find(v => v.id === formData.categoryTag)?.name}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-2 space-y-4">
                    <div className="flex justify-between items-start">
                        <h4 className="font-serif text-2xl text-[var(--t-primary)] leading-tight">{formData.propertyName || 'Property Name'}</h4>
                        <div className="text-right">
                            <span className="font-serif text-2xl text-[var(--t-primary)]">{nightlyPrice || '0'}</span>
                            <span className="font-sans text-[10px] text-[var(--t-secondary)] block opacity-60 font-bold uppercase tracking-wider">STX / Night</span>
                        </div>
                    </div>

                    <p className="font-sans text-xs text-[var(--t-secondary)] opacity-80 line-clamp-2 leading-relaxed h-8">
                        {formData.description || 'Description will appear here...'}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/40">
                        {activeAmenities.slice(0, 3).map((a, i) => {
                            const IconComponent = (LucideIcons as any)[a.icon] || LucideIcons.HelpCircle;
                            return (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-white/40 border border-white/60 font-sans text-[10px] font-bold text-[var(--t-primary)] uppercase tracking-wider flex items-center gap-1.5">
                                    <IconComponent size={12} strokeWidth={2.5} /> {a.label}
                                </span>
                            );
                        })}
                        {activeAmenities.length > 3 && (
                            <span className="px-3 py-1.5 rounded-lg bg-[var(--c-blue-deep)] text-white text-[10px] font-bold uppercase tracking-wider">
                                +{activeAmenities.length - 3} More
                            </span>
                        )}
                        {activeAmenities.length === 0 && <span className="text-[10px] uppercase font-bold text-[var(--t-secondary)] opacity-30">No Amenities Selected</span>}
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};

export default ListingPreview;
