"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Gallery from '../../components/details/Gallery';
import PropertyInfo from '../../components/details/PropertyInfo';
import BookingSidebar from '../../components/details/BookingSidebar';
import EmptyState from '../../components/ui/EmptyState';
import { useProperties } from '@/hooks/useProperties';
import { fetchIPFSMetadata, PropertyMetadata, getIPFSUrl } from '@/lib/ipfs';
import { useTranslation } from '@/hooks/useTranslation';

export default function DetailsPage() {
    const { t } = useTranslation();
    const { properties, fetchProperties, isLoading: isPropertiesLoading } = useProperties();
    const [metadata, setMetadata] = useState<PropertyMetadata | null>(null);
    const [isMetadataLoading, setIsMetadataLoading] = useState(true);

    // Fallback to the first property in the list if we're on the generic details page
    const property = useMemo(() => properties.find(p => p.active) || properties[0], [properties]);
    const propertyId = property?.id ?? 0;

    useEffect(() => {
        if (properties.length === 0) {
            fetchProperties();
        }
    }, [fetchProperties, properties.length]);

    useEffect(() => {
        const loadMetadata = async () => {
            if (property?.metadataUri) {
                setIsMetadataLoading(true);
                try {
                    const data = await fetchIPFSMetadata(property.metadataUri);
                    setMetadata(data);
                } catch (error) {
                    console.error("Error loading property metadata:", error);
                } finally {
                    setIsMetadataLoading(false);
                }
            } else if (!isPropertiesLoading && !property) {
                setIsMetadataLoading(false);
            }
        };
        loadMetadata();
    }, [property, isPropertiesLoading]);

    if ((isPropertiesLoading || isMetadataLoading) && !metadata) {
        return (
            <main className="min-h-screen">
                <Navbar />
                <div className="max-w-[1280px] mx-auto px-8 pt-48 pb-12 text-center">
                    <div className="font-serif text-2xl animate-pulse text-[var(--t-secondary)]">{t('details.seeking')}</div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!property && !isPropertiesLoading) {
        return (
            <main className="min-h-screen">
                <Navbar />
                <div className="max-w-[1280px] mx-auto px-8 pt-48 pb-12">
                    <EmptyState
                        title={t('details.notFound')}
                        description="The sanctuary you are seeking does not exist or has been hidden from the aether. Return to our collection to find another place of peace."
                        action={{
                            label: t('details.return'),
                            onClick: () => { window.location.href = '/collection' }
                        }}
                    />
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-[1280px] mx-auto px-8 pt-32 pb-12">
                <div className="mb-8">
                    <h1 className="text-5xl font-normal leading-tight mb-2 text-[var(--t-primary)]">
                        {metadata?.title || 'The Azure Sanctuary'}
                    </h1>
                    <p className="font-sans text-lg text-[var(--t-secondary)] opacity-80">
                        {metadata?.location ? t(`location.${metadata.location.toLowerCase()}`) : t('location.tokyo, japan')} • {metadata?.hostName ? `${t('details.designedBy')} ${metadata.hostName}` : t('details.listedOn')}
                    </p>
                </div>

                <Gallery images={metadata?.images
                    ?.filter(url => url && !url.startsWith('blob:') && !url.startsWith('data:'))
                    || ['/images/hero-interior.jpg', '/images/gallery-2.jpg', '/images/gallery-3.jpg']} />

                <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 items-start mt-12">
                    <PropertyInfo
                        description={metadata?.description || "Beautiful things don't ask for attention. This sanctuary embodies silence and light, featuring raw concrete textures softened by warm timber. The space is designed to capture the shifting gradients of the sky from dawn until dusk."}
                        amenities={metadata?.amenities || ['Wifi', 'Kitchen', 'AC', 'Pool']}
                        hostAddress={property?.owner || "ST1234567890ABCDEF"}
                        hostName={metadata?.hostName}
                        locationId={property?.locationTag}
                    />
                    <BookingSidebar
                        propertyId={propertyId}
                        pricePerNight={property?.pricePerNight || 1350000}
                        hostAddress={property?.owner || "ST1234567890ABCDEF"}
                        maxGuests={metadata?.maxGuests}
                    />
                </div>
            </div>

            <Footer />
        </main>
    );
}
