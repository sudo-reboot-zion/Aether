"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Save, X } from 'lucide-react';
import DetailsStep from './steps/DetailsStep';
import ImagesStep from './steps/ImagesStep';
import AmenitiesStep from './steps/AmenitiesStep';
import PricingStep from './steps/PricingStep';
import BlockchainStep from './steps/BlockchainStep';
import ReviewStep from './steps/ReviewStep';
import ListingPreview from './ListingPreview';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { uploadToIPFS, uploadFileToIPFS } from '@/lib/ipfs';
import { getLocationId } from '@/constants/locations';
import { useRouter } from 'next/navigation';
import { GenerativeLoader } from '@/components/ui/GenerativeLoader';

import { APP_CONFIG } from '@/lib/config';
import { WIZARD_DEFAULTS } from '@/constants/wizard';

const ListingWizard = () => {
    const router = useRouter();
    const { userData, connectWallet } = useAuth();
    const stxAddress = userData?.profile?.stxAddress?.testnet;
    const { listProperty } = useProperties();
    const [isDeploying, setIsDeploying] = useState(false);

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({ propertyName: '', type: WIZARD_DEFAULTS.TYPES[0], location: '', categoryTag: 0, description: '' });
    const [images, setImages] = useState<Array<{ url: string; selected: boolean; file?: File }>>([]);
    const [amenities, setAmenities] = useState(WIZARD_DEFAULTS.AMENITIES.map(a => ({ ...a, active: false })));
    const [pricing, setPricing] = useState({ nightlyPrice: '', securityDeposit: '', smartPricing: true });
    const [blockchain, setBlockchain] = useState({ escrow: `Standard Aether Escrow (${APP_CONFIG.PLATFORM_FEE_PERCENT}% fee)` });
    const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // 1. Check for drafts on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('aether_listing_draft');
        if (savedDraft) {
            try {
                const data = JSON.parse(savedDraft);
                if (data.formData) setFormData(data.formData);
                if (data.pricing) setPricing(data.pricing);
                if (data.amenities) setAmenities(data.amenities);
                // Note: Images are blob URLs and won't persist across sessions if they were local files.
                // We only restore the data structure, but warn the user in the UI if needed.
                if (data.currentStep !== undefined) setCurrentStep(data.currentStep);
                console.log('Restored draft from session storage');
            } catch (e) {
                console.error('Failed to parse draft:', e);
            }
        }
    }, []);

    const handleSaveDraft = () => {
        setDraftStatus('saving');
        const draft = {
            formData,
            pricing,
            amenities,
            currentStep,
            // We don't save local image blobs to localStorage (too large + expire)
            timestamp: Date.now()
        };
        localStorage.setItem('aether_listing_draft', JSON.stringify(draft));
        setTimeout(() => setDraftStatus('saved'), 600);
        setTimeout(() => setDraftStatus('idle'), 3000);
    };

    const steps = ['Details', 'Images', 'Amenities', 'Pricing', 'Blockchain', 'Review'];

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const [publishStatus, setPublishStatus] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleDeploy = async () => {
        if (!stxAddress) {
            alert('Please connect your wallet to publish this listing');
            connectWallet();
            return;
        }

        if (!formData.propertyName || !formData.location || !pricing.nightlyPrice || formData.categoryTag === 0) {
            alert('Please fill in all required fields (Name, Location, Vibe, and Price)');
            return;
        }

        setIsDeploying(true);
        setPublishStatus(["Compressing sanctuary assets...", "Sealing metadata in IPFS..."]);
        try {
            // 1. Upload images to IPFS
            const sortedImages = [
                ...images.filter(img => img.selected),
                ...images.filter(img => !img.selected)
            ];

            const imageUrls: string[] = [];

            for (const img of sortedImages) {
                if (img.file) {
                    const cid = await uploadFileToIPFS(img.file);
                    if (cid) {
                        imageUrls.push(`ipfs://${cid}`);
                    } else {
                        console.warn('Failed to upload an image to IPFS, skipping...');
                    }
                } else if (img.url.startsWith('ipfs://') || img.url.startsWith('http')) {
                    imageUrls.push(img.url);
                }
            }

            if (imageUrls.length === 0 && sortedImages.length > 0) {
                throw new Error('Failed to upload any images to IPFS');
            }

            // 2. Prepare metadata with IPFS URIs
            const metadata = {
                title: formData.propertyName,
                description: formData.description,
                type: formData.type,
                location: formData.location,
                categoryTag: formData.categoryTag,
                amenities: amenities.filter(a => a.active).map(a => a.label),
                images: imageUrls,
                pricing: pricing,
                hostName: userData?.profile?.name || 'Sanctuary Host'
            };

            setPublishStatus(["Sealing metadata in IPFS...", "Connecting to Aether Ledger...", "Broadcasting transaction..."]);
            const ipfsHash = await uploadToIPFS(metadata);
            if (!ipfsHash) {
                throw new Error('Failed to upload metadata to IPFS');
            }

            const priceInMicroSTX = Math.round(parseFloat(pricing.nightlyPrice) * 1000000);
            const locationTag = getLocationId(formData.location);

            await listProperty(
                priceInMicroSTX,
                locationTag,
                formData.categoryTag,
                `ipfs://${ipfsHash}`,
                userData.profile.stxAddress.testnet
            );

            // 3. Post-publish sync phase
            setIsSyncing(true);
            setPublishStatus(["Listing Manifested!", "Finalizing Aether sync...", "Harmonizing data layers..."]);

            // Artificial delay for premium "syncing" feel and blockchain propagation
            await new Promise(resolve => setTimeout(resolve, 3500));

            localStorage.removeItem('aether_listing_draft');
            router.push('/dashboard');
        } catch (err) {
            console.error('Deployment error:', err);
            alert('Failed to deploy listing. See console for details.');
        } finally {
            setIsDeploying(false);
            setIsSyncing(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <DetailsStep formData={formData} setFormData={setFormData} />;
            case 1: return <ImagesStep images={images} setImages={setImages} />;
            case 2: return <AmenitiesStep amenities={amenities} setAmenities={setAmenities} />;
            case 3: return <PricingStep pricing={pricing} setPricing={setPricing} />;
            case 4: return <BlockchainStep blockchain={blockchain} setBlockchain={setBlockchain} />;
            case 5: return <ReviewStep formData={formData} pricing={pricing} />;
            default: return null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-16 items-start">
            <div className="space-y-12">
                {/* Progress Indicator */}
                <div className="flex justify-between mb-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 group px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all ${currentStep >= idx
                                ? 'bg-[var(--c-blue-deep)] text-white shadow-lg'
                                : 'bg-white/40 text-[var(--t-secondary)] opacity-40 group-hover:opacity-100 group-hover:bg-white/60'
                                }`}>
                                {idx + 1}
                            </div>
                            <span className={`font-sans text-[9px] uppercase tracking-widest font-bold transition-opacity ${currentStep === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                                }`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[400px]">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-12 border-t border-white/20">
                    <div className="flex gap-6">
                        {currentStep > 0 ? (
                            <button
                                onClick={handleBack}
                                className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--t-secondary)] hover:text-[var(--t-primary)] transition-colors opacity-70 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Previous
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--t-secondary)] hover:text-[var(--t-primary)] transition-colors opacity-70 flex items-center gap-2"
                            >
                                <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                        )}
                        <button
                            onClick={handleSaveDraft}
                            className={`font-sans text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${draftStatus === 'saved' ? 'text-emerald-500' : 'text-[var(--t-secondary)] hover:text-[var(--t-primary)] opacity-70'
                                }`}
                        >
                            {draftStatus === 'saving' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : draftStatus === 'saved' ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            {draftStatus === 'saving' ? 'Saving...' : draftStatus === 'saved' ? 'Draft Saved' : 'Save Draft'}
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            if (currentStep === steps.length - 1) {
                                handleDeploy();
                            } else {
                                setCurrentStep(currentStep + 1);
                            }
                        }}
                        disabled={isDeploying}
                        className="px-12 py-5 bg-[var(--c-blue-deep)] text-white rounded-full font-sans text-xs font-bold uppercase tracking-[0.25em] shadow-xl hover:bg-[var(--c-blue-azure)] hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center gap-3"
                    >
                        {isDeploying ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : currentStep === steps.length - 1 ? (
                            <CheckCircle className="w-4 h-4" />
                        ) : (
                            <ArrowRight className="w-4 h-4" />
                        )}
                        <span>{isDeploying ? 'Publishing...' : currentStep === steps.length - 1 ? 'Publish Listing' : 'Continue'}</span>
                    </button>
                </div>
            </div>

            <ListingPreview
                formData={formData}
                selectedImage={images.find(img => img.selected)?.url || ''}
                activeAmenities={amenities.filter(a => a.active)}
                nightlyPrice={pricing.nightlyPrice}
            />

            {isDeploying && (
                <GenerativeLoader
                    duration={isSyncing ? 3500 : 8000}
                    messages={publishStatus.length > 0 ? publishStatus : undefined}
                    completeMessage={isSyncing ? "Sync Complete" : "Transaction Sent"}
                />
            )}
        </div>
    );
};

export default ListingWizard;
