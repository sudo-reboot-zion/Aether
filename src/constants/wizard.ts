import { FormData, AmenityData, PricingData, BlockchainData } from '@/types/wizard.types';
import { APP_CONFIG } from '@/lib/config';

export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Cottage',
  'Penthouse',
  'Townhouse',
  'Studio',
] as const;

export const WIZARD_AMENITIES: AmenityData[] = [
  { label: 'WiFi', icon: 'Wifi', active: false },
  { label: 'Pool', icon: 'Droplet', active: false },
  { label: 'Kitchen', icon: 'UtensilsCrossed', active: false },
  { label: 'Parking', icon: 'Car', active: false },
  { label: 'Gym', icon: 'Dumbbell', active: false },
  { label: 'Laundry', icon: 'Shirt', active: false },
  { label: 'TV', icon: 'Tv', active: false },
  { label: 'Air Conditioning', icon: 'Wind', active: false },
];

export const WIZARD_DEFAULTS = {
  TYPES: PROPERTY_TYPES,
  AMENITIES: WIZARD_AMENITIES,
  FORM_DATA: {
    propertyName: '',
    type: PROPERTY_TYPES[0] as string,
    location: '',
    categoryTag: 0,
    description: '',
  } as FormData,
  PRICING: {
    nightlyPrice: '',
    securityDeposit: '',
    smartPricing: true,
  } as PricingData,
  BLOCKCHAIN: {
    escrow: `Standard Aether Escrow (${APP_CONFIG.PLATFORM_FEE_PERCENT}% fee)`,
  } as BlockchainData,
} as const;

export const WIZARD_STEP_NAMES = [
  'Details',
  'Images',
  'Amenities',
  'Pricing',
  'Blockchain',
  'Review',
] as const;
