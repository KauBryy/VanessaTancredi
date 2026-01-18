import React, { useState } from 'react';
import { User, Phone, MapPin, Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm font-sans">
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
                    onClick={() => navigate('/')}
                >
                    <div className="border-r border-gray-200 pr-6 h-12 flex items-center">
                        <img src={LOGO_URL} alt="Borbiconi Immobilier" className="h-full object-contain" />
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Vanessa Tancredi</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Votre experte locale</span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-wide">
                    <Link to="/" className={`hover:text-[#002B5B] transition-colors ${isActive('/')}`}>Biens</Link>
                    <Link to="/estimation" className={`hover:text-[#002B5B] transition-colors ${isActive('/estimation')}`}>Estimation</Link>
                    <Link to="/contact" className={`hover:text-[#002B5B] transition-colors ${isActive('/contact')}`}>Contact</Link>
                    <Button variant="secondary" onClick={() => navigate('/estimation')} className="py-2 px-4 text-xs shadow-none">
                        Estimer mon bien
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden text-[#002B5B] cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-xl">
                    <nav className="flex flex-col gap-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className={`hover:text-[#002B5B] transition-colors ${isActive('/')}`}>Biens</Link>
                        <Link to="/estimation" onClick={() => setIsMenuOpen(false)} className={`hover:text-[#002B5B] transition-colors ${isActive('/estimation')}`}>Estimation</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={`hover:text-[#002B5B] transition-colors ${isActive('/contact')}`}>Contact</Link>
                        <Button variant="secondary" onClick={() => { navigate('/estimation'); setIsMenuOpen(false); }} className="w-full justify-center">
                            Estimer mon bien
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
