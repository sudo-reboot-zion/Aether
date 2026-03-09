'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-28 right-8 z-50 bg-white/45 backdrop-blur-[24px] border border-white/40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:bg-white/60 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-6 h-6 text-[#1B4066] group-hover:text-[#3D7CB8] transition-colors" strokeWidth={2} />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
