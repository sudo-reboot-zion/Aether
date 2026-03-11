"use client";
import React, { useState } from 'react';
import SafeImage from '../ui/SafeImage';

interface GalleryProps {
    images?: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
    const [isHovering, setIsHovering] = useState<{ [key: string]: boolean }>({});

    const displayImages = images.length > 0
        ? images.map((src, i) => ({
            src,
            // Main image spans 2 cols, others span 1. If we have > 3 images, let them wrap naturally
            span: i === 0 ? 2 : 1
        }))
        : [
            { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', span: 2 },
            { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80', span: 1 },
            { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', span: 1 }
        ];

    return (
        <div className="grid grid-cols-4 auto-rows-[400px] gap-4 mb-8">
            {displayImages.map((item, idx) => (
                <div
                    key={idx}
                    className={`
            ${item.span > 1 ? `col-span-${item.span}` : 'col-span-1'}
            rounded-[var(--radius-lg)] overflow-hidden relative cursor-pointer
          `}
                    onMouseEnter={() => setIsHovering({ ...isHovering, [`gallery-${idx}`]: true })}
                    onMouseLeave={() => setIsHovering({ ...isHovering, [`gallery-${idx}`]: false })}
                >
                    <SafeImage
                        src={item.src}
                        alt={`Property view ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`
              object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isHovering[`gallery-${idx}`] ? 'scale-105' : 'scale-100'}
            `}
                    />
                </div>
            ))}
        </div>
    );
};

export default Gallery;
