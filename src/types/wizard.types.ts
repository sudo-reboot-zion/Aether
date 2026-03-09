export interface FormData {
  propertyName: string;
  type: string;
  location: string;
  categoryTag: number;
  description: string;
}

export interface ImageData {
  url: string;
  selected: boolean;
  file?: File;
}

export interface AmenityData {
  label: string;
  icon: string;
  active: boolean;
}

export interface PricingData {
  nightlyPrice: string;
  securityDeposit: string;
  smartPricing: boolean;
}

export interface BlockchainData {
  escrow: string;
}

export interface PropertyMetadata {
  title: string;
  description: string;
  type: string;
  location: string;
  categoryTag: number;
  amenities: string[];
  images: string[];
  pricing: PricingData;
  hostName: string;
}

export type DraftStatus = 'idle' | 'saving' | 'saved';

export interface ListingDraft {
  formData: FormData;
  pricing: PricingData;
  amenities: AmenityData[];
  currentStep: number;
  timestamp: number;
}

export enum WizardStep {
  Details = 0,
  Images = 1,
  Amenities = 2,
  Pricing = 3,
  Blockchain = 4,
  Review = 5,
}
