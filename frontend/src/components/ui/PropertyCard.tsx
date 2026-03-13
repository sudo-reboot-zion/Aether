"use client";
import React, { useEffect, useState } from 'react';
import { encodePropertyId } from '@/lib/urls';
import { fetchIPFSMetadata, PropertyMetadata } from '@/lib/ipfs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { addFavorite } from '@/redux/slices/favoritesSlice';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import GridCard from './PropertyCard/GridCard';
import ListCard from './PropertyCard/ListCard';

interface PropertyCardProps {
    id?: string | number;
    metadataUri?: string;
    image?: string;
    title?: string;
    location?: string;
    rating?: string | number;
    badge?: string;
    badgePosition?: 'top' | 'bottom';
    price?: string | number;
    usdPrice?: string;
    guests?: string;
    feature?: string;
    architect?: string;
    layout?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = (props) => {
    const { id, metadataUri, image, title, location, rating = "Verified", layout = 'grid' } = props;
    const dispatch = useDispatch();
    const { userData } = useAuth();
    const { saveProperty } = useProfile();
    const [metadata, setMetadata] = useState<PropertyMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(!!metadataUri);
    const savedIds = useSelector((state: RootState) => state.favorites.savedIds);

    const isSaved = id !== undefined && savedIds.includes(Number(id));

    useEffect(() => {
        const load = async () => {
            if (metadataUri) {
                const data = await fetchIPFSMetadata(metadataUri);
                if (data) setMetadata(data);
                setIsLoading(false);
            }
        };
        load();
    }, [metadataUri]);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userData) return;
        if (id !== undefined) {
            await saveProperty(Number(id));
            dispatch(addFavorite(Number(id)));
        }
    };

    const displayTitle = metadata?.title || title || 'Enigma Sanctuary';
    const displayLocation = metadata?.location || location || 'Undisclosed Location';
    const validImages = metadata?.images?.filter(
        (url) => url && !url.startsWith('blob:') && !url.startsWith('data:')
    ) || [];
    const rawImage = validImages[0] || image || '';
    const displayImage = rawImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070';
    const displayPrice = props.price !== undefined ? (typeof props.price === 'string' ? parseFloat(props.price) : props.price) : 0;

    const commonProps = {
        ...props,
        displayImage,
        displayTitle,
        displayLocation,
        displayPrice,
        isLoading,
        rating,
        isSaved,
        handleSave,
        encodePropertyId
    };

    return layout === 'grid' ? <GridCard {...commonProps} /> : <ListCard {...commonProps} />;
};

export default PropertyCard;
