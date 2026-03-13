"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';
import { useTranslation } from '@/hooks/useTranslation';


const InquireCTA: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [clicked, setClicked] = useState(false);


    const handleClick = () => {
        setClicked(true);
        // Short delay to show the "Welcome" feedback before navigating
        setTimeout(() => {
            router.push('/collection');
        }, 800);
    };

    return (
        <GlassPanel
            className="w-full max-w-2xl text-center p-16 mb-20 relative overflow-hidden rounded-[40px]"
        >
            <div
                className="absolute top-0 left-0 w-full h-[1px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(61, 124, 184, 0.3), transparent)',
                }}
            />
            <h3 className="font-light mb-8 italic text-3xl text-[var(--t-primary)] font-serif">
                {t('manifesto.cta.title')}
            </h3>

            <Button
                onClick={handleClick}
                className="px-12 py-5 text-sm"
            >
                {clicked ? t('manifesto.cta.welcome') : t('manifesto.cta.button')}
            </Button>
        </GlassPanel>
    );
};

export default InquireCTA;
