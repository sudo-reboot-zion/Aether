import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';


const ManifestoHero: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full text-center mb-32">
            <h1
                className="font-light italic leading-tight text-[var(--t-primary)] font-serif"
                style={{
                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                    lineHeight: 1.15,
                }}
            >
                {t('manifesto.hero.title1')}<br />
                {t('manifesto.hero.title2')}
            </h1>
        </div>
    );
};


export default ManifestoHero;
