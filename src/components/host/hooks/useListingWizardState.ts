import { useState, useEffect } from 'react';
import {
  FormData,
  ImageData,
  AmenityData,
  PricingData,
  BlockchainData,
  DraftStatus,
  ListingDraft,
} from '@/types/wizard.types';
import { WIZARD_DEFAULTS } from '@/constants/wizard';

const DRAFT_STORAGE_KEY = 'aether_listing_draft';

export const useListingWizardState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(WIZARD_DEFAULTS.FORM_DATA);
  const [images, setImages] = useState<ImageData[]>([]);
  const [amenities, setAmenities] = useState<AmenityData[]>(
    WIZARD_DEFAULTS.AMENITIES.map((a) => ({ ...a, active: false }))
  );
  const [pricing, setPricing] = useState<PricingData>(WIZARD_DEFAULTS.PRICING);
  const [blockchain, setBlockchain] = useState<BlockchainData>(
    WIZARD_DEFAULTS.BLOCKCHAIN
  );
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle');

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const data: ListingDraft = JSON.parse(savedDraft);
        if (data.formData) setFormData(data.formData);
        if (data.pricing) setPricing(data.pricing);
        if (data.amenities) setAmenities(data.amenities);
        if (data.currentStep !== undefined) setCurrentStep(data.currentStep);
        console.log('Restored draft from session storage');
      } catch (e) {
        console.error('Failed to parse draft:', e);
      }
    }
  }, []);

  const saveDraft = () => {
    setDraftStatus('saving');
    const draft: ListingDraft = {
      formData,
      pricing,
      amenities,
      currentStep,
      timestamp: Date.now(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setTimeout(() => setDraftStatus('saved'), 600);
    setTimeout(() => setDraftStatus('idle'), 3000);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    images,
    setImages,
    amenities,
    setAmenities,
    pricing,
    setPricing,
    blockchain,
    setBlockchain,
    draftStatus,
    setDraftStatus,
    saveDraft,
    clearDraft,
  };
};
