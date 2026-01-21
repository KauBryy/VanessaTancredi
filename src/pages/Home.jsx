import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, CheckCircle2, Award, Sparkles, TrendingUp, Camera, Truck, Sofa, PenTool } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../components/ui/Button';
import PropertyCard from '../components/PropertyCard';
import SearchHero from '../components/SearchHero';
import Testimonials from '../components/Testimonials';
import { AGENT_INFO } from '../constants';
import { supabase } from '../lib/supabase';
import { MOCK_PROPERTIES } from '../data/mocks';

const Home = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [activeType, setActiveType] = useState('Tous');
    const [activeCities, setActiveCities] = useState([]); // Array of strings, empty = all
    const [activeBudget, setActiveBudget] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { data, error } = await supabase
                    .from('properties')
                    .select('*');

                if (error || !data || data.length === 0) {
                    console.warn("Using mock data due to Supabase error or empty DB:", error);
                    setProperties(MOCK_PROPERTIES);
                } else {
                    setProperties(data);
                }
            } catch (e) {
                console.error("Fetch error:", e);
                setProperties(MOCK_PROPERTIES);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const typeMatch = activeType === 'Tous' || p.type === activeType;
            // If activeCities is empty, it means "All", otherwise check if property city is in the list
            const cityMatch = activeCities.length === 0 || activeCities.includes(p.city);
            const priceMatch = activeBudget === '' || p.price <= parseInt(activeBudget);
            return typeMatch && cityMatch && priceMatch;
        });
    }, [properties, activeType, activeCities]);

    const cityCounts = useMemo(() => {
        const counts = {};
        properties.forEach(p => {
            counts[p.city] = (counts[p.city] || 0) + 1;
        });
        return counts;
    }, [properties]);

    const cities = useMemo(() => [...new Set(properties.map(p => p.city))], [properties]);

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
        <>
            <SearchHero
                activeType={activeType}
                setActiveType={setActiveType}
                activeCities={activeCities}
                setActiveCities={setActiveCities}
                activeBudget={activeBudget}
                setActiveBudget={setActiveBudget}
                cities={cities}
                cityCounts={cityCounts}
                loading={loading}
            />

            <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-4xl font-display font-black text-[#002B5B]">Biens à la Une</h2>
                        <div className="w-24 h-1.5 bg-[#C5A059] mt-3 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 max-w-sm text-right hidden md:block">
                        Découvrez notre sélection exclusive de biens sur le secteur de Mercy-le-Bas, Boulange et environs.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement en cours...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="wait">
                            {filteredProperties.map(property => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onClick={() => navigate(`/property/${property.id}`)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredProperties.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                        <p className="text-gray-500 mb-4">Aucun bien ne correspond à vos critères pour le moment.</p>
                        <Button variant="ghost" onClick={() => { setActiveType('Tous'); setActiveCities([]) }}>
                            Effacer les filtres
                        </Button>
                    </div>
                )}
            </div>


            {/* Services Exclusifs Section */}
            <div className="bg-[#F4F7FA] py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[#C5A059] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">L'expérience Borbiconi</span>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-[#002B5B]">Vos Avantages Exclusifs</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#002B5B]/5 rounded-2xl flex items-center justify-center mb-6 text-[#002B5B]">
                                <Camera size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Photos & Visite Virtuelle</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Shooting HDR et visite immersive pour sublimer votre bien dès le premier regard.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mb-6 text-[#C5A059]">
                                <Truck size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Camion de Déménagement</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Un véhicule utilitaire mis <span className="font-bold text-[#C5A059]">gratuitement</span> à votre disposition pour votre emménagement.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#002B5B]">
                                <Sofa size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Home Staging 3D</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Rénovation virtuelle et projections 3D pour révéler tout le potentiel de vos espaces.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-[#002B5B]">
                                <PenTool size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Signature Électronique</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Gagnez du temps et sécurisez vos démarches avec la signature certifiée à distance.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <Testimonials />

            {/* Section "Vanessa" - Personal Branding - Redesign */}
            <div className="bg-white py-24 border-t border-gray-100 relative overflow-hidden font-sans">
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">

                        <div className="md:w-5/12 flex justify-center relative group">
                            <div className="relative w-64 h-80 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-500">
                                <div className="absolute inset-0 bg-[#002B5B]/10 group-hover:bg-transparent transition-colors z-10"></div>
                                <img src={AGENT_INFO.photo} alt="Vanessa Tancredi" className="w-full h-full object-cover" />
                            </div>

                            <div className="absolute -bottom-4 -right-4 md:right-12 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-float z-20">
                                <div className="bg-[#C5A059] p-2 rounded-full text-white">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div>
                                    <p className="font-black text-[#002B5B] text-xl">15+</p>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Années d'expérience</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-7/12 text-center md:text-left">
                            <span className="text-[#C5A059] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Une relation de confiance</span>
                            <h2 className="text-4xl md:text-5xl font-display font-black text-[#002B5B] mb-6 leading-tight">
                                Vanessa Tancredi.
                            </h2>
                            <h3 className="text-xl text-gray-400 font-light mb-8">Votre experte locale dédiée.</h3>

                            <div className="text-gray-500 leading-relaxed mb-8 text-base font-medium space-y-4 text-justify">
                                <p>
                                    Passionnée par l'immobilier et profondément attachée à ma région, je suis agent commercial chez <strong>BORBICONI Immobilier</strong>, agence reconnue et implantée à Ottange, ainsi qu'au Kirschberg au Luxembourg et à Vilosnes-Haraumont (Meuse).
                                </p>
                                <p>
                                    J'interviens principalement sur les secteurs de <strong>Mercy-le-Bas, Piennes, Bouligny, Longwy, Longuyon, Villerupt</strong> et leurs environs, que je connais parfaitement pour y travailler au quotidien.
                                </p>
                                <p>
                                    Cette connaissance du terrain me permet de vous conseiller au plus juste, que ce soit pour fixer le bon prix, choisir le bon emplacement ou saisir une opportunité.
                                </p>
                                <p className="italic text-[#002B5B]">
                                    "Chaque projet est unique. C'est pourquoi je privilégie un accompagnement humain, personnalisé et transparent, fondé sur l'écoute, la confiance et la disponibilité."
                                </p>
                                <p>
                                    De la première estimation jusqu'à la signature finale, je suis à vos côtés pour vous guider, vous rassurer et défendre vos intérêts. Vous avez un projet immobilier ? <strong>Parlons-en simplement.</strong>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Button onClick={() => navigate('/contact')} className="shadow-xl shadow-blue-900/10 px-8 py-4 text-base rounded-xl">
                                    Contacter Vanessa
                                </Button>
                                <Button variant="outline" onClick={() => navigate('/estimation')} className="px-8 py-4 text-base rounded-xl">
                                    Demander une estimation
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
