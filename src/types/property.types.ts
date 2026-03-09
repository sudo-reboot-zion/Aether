export interface PropertyMetadata {
    title?: string;
    description?: string;
    location?: string;
    pricePerNight?: number;
    images?: string[];
    /** @deprecated Use `images` array instead */
    image?: string;
    amenities?: string[];
    vibes?: string[];
    bedrooms?: number;
    bathrooms?: number;
    maxGuests?: number;
    locationTag?: number;
    categoryTag?: number;
}

export interface Property {
    id: number;
    owner: string;
    pricePerNight: number;
    locationTag: number;
    categoryTag: number;
    metadataUri: string;
    active: boolean;
    createdAt: number;
    metadata?: PropertyMetadata;
}

export interface ListingPreviewProps {
    title: string;
    description: string;
    images: string[];
    pricePerNight: number;
    location: string;
    amenities: string[];
    vibes: string[];
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
}

export interface PropertyCardProps {
    id: number;
    title: string;
    location: string;
    pricePerNight: number;
    images: string[];
    active: boolean;
}

export interface GalleryProps {
    images: string[];
    title?: string;
}

export interface PropertyInfoProps {
    title: string;
    description: string;
    amenities: string[];
    vibes: string[];
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    location: string;
    owner: string;
}

export interface FilterBarProps {
    onFilter: (filters: PropertyFilters) => void;
    className?: string;
}

export interface PropertyFilters {
    location?: number;
    category?: number;
    maxPrice?: number;
    vibes?: string[];
}

export interface VibeCardProps {
    slug: string;
    label: string;
    icon?: string;
    selected?: boolean;
    onSelect?: (slug: string) => void;
}
