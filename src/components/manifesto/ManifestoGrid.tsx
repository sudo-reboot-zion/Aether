import React from 'react';
import ManifestoItem from './ManifestoItem';

import { useTranslation } from '@/hooks/useTranslation';

const ManifestoGrid: React.FC = () => {
    const { t } = useTranslation();

    const items = [
        { number: '01', key: 'one' },
        { number: '02', key: 'two' },
        { number: '03', key: 'three' },
        { number: '04', key: 'four' },
    ];

    return (
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32 mb-40">
            {items.map((item) => (
                <ManifestoItem
                    key={item.number}
                    number={item.number}
                    title={t(`manifesto.items.${item.key}.title`)}
                    description={t(`manifesto.items.${item.key}.desc`)}
                />
            ))}
        </div>
    );
};


export default ManifestoGrid;
