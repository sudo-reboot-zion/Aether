import { useState } from 'react';
import { FormData, AmenityData, PricingData } from '@/types/wizard.types';

export const useDraftManager = () => {
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const saveDraft = (
    formData: FormData,
    pricing: PricingData,
    amenities: AmenityData[],
    currentStep: number
  ) => {
    setDraftStatus('saving');
    const draft = {
      formData,
      pricing,
      amenities,
      currentStep,
      timestamp: Date.now()
    };
    localStorage.setItem('aether_listing_draft', JSON.stringify(draft));
    setTimeout(() => setDraftStatus('saved'), 600);
    setTimeout(() => setDraftStatus('idle'), 3000);
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('aether_listing_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error('Failed to parse draft:', e);
        return null;
      }
    }
    return null;
  };

  return { draftStatus, saveDraft, loadDraft };
};
