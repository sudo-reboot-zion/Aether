import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface VibeCardProps {
    image: string;
    title: string;
    href?: string;
}

const VibeCard: React.FC<VibeCardProps> = ({ image, title, href = "#" }) => {
    return (
        <Link href={href} className="group relative h-64 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--c-white-glass)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.4)] block">
            <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-blue-deep)]/60 to-transparent"></div>
            <div className="absolute bottom-6 left-0 w-full text-center">
                <span className="text-white font-serif text-2xl tracking-wide">{title}</span>
            </div>
        </Link>
    );
};

export default VibeCard;
