"use client";
import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getIPFSUrl } from '@/lib/ipfs';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    fallbackSrc?: string;
    isIPFS?: boolean;
}

const MAX_GATEWAYS = 4;

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    fallbackSrc = '/images/trending-casa.jpg',
    isIPFS: initialIsIPFS,
    alt,
    ...props
}) => {
    // Determine if it's an IPFS CID/URI — explicitly exclude blobs and data URIs
    const detectIsIPFS = (url: string) =>
        !url.startsWith('/') &&
        !url.startsWith('blob:') &&
        !url.startsWith('data:') &&
        (
            initialIsIPFS ||
            url.startsWith('ipfs://') ||
            (url.length > 40 && !url.includes('/') && !url.includes(':'))
        );

    const isIPFS = detectIsIPFS(src);

    // Resolve to a gateway URL immediately if it's an IPFS URI
    const resolve = (url: string, idx: number): string => {
        if (!url) return fallbackSrc;
        if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http') || url.startsWith('/')) return url;
        // Strip ipfs:// prefix or use as CID directly
        const cid = url.startsWith('ipfs://') ? url.replace('ipfs://', '') : url;
        return getIPFSUrl(cid, idx);
    };

    const [gatewayIndex, setGatewayIndex] = useState(0);
    const [imgSrc, setImgSrc] = useState(() => resolve(src, 0));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setGatewayIndex(0);
        setImgSrc(resolve(src, 0));
        setHasError(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    const handleError = () => {
        if (isIPFS && gatewayIndex < MAX_GATEWAYS - 1) {
            const nextIndex = gatewayIndex + 1;
            setGatewayIndex(nextIndex);
            const nextUrl = resolve(src, nextIndex);
            console.warn(`[SafeImage] Gateway ${gatewayIndex} failed. Trying gateway ${nextIndex}: ${nextUrl}`);
            setImgSrc(nextUrl);
        } else {
            if (!hasError) {
                console.error(`[SafeImage] All gateways exhausted for ${src}. Using placeholder.`);
                setImgSrc(fallbackSrc);
                setHasError(true);
            }
        }
    };

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={handleError}
            unoptimized={isIPFS || imgSrc.startsWith('blob:')}
        />
    );
};

export default SafeImage;
