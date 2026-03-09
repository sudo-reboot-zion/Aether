import {
  FormData,
  ImageData,
  AmenityData,
  PricingData,
  PropertyMetadata,
} from '@/types/wizard.types';
import { uploadToIPFS, uploadFileToIPFS } from '@/lib/ipfs';
import { getLocationId } from '@/constants/locations';


export const deployListing = async (
  formData: FormData,
  images: ImageData[],
  amenities: AmenityData[],
  pricing: PricingData,
  stxAddress: string,
  userName: string,
  listProperty: (
    priceInMicroSTX: number,
    locationTag: number,
    categoryTag: number,
    ipfsUri: string,
    address: string
  ) => Promise<void>
): Promise<void> => {
  // Validate required fields
  if (
    !formData.propertyName ||
    !formData.location ||
    !pricing.nightlyPrice ||
    formData.categoryTag === 0
  ) {
    throw new Error(
      'Please fill in all required fields (Name, Location, Vibe, and Price)'
    );
  }

  // Upload images to IPFS
  const sortedImages = [
    ...images.filter((img) => img.selected),
    ...images.filter((img) => !img.selected),
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

  // Prepare metadata with IPFS URIs
  const metadata: PropertyMetadata = {
    title: formData.propertyName,
    description: formData.description,
    type: formData.type,
    location: formData.location,
    categoryTag: formData.categoryTag,
    amenities: amenities.filter((a) => a.active).map((a) => a.label),
    images: imageUrls,
    pricing: pricing,
    hostName: userName || 'Sanctuary Host',
  };

  const ipfsHash = await uploadToIPFS(metadata);
  if (!ipfsHash) {
    throw new Error('Failed to upload metadata to IPFS');
  }

  const priceInMicroSTX = Math.round(
    parseFloat(pricing.nightlyPrice) * 1000000
  );
  const locationTag = getLocationId(formData.location);

  await listProperty(
    priceInMicroSTX,
    locationTag,
    formData.categoryTag,
    `ipfs://${ipfsHash}`,
    stxAddress
  );
};
