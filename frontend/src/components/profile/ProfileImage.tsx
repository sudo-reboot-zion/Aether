import React from 'react';
import { Edit, Loader2 } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import Identicon from '../ui/Identicon';

interface ProfileImageProps {
    profileImage: string;
    isUploading: boolean;
    onUploadClick: () => void;
    address?: string;
    isCollapsed?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profileImage, isUploading, onUploadClick, address, isCollapsed }) => {
    const isDefault = profileImage === '/images/generic-avatar.png';

    return (
        <div className={`relative transition-all duration-500 ${isCollapsed ? 'w-12 h-12' : 'w-[88px] h-[88px]'} group`}>
            <div className="w-full h-full rounded-full border-[3px] border-white/10 overflow-hidden relative bg-white/5">
                {isDefault && address ? (
                    <Identicon address={address} size={isCollapsed ? 48 : 88} className="w-full h-full" />
                ) : (
                    <SafeImage
                        src={profileImage}
                        alt="User Profile"
                        fill
                        sizes="88px"
                        priority
                        className={`object-cover transition-opacity ${isUploading ? 'opacity-30' : 'opacity-100'}`}
                        fallbackSrc="/images/generic-avatar.png"
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
