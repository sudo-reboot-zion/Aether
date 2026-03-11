import React from 'react';
import Link from 'next/link';
import { DashboardHeaderProps } from '@/redux/slices/redux.types';



const DashboardHeader: React.FC<DashboardHeaderProps> = ({ persona, userName }) => {
    return (
        <header className="flex justify-between items-center mb-2">
            <div>
                <div className="text-xs uppercase tracking-widest text-[var(--t-secondary)] font-semibold mb-1">
                    {persona === 'HOST' ? 'Host Center' : 'Guest Portal'}
                </div>
                <h1 className="text-3xl font-light text-[var(--t-primary)] tracking-tight">
                    {userName ? `${userName.split(' ')[0]}'s ` : ''}Dashboard
                </h1>
            </div>
            {persona === 'HOST' && (
                <Link
                    href="/dashboard/list-property"
                    className="h-11 px-6 rounded-full bg-[var(--c-blue-deep)] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#153250] transition-colors shadow-lg shadow-[rgba(27,64,102,0.2)]"
                >
                    <span>Add Listing</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </Link>
            )}
        </header>
    );
};

export default DashboardHeader;
