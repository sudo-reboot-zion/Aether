import { PropertyItemProps } from '@/redux/slices/redux.types';
import React from 'react';
import { CheckCircle2, EyeOff } from 'lucide-react';



const PropertyItem: React.FC<PropertyItemProps> = ({ name, location, status, isActive, onToggle, image }) => {
    return (
        <div className="bg-[var(--c-white-glass)] rounded-[40px] p-2 pl-6 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-2xl bg-cover bg-center shrink-0 border border-white/50 bg-gray-200"
                    style={{
                        backgroundImage: image && !image.startsWith('#') ? `url(${image})` : undefined,
                        backgroundColor: image && image.startsWith('#') ? image : undefined
                    }}
                ></div>
                <div className="flex flex-col">
                    <span className="font-medium text-[var(--t-primary)] text-sm tracking-wide">{name}</span>
                    <span className="text-[11px] text-[var(--t-secondary)]">{location}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 pr-2">
                <span
                    className={`px-5 py-2 rounded-full text-xs font-medium flex items-center gap-2 ${status === 'Active'
                        ? 'bg-[#E3FCEF] text-[#006644]'
                        : 'bg-[#F2F4F7] text-[var(--t-secondary)] text-opacity-70'
                        }`}
                >
                    {status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {status}
                </span>
                <div
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${isActive ? 'bg-[var(--c-blue-deep)]' : 'bg-[var(--t-secondary)] opacity-30'
                        }`}
                    onClick={onToggle}
                >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                </div>
            </div>
        </div>
    );
};

export default PropertyItem;
