import React from 'react';
import Image from 'next/image';
import { Edit, Loader2 } from 'lucide-react';
import Identicon from '../ui/Identicon';

interface ProfileImageProps {
    profileImage: string;
    isUploading: boolean;
    onUploadClick: () => void;
    address?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profileImage, isUploading, onUploadClick, address }) => {
    const isDefault = profileImage === '/images/generic-avatar.png';

    return (
        <div className="relative w-[88px] h-[88px] group">
            <div className="w-full h-full rounded-full border-[3px] border-white/10 overflow-hidden relative bg-white/5">
                {isDefault && address ? (
                    <Identicon address={address} size={88} className="w-full h-full" />
                ) : (
                    <Image
                        src={profileImage}
                        alt="User Profile"
                        fill
                        sizes="88px"
                        priority
                        loading="eager"
                        className={`object-cover transition-opacity ${isUploading ? 'opacity-30' : 'opacity-100'}`}
                    />
                )}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--c-blue-azure)]" />
                    </div>
                )}
                <div
                    onClick={onUploadClick}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                >
                    <Edit className="w-5 h-5 text-white" />
                </div>
            </div>
        </div>
    );
};

export default ProfileImage;
