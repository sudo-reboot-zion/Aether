"use client";
import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = 'Search by sanctuary name...',
    className = ''
}) => {
    return (
        <div className={`relative flex items-center w-full ${className}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 h-5 w-5 text-[var(--t-secondary)] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent border-0 outline-none pl-10 pr-4 py-2 text-lg text-[var(--t-primary)] placeholder:text-[var(--t-secondary)] placeholder:opacity-50 font-serif tracking-wide"
            />
        </div>
    );
};

export default SearchInput;
