import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: `bg-[#002B5B] text-white hover:bg-[#001F42] shadow-lg shadow-blue-900/20`,
        secondary: `bg-[#C5A059] text-white hover:bg-[#B08D4C] shadow-lg shadow-yellow-600/20`,
        outline: `border-2 border-[#002B5B] text-[#002B5B] hover:bg-[#002B5B] hover:text-white`,
        ghost: `text-[#002B5B] hover:bg-blue-50`
    };
    return (
        <button
            className={`px-6 py-3 rounded text-sm uppercase tracking-wide font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
