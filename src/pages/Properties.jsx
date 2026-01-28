import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, ArrowLeft, LayoutGrid } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../components/ui/Button';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../lib/supabase';
import { MOCK_PROPERTIES } from '../data/mocks';

const Properties = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error || !data || data.length === 0) {
                    setProperties(MOCK_PROPERTIES);
                } else {
                    setProperties(data);
                }
            } catch (e) {
                setProperties(MOCK_PROPERTIES);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
        document.title = 'Toutes les annonces immobilières - Vanessa Tancredi';
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-[#C5A059] font-bold text-sm mb-4 hover:gap-3 transition-all"
                        >
                            <ArrowLeft size={18} /> Retour à l'accueil
                        </button>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-[#002B5B]">Toutes nos Annonces</h1>
                        <div className="w-24 h-1.5 bg-[#C5A059] mt-3 rounded-full mx-auto md:mx-0"></div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-[#002B5B]/5 p-3 rounded-xl text-[#002B5B]">
                            <LayoutGrid size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#002B5B]">{properties.length} Biens Disponibles</p>
                            <p className="text-xs text-gray-400 font-medium">Secteur Pays-Haut & Frontières</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-40 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement des biens...</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode="wait">
                                {properties.map(property => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        onClick={() => navigate(`/property/${property.id}`)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {properties.length === 0 && (
                            <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
                                <p className="text-gray-500 mb-6 font-medium">Aucun bien n'est disponible pour le moment.</p>
                                <Button onClick={() => navigate('/')} variant="outline">
                                    Retour à l'accueil
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Properties;
