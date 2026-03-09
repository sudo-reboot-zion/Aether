import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-6 py-2.5 rounded-lg text-sm shadow-lg font-sans text-sm uppercase tracking-wide font-medium transition-all duration-300 cursor-pointer";

    const variants = {
        primary: "bg-[var(--c-blue-deep)] text-white hover:bg-[var(--c-blue-azure)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(61,124,184,0.4)]",
        secondary: "bg-[var(--c-blue-haze)] text-[var(--t-primary)] hover:bg-[var(--c-blue-azure)] hover:text-white",
        outline: "border border-[var(--c-blue-deep)] text-[var(--c-blue-deep)] hover:bg-[var(--c-blue-deep)] hover:text-white",
        ghost: "bg-transparent text-[var(--t-primary)] hover:bg-[rgba(27,64,102,0.05)] shadow-none"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
