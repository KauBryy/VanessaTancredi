import React from 'react';
import { motion } from 'framer-motion';
import { Table, FileText, Check, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Fees = () => {
    const navigate = useNavigate();

    const feesData = [
        { priceRange: "De 0 à 29 999 €", simple: "5 000 €", exclusive: "4 500 €" },
        { priceRange: "De 30 000 à 49 999 €", simple: "6 000 €", exclusive: "5 500 €" },
        { priceRange: "De 50 000 à 99 999 €", simple: "8 000 €", exclusive: "7 500 €" },
        { priceRange: "De 100 000 à 149 999 €", simple: "9 000 €", exclusive: "8 500 €" },
        { priceRange: "De 150 000 à 199 999 €", simple: "10 000 €", exclusive: "9 500 €" },
        { priceRange: "De 200 000 à 249 999 €", simple: "13 000 €", exclusive: "12 000 €" },
        { priceRange: "De 250 000 à 299 999 €", simple: "15 000 €", exclusive: "14 000 €" },
        { priceRange: "De 300 000 à 349 999 €", simple: "16 000 €", exclusive: "15 000 €" },
        { priceRange: "De 350 000 à 399 999 €", simple: "17 000 €", exclusive: "16 000 €" },
        { priceRange: "De 400 000 à 449 999 €", simple: "18 000 €", exclusive: "17 000 €" },
        { priceRange: "De 450 000 à 499 999 €", simple: "19 000 €", exclusive: "18 000 €" },
        { priceRange: "De 500 000 à 599 999 €", simple: "4 %", exclusive: "3,5 %" },
        { priceRange: "De 600 000 à 999 999 €", simple: "3,5 %", exclusive: "3 %" },
        { priceRange: "1 000 000 € et plus", simple: "3 %", exclusive: "2,5 %" },
    ];

    return (
        <div className="bg-white font-sans pt-24 pb-12">
            {/* Header */}
            <div className="bg-[#002B5B] py-16 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#C5A059]/10"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold tracking-[0.2em] mb-6 backdrop-blur-md">
                        TRANSPARENCE & CONFIANCE
                    </span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Barème Honoraires Vente</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Applicable à compter du 1er Juillet 2025. Nos tarifs sont clairs, transparents et sans surprise.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                >
                    <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50 flex items-start gap-4">
                        <AlertCircle className="text-[#C5A059] flex-shrink-0" size={24} />
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Aucun honoraire, aucun frais de quelque nature que ce soit n'est dû avant la signature de l'acte authentique chez le notaire.
                            Tous nos tarifs s'entendent <strong>TTC (TVA à 20% incluse)</strong> et seront arrondis si besoin à la centaine inférieure.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#002B5B] text-white">
                                    <th className="p-4 md:p-6 text-sm font-bold uppercase tracking-wider text-left w-1/3">Prix de Vente</th>
                                    <th className="p-4 md:p-6 text-sm font-bold uppercase tracking-wider text-center w-1/3 bg-[#003875]">Mandat Simple</th>
                                    <th className="p-4 md:p-6 text-sm font-bold uppercase tracking-wider text-center w-1/3 bg-[#C5A059] text-[#002B5B]">Mandat Exclusif</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feesData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}
                                    >
                                        <td className="p-4 md:p-5 font-medium text-gray-700">{row.priceRange}</td>
                                        <td className="p-4 md:p-5 font-bold text-gray-600 text-center">{row.simple}</td>
                                        <td className="p-4 md:p-5 font-black text-[#002B5B] text-center bg-[#C5A059]/5 border-l border-r border-[#C5A059]/10">
                                            {row.exclusive}
                                        </td>
                                    </tr>
                                ))}
                                {/* Garage Row */}
                                <tr className="bg-[#002B5B]/5 font-bold">
                                    <td className="p-4 md:p-5 text-[#002B5B]">Forfait garage / parking</td>
                                    <td className="p-4 md:p-5 text-center text-[#002B5B]" colSpan="2">2 500 €</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-gray-50 text-center">
                        <h3 className="text-xl font-bold text-[#002B5B] mb-4">Vous avez un projet de vente ?</h3>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button onClick={() => navigate('/estimation')} className="px-8 shadow-lg shadow-[#C5A059]/20">
                                Demander une estimation gratuite
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/contact')}>
                                Nous contacter
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Fees;
