import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AGENT_INFO, LOGO_URL, AGENCY_SEAL } from '../constants';

const Footer = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="bg-[#1A1A1A] text-white py-16 px-4 border-t-8 border-[#C5A059] font-sans">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-white p-1 rounded-full overflow-hidden shadow-xl border-4 border-[#C5A059]/20">
                            <img src={AGENCY_SEAL} alt="Borbiconi Agence" className="h-40 w-40 object-contain" />
                        </div>
                    </div>
                    <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                        <strong className="text-white">Votre partenaire immobilier local.</strong><br />
                        Expertise et proximité à Mercy-le-Bas, Boulange, Crusnes, Spincourt et alentours.<br />
                        Partenaire officielle : <strong className="text-white">Vanessa Tancredi</strong>
                    </p>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#C5A059] group-hover:text-white transition-colors cursor-pointer">
                                <Facebook size={20} />
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute bottom-full left-0 mb-2 w-36 bg-white rounded-lg shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                                <a href={AGENT_INFO.facebookProfile} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-[#C5A059] text-xs font-bold border-b border-gray-100 transition-colors">
                                    MON PROFIL
                                </a>
                                <a href={AGENT_INFO.facebookPage} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-[#C5A059] text-xs font-bold transition-colors">
                                    MA PAGE
                                </a>
                                {/* Small arrow */}
                                <div className="absolute -bottom-1 left-4 w-3 h-3 bg-white rotate-45 transform"></div>
                            </div>
                        </div>

                        <a href={AGENT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#C5A059] hover:text-white transition-colors cursor-pointer">
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-[#C5A059] uppercase tracking-widest text-xs">Contact Direct</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-center gap-3"><Phone size={16} className="text-[#C5A059]" /> {AGENT_INFO.phone}</li>
                        <li className="flex items-center gap-3"><Mail size={16} className="text-[#C5A059]" /> {AGENT_INFO.email}</li>
                        <li className="flex items-center gap-3"><MapPin size={16} className="text-[#C5A059]" /> {AGENT_INFO.sector}</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-[#C5A059] uppercase tracking-widest text-xs">Liens Rapides</h4>
                    <ul className="space-y-3 text-gray-400 cursor-pointer font-medium">
                        <li className="hover:text-white transition-colors" onClick={() => handleNavigation('/')}>Nos Biens en vente</li>
                        <li className="hover:text-white transition-colors" onClick={() => handleNavigation('/estimation')}>Demander une estimation</li>
                        <li className="hover:text-white transition-colors" onClick={() => handleNavigation('/contact')}>Nous contacter</li>
                        <li className="hover:text-white transition-colors" onClick={() => handleNavigation('/honoraires')}>Honoraires & Barème</li>
                        <li className="pt-4 border-t border-gray-800 mt-2">
                            <a href="https://scbi.fr" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors text-gray-500 hover:text-[#C5A059] mb-1">Site Officiel scbi.fr</a>
                            <a href="https://scbi.eu" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors text-gray-500 hover:text-[#C5A059]">Portail scbi.eu</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs gap-4">
                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <span>© 2026 Borbiconi Immobilier • Tous droits réservés.</span>
                    <span className="hidden md:inline text-gray-800">•</span>
                    <a href="https://kaubry.fr" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors font-medium">
                        Propulsé par <span className="font-bold">KauBry Apps</span>
                    </a>
                </div>
                <div className="flex gap-6">
                    <Link to="/mentions-legales" onClick={() => window.scrollTo(0, 0)} className="hover:text-gray-400 cursor-pointer">Mentions Légales</Link>
                    <Link to="/mentions-legales" onClick={() => setTimeout(() => document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' }), 100)} className="hover:text-gray-400 cursor-pointer">Politique de confidentialité</Link>
                    <Link to="/admin/login" className="flex items-center gap-1 text-gray-600 hover:text-[#C5A059] transition-colors">
                        <Lock size={12} /> Administration
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
