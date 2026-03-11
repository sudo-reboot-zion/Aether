import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    label?: string;
    className?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    label, className = '', value, onChange, options
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--t-secondary)] mb-0.5">{label}</label>}

            <button
                type="button"
                className="w-full flex items-center justify-between bg-transparent border-none font-serif text-base text-[var(--t-primary)] cursor-pointer outline-none p-0 pr-6 group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedOption?.label || ''}</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-[var(--c-blue-azure)] transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute left-0 mt-3 w-max min-w-full bg-white/95 backdrop-blur-xl border border-[rgba(27,64,102,0.1)] rounded-xl shadow-2xl z-50 overflow-hidden outline-none pointer-events-auto transition-all duration-300 origin-top
                ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
                style={{ visibility: isOpen ? 'visible' : 'hidden' }}
            >
                <ul className="max-h-60 overflow-y-auto w-full py-1 m-0 list-none scroll-smooth scrollbar-thin scrollbar-thumb-[rgba(27,64,102,0.2)] scrollbar-track-transparent">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`px-4 py-2.5 text-sm font-sans cursor-pointer transition-colors duration-200 
                            ${option.value === value
                                    ? 'bg-[rgba(27,64,102,0.05)] text-[var(--c-blue-azure)] font-bold'
                                    : 'text-[var(--t-primary)] hover:bg-[rgba(27,64,102,0.03)]'
                                }`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CustomSelect;
