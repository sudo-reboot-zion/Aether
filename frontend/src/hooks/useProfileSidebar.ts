import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBadges } from '@/hooks/useBadges';
import { uploadFileToIPFS, getIPFSUrl } from '@/lib/ipfs';

export function useProfileSidebar() {
    const { userData, isLoading, persona } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet;
    const { badges, fetchUserBadges, badgeTypes } = useBadges(userAddress);

    const [profileImage, setProfileImage] = useState<string>('/images/generic-avatar.png');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userAddress) {
            fetchUserBadges(userAddress);
            const savedCid = localStorage.getItem(`aether_profile_img_${userAddress}`);
            if (savedCid) {
                setProfileImage(getIPFSUrl(savedCid));
            }
        }
    }, [userAddress, fetchUserBadges]);

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userAddress) return;

        setIsUploading(true);
        try {
            const cid = await uploadFileToIPFS(file);
            if (cid) {
                localStorage.setItem(`aether_profile_img_${userAddress}`, cid);
                setProfileImage(getIPFSUrl(cid));
            }
        } catch (err) {
            console.error('Failed to upload profile image:', err);
        } finally {
            setIsUploading(false);
        }
    }, [userAddress]);

    const userName = userData?.profile?.name || (persona === 'HOST' ? 'Sanctuary Host' : 'Guest Traveler');
    const shortAddress = userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Not Connected';

    return {
        userData,
        isLoading,
        persona,
        userAddress,
        badges,
        badgeTypes,
        profileImage,
        isUploading,
        fileInputRef,
        handleImageUpload,
        userName,
        shortAddress
    };
}
