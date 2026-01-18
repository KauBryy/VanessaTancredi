import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AGENT_INFO, LOGO_URL } from '../constants';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#1A1A1A] text-white py-16 px-4 border-t-8 border-[#C5A059] font-sans">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-white p-2 rounded">
                            <img src={LOGO_URL} alt="Borbiconi" className="h-8" />
                        </div>
                    </div>
                    <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                        <strong className="text-white">Votre partenaire immobilier local.</strong><br />
                        Expertise et proximité à Mercy-le-Bas, Boulange, Crusnes, Spincourt et alentours.<br />
                        Partenaire officielle : <strong className="text-white">Vanessa Tancredi</strong>
                    </p>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#C5A059] hover:text-white transition-colors cursor-pointer">FB</div>
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#C5A059] hover:text-white transition-colors cursor-pointer">IN</div>
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
                        <li className="hover:text-white transition-colors" onClick={() => navigate('/')}>Nos Biens en vente</li>
                        <li className="hover:text-white transition-colors" onClick={() => navigate('/estimation')}>Demander une estimation</li>
                        <li className="hover:text-white transition-colors" onClick={() => navigate('/contact')}>Nous contacter</li>
                        <li className="hover:text-white transition-colors text-[#C5A059] pt-2">vanessatancredi-scbi.fr</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs gap-4">
                <span>© 2026 Borbiconi Immobilier • Tous droits réservés.</span>
                <div className="flex gap-6">
                    <span className="hover:text-gray-400 cursor-pointer">Mentions Légales</span>
                    <span className="hover:text-gray-400 cursor-pointer">Politique de confidentialité</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
