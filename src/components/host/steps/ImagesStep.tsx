import Image from 'next/image';
import { CloudUpload, X, Image as ImageIcon } from 'lucide-react';
import React from 'react';

interface ImagesStepProps {
    images: Array<{ url: string; selected: boolean; file?: File }>;
    setImages: (images: any[]) => void;
}

const ImagesStep: React.FC<ImagesStepProps> = ({ images, setImages }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageClick = (index: number) => {
        setImages(images.map((img, i) => ({ ...img, selected: i === index })));
    };

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        // If we removed the selected image, select the first one if available
        if (images[index].selected && newImages.length > 0) {
            newImages[0].selected = true;
        }
        setImages(newImages);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFilesArray = Array.from(files).map(file => ({
            url: URL.createObjectURL(file),
            selected: false,
            file
        }));

        const updatedImages = [...images, ...newFilesArray];

        // If no image was selected before, select the first one of the new batch
        if (!updatedImages.some(img => img.selected)) {
            updatedImages[0].selected = true;
        }

        setImages(updatedImages);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/30 backdrop-blur-md border-2 border-dashed border-white/40 rounded-[32px] p-12 text-center group hover:border-[var(--c-blue-azure)] transition-all cursor-pointer"
            >
                <div className="w-16 h-16 bg-white/50 rounded-full mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-[var(--c-blue-azure)]">
                    <CloudUpload className="w-8 h-8" />
                </div>
                <div className="font-serif text-xl text-[var(--t-primary)] mb-2">Upload Architectural Photos</div>
                <p className="font-sans text-xs text-[var(--t-secondary)] uppercase tracking-wider opacity-60">High-resolution JPG or PNG (Max 10MB)</p>
            </div>

            {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`relative aspect-square rounded-[24px] overflow-hidden cursor-pointer border-2 transition-all ${img.selected ? 'border-[var(--c-blue-azure)]' : 'border-transparent'
                                }`}
                        >
                            <Image src={img.url} alt="Listing" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {img.selected && (
                                <div className="absolute bottom-3 left-3 bg-[var(--c-blue-azure)] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                                    <ImageIcon className="w-2.5 h-2.5" /> Main Cover
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center py-10 opacity-30">
                    <p className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--t-secondary)]">No photos uploaded yet</p>
                </div>
            )}
        </div>
    );
};

export default ImagesStep;
