import React from 'react';
import { Phone, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AGENT_INFO } from '../constants';

const FixedMobileContact = () => {
    const navigate = useNavigate();

    return (
        <div className="sm:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
            <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl p-2 flex gap-2 pointer-events-auto overflow-hidden ring-1 ring-white/50">
                {/* Bouton Appeler - Style Sombre & Luxueux */}
                <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={`tel:${AGENT_INFO.phone.replace(/\s/g, '')}`}
                    className="flex-[0.35] flex items-center justify-center bg-gradient-to-br from-[#003B7B] to-[#001B3B] text-white rounded-xl py-4 border border-white/5 shadow-lg shadow-[#002B5B]/20 relative overflow-hidden group"
                    aria-label="Appeler"
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity"></div>
                    <Phone size={20} className="relative z-10" />
                </motion.a>

                {/* Bouton Estimer - Style Premium Doré */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        navigate('/estimation');
                        window.scrollTo(0, 0);
                    }}
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#C5A059] to-[#D4B475] text-white rounded-xl py-4 shadow-lg shadow-[#C5A059]/30 transition-all font-bold tracking-wide uppercase text-sm"
                >
                    <TrendingUp size={18} />
                    <span>Estimer mon bien</span>
                </motion.button>
            </div>
        </div>
    );
};

export default FixedMobileContact;
