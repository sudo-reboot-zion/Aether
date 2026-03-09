"use client";
import React from 'react';
import { useListingWizard } from '@/hooks/useListingWizard';
import WizardProgress from './WizardProgress';
import WizardStepRenderer from './WizardStepRenderer';
import WizardNavigation from './WizardNavigation';
import ListingPreview from './ListingPreview';

const STEPS = ['Details', 'Images', 'Amenities', 'Pricing', 'Blockchain', 'Review'];

const ListingWizard = () => {
  const {
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
    handleDeploy,
  } = useListingWizard();

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      handleDeploy();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-16 items-start">
      <div className="space-y-12">
        <WizardProgress currentStep={currentStep} steps={STEPS} />

        <div className="min-h-[400px]">
          <WizardStepRenderer
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            images={images}
            setImages={setImages}
            amenities={amenities}
            setAmenities={setAmenities}
            pricing={pricing}
            setPricing={setPricing}
            blockchain={blockchain}
            setBlockchain={setBlockchain}
          />
        </div>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          isDeploying={isDeploying}
          draftStatus={draftStatus}
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
        />
      </div>

      <ListingPreview
        formData={formData}
        selectedImage={images.find(img => img.selected)?.url || ''}
        activeAmenities={amenities.filter(a => a.active)}
        nightlyPrice={pricing.nightlyPrice}
      />
    </div>
  );
};

export default ListingWizard;
