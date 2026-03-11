//   and retrieving content via high - performance gateways.

import { rateLimiter } from './rate-limiter';

// Ordered by reliability — Pinata last (most rate-limited)
const IPFS_GATEWAYS = [
    'https://dweb.link/ipfs',
    'https://ipfs.io/ipfs',
    'https://gateway.pinata.cloud/ipfs',
];

export interface PropertyMetadata {
    title: string;
    description: string;
    location: string;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
    hostName?: string;
}

/**
 * Convert a raw IPFS CID or ipfs:// URI to a gateway URL.
 * Optionally provide a gateway index for fallback.
 */
export function getIPFSUrl(uri: string, gatewayIndex = 0): string {
    if (!uri) return '';
    // Return non-IPFS URLs (http, blob, data) unchanged — never wrap them in a gateway
    if (uri.startsWith('http') || uri.startsWith('blob:') || uri.startsWith('data:')) return uri;

    let cid = uri;
    if (uri.startsWith('ipfs://')) {
        cid = uri.replace('ipfs://', '');
    }

    const gateway = IPFS_GATEWAYS[gatewayIndex % IPFS_GATEWAYS.length];
    return `${gateway}/${cid}`;
}

/**
 * Fetch and parse metadata from IPFS with fallback support
 */
export async function fetchIPFSMetadata(cid: string, gatewayIndex = 0): Promise<PropertyMetadata | any | null> {
    if (gatewayIndex >= IPFS_GATEWAYS.length) {
        console.error(`[IPFS] Failed to fetch metadata for CID ${cid} after trying all gateways.`);
        return null;
    }

    try {
        const url = getIPFSUrl(cid, gatewayIndex);
        const response = await rateLimiter.add(async () => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`IPFS gateway error: ${res.status} ${res.statusText}`);
            return res;
        });
        const json = await response.json();

        // Sanitize images: strip any blob: or data: URLs that were saved from old broken listings
        if (json && Array.isArray(json.images)) {
            json.images = json.images.filter(
                (url: string) => typeof url === 'string' && !url.startsWith('blob:') && !url.startsWith('data:')
            );
        }

        return json;
    } catch (error: any) {
        const errorMessage = error?.message?.toLowerCase() || error?.toString().toLowerCase() || '';
        const isNetworkError = errorMessage.includes('failed to fetch') ||
            errorMessage.includes('network error') ||
            errorMessage.includes('name_not_resolved') ||
            errorMessage.includes('aborted');

        if (isNetworkError) {
            console.warn(`[IPFS] Gateway ${gatewayIndex} failed for CID ${cid}. Trying fallback...`);
            return fetchIPFSMetadata(cid, gatewayIndex + 1);
        }

        console.error(`[IPFS] Non-retryable error fetching metadata for CID ${cid}:`, error?.message || error);
        return null;
    }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * Note: Requires PINATA_JWT in environment or passed as arg
 */
export async function uploadToIPFS(data: any, jwt?: string): Promise<string | null> {
    const pinataJwt = jwt || process.env.NEXT_PUBLIC_PINATA_JWT;

    if (!pinataJwt) {
        console.warn('No Pinata JWT found. IPFS upload skipped.');
        return null;
    }

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${pinataJwt}`,
            },
            body: JSON.stringify({
                pinataContent: data,
                pinataMetadata: {
                    name: `aether-${Date.now()}.json`,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Pinata error: ${response.statusText}`);
        }

        const result = await response.json();
        return result.IpfsHash;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        return null;
    }
}

/**
 * Upload a raw file (e.g., image) to IPFS via Pinata
 */
export async function uploadFileToIPFS(file: File, jwt?: string): Promise<string | null> {
    const pinataJwt = jwt || process.env.NEXT_PUBLIC_PINATA_JWT;

    if (!pinataJwt) {
        console.warn('No Pinata JWT found. IPFS upload skipped.');
        return null;
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        const metadata = JSON.stringify({
            name: `aether-asset-${Date.now()}`,
        });
        formData.append('pinataMetadata', metadata);

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${pinataJwt}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Pinata error: ${response.statusText}`);
        }

        const result = await response.json();
        return result.IpfsHash;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        return null;
    }
}
