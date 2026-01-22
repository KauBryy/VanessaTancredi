import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: `bg-[#002B5B] text-white shadow-lg shadow-blue-900/20`,
        secondary: `bg-[#C5A059] text-white shadow-lg shadow-yellow-600/20`,
        outline: `border-2 border-[#002B5B] text-[#002B5B] hover:bg-[#002B5B] hover:text-white`,
        ghost: `text-[#002B5B] hover:bg-blue-50`
    };

    return (
        <motion.button
            whileHover={{
                y: -4,
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden px-6 py-3 rounded-xl text-sm uppercase tracking-wide font-bold transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className} group`}
            {...props}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default Button;
