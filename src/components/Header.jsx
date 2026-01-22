import React, { useState } from 'react';
import { User, Phone, MapPin, Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { AGENT_INFO, LOGO_URL } from '../constants';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Helper to check active state
    const isActive = (path) => currentPath === path ? 'text-[#002B5B]' : '';

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-sm font-sans">
            {/* Top Bar Contact */}
            <div className="bg-[#002B5B] text-white py-2 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-medium gap-2">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><User size={12} className="text-[#C5A059]" /> {AGENT_INFO.name}</span>
                        <span className="hidden md:flex items-center gap-2 text-white/80">{AGENT_INFO.role}</span>
                    </div>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><Phone size={12} className="text-[#C5A059]" /> {AGENT_INFO.phone}</span>
                        <span className="hidden md:flex items-center gap-2"><MapPin size={12} className="text-[#C5A059]" /> {AGENT_INFO.sector}</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-6 cursor-pointer"
                    onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
                >
                    <div className="border-r border-gray-200 pr-6 h-20 flex items-center">
                        <img src={LOGO_URL} alt="Borbiconi Immobilier" className="h-full object-contain" />
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Vanessa Tancredi</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Votre experte locale</span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-wide">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)} className={`hover:text-[#002B5B] transition-colors ${isActive('/')}`}>Biens</Link>
                    <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className={`hover:text-[#002B5B] transition-colors ${isActive('/contact')}`}>Contact</Link>
                    <Button variant="secondary" onClick={() => { navigate('/estimation'); window.scrollTo(0, 0); }} className="py-2 px-4 text-xs shadow-none">
                        Estimer mon bien
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden text-[#002B5B] cursor-pointer p-2" onClick={() => setIsMenuOpen(true)}>
                    <Menu size={32} />
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[101] p-8 flex flex-col gap-8"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-bold text-[#002B5B] uppercase tracking-wider">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-[#002B5B]">
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6 text-xl font-bold text-[#002B5B] uppercase tracking-wide">
                                <Link to="/" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }} className="hover:text-[#C5A059] transition-colors flex items-center gap-4 border-b border-gray-50 pb-4">
                                    Biens
                                </Link>
                                <Link to="/contact" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }} className="hover:text-[#C5A059] transition-colors flex items-center gap-4 border-b border-gray-50 pb-4">
                                    Contact
                                </Link>
                            </nav>

                            <div className="mt-auto space-y-6">
                                <Button variant="secondary" onClick={() => { navigate('/estimation'); setIsMenuOpen(false); window.scrollTo(0, 0); }} className="w-full justify-center py-4 text-base shadow-lg animate-pulse">
                                    Estimer mon bien
                                </Button>

                                <div className="text-center space-y-2 pt-6 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 font-medium">CONTACT DIRECT</p>
                                    <p className="text-lg font-bold text-[#002B5B]">{AGENT_INFO.phone}</p>
                                    <p className="text-sm text-gray-500">{AGENT_INFO.email}</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
