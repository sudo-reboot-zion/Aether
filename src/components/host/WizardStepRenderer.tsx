"use client";
import React from 'react';
import DetailsStep from './steps/DetailsStep';
import ImagesStep from './steps/ImagesStep';
import AmenitiesStep from './steps/AmenitiesStep';
import PricingStep from './steps/PricingStep';
import BlockchainStep from './steps/BlockchainStep';
import ReviewStep from './steps/ReviewStep';
import {
  FormData,
  ImageData,
  AmenityData,
  PricingData,
  BlockchainData,
} from '@/types/wizard.types';

interface WizardStepRendererProps {
  currentStep: number;
  formData: FormData;
  setFormData: (data: FormData) => void;
  images: ImageData[];
  setImages: (images: ImageData[]) => void;
  amenities: AmenityData[];
  setAmenities: (amenities: AmenityData[]) => void;
  pricing: PricingData;
  setPricing: (pricing: PricingData) => void;
  blockchain: BlockchainData;
  setBlockchain: (blockchain: BlockchainData) => void;
}

const WizardStepRenderer: React.FC<WizardStepRendererProps> = ({
  currentStep,
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
}) => {
  switch (currentStep) {
    case 0:
      return <DetailsStep formData={formData} setFormData={setFormData} />;
    case 1:
      return <ImagesStep images={images} setImages={setImages} />;
    case 2:
      return <AmenitiesStep amenities={amenities} setAmenities={setAmenities} />;
    case 3:
      return <PricingStep pricing={pricing} setPricing={setPricing} />;
    case 4:
      return <BlockchainStep blockchain={blockchain} setBlockchain={setBlockchain} />;
    case 5:
      return <ReviewStep formData={formData} pricing={pricing} />;
    default:
      return null;
  }
};

export default WizardStepRenderer;
