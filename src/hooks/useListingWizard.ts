import { useState, useEffect } from 'react';
import {
  FormData,
  ImageData,
  AmenityData,
  PricingData,
  BlockchainData,
} from '@/types/wizard.types';
import { WIZARD_DEFAULTS } from '@/constants/wizard';
import { useDraftManager } from './useDraftManager';
import { useListingDeploy } from './useListingDeploy';

export const useListingWizard = () => {
  const { draftStatus, saveDraft, loadDraft } = useDraftManager();
  const { handleDeploy, isDeploying } = useListingDeploy();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(WIZARD_DEFAULTS.FORM_DATA);
  const [images, setImages] = useState<ImageData[]>([]);
  const [amenities, setAmenities] = useState<AmenityData[]>(
    WIZARD_DEFAULTS.AMENITIES.map(a => ({ ...a, active: false }))
  );
  const [pricing, setPricing] = useState<PricingData>(WIZARD_DEFAULTS.PRICING);
  const [blockchain, setBlockchain] = useState<BlockchainData>(WIZARD_DEFAULTS.BLOCKCHAIN);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      if (draft.formData) setFormData(draft.formData);
      if (draft.pricing) setPricing(draft.pricing);
      if (draft.amenities) setAmenities(draft.amenities);
      if (draft.currentStep !== undefined) setCurrentStep(draft.currentStep);
      console.log('Restored draft from session storage');
    }
  }, []);

  const handleSaveDraft = () => {
    saveDraft(formData, pricing, amenities, currentStep);
  };

  const handleDeployClick = async () => {
    await handleDeploy(formData, images, amenities, pricing);
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
    isDeploying,
    handleSaveDraft,
    handleDeploy: handleDeployClick,
  };
};

