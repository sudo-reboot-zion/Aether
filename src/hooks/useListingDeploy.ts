import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProperties } from './useProperties';
import { useAuth } from './useAuth';
import { uploadToIPFS, uploadFileToIPFS } from '@/lib/ipfs';
import { getLocationId } from '@/constants/locations';
import { ImageData, AmenityData, PricingData, FormData } from '@/types/wizard.types';

export const useListingDeploy = () => {
  const router = useRouter();
  const { userData, connectWallet } = useAuth();
  const stxAddress = userData?.profile?.stxAddress?.testnet;
  const { listProperty } = useProperties();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async (
    formData: FormData,
    images: ImageData[],
    amenities: AmenityData[],
    pricing: PricingData
  ) => {
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
    try {
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

      localStorage.removeItem('aether_listing_draft');
      router.push('/dashboard');
    } catch (err) {
      console.error('Deployment error:', err);
      alert('Failed to deploy listing. See console for details.');
    } finally {
      setIsDeploying(false);
    }
  };

  return { handleDeploy, isDeploying };
};
