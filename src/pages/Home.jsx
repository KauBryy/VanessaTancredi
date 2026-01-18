import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, CheckCircle2, Award, Sparkles, TrendingUp } from 'lucide-react';
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
    const [activeCity, setActiveCity] = useState('Toutes');
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
            const cityMatch = activeCity === 'Toutes' || p.city === activeCity;
            const priceMatch = activeBudget === '' || p.price <= parseInt(activeBudget);
            return typeMatch && cityMatch && priceMatch;
        });
    }, [properties, activeType, activeCity]);

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
                activeCity={activeCity}
                setActiveCity={setActiveCity}
                activeBudget={activeBudget}
                setActiveBudget={setActiveBudget}
                cities={cities}
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
                        <Button variant="ghost" onClick={() => { setActiveType('Tous'); setActiveCity('Toutes') }}>
                            Effacer les filtres
                        </Button>
                    </div>
                )}
            </div>


            {/* Trust Indicators Section */}
            <div className="bg-[#F4F7FA] py-16">
                {/* ... existing trust indicators code ... */}
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-[#002B5B]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#002B5B]">
                            <Award size={32} />
                        </div>
                        <h3 className="font-display font-bold text-xl text-[#002B5B] mb-2">Expertise Locale</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Une connaissance parfaite du marché de Mercy-le-Bas et alentours.</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#C5A059]">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="font-display font-bold text-xl text-[#002B5B] mb-2">Service Premium</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Une mise en valeur exceptionnelle de votre bien : photos HD, visites ciblées.</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#002B5B]">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="font-display font-bold text-xl text-[#002B5B] mb-2">Estimation Juste</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Nous vendons au meilleur prix grâce à une estimation précise et réaliste.</p>
                    </motion.div>
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
                            <span className="text-[#C5A059] font-bold text-sm uppercase tracking-[0.2em] mb-4 block">Une relation de confiance</span>
                            <h2 className="text-4xl md:text-6xl font-display font-black text-[#002B5B] mb-6 leading-tight">
                                Vanessa Tancredi.
                            </h2>
                            <h3 className="text-2xl text-gray-400 font-light mb-8">Votre experte locale dédiée.</h3>

                            <p className="text-gray-500 leading-loose mb-8 text-lg font-medium">
                                "Mon engagement est total sur mon secteur. De <strong>Mercy-le-Bas</strong> à <strong>Boulange</strong>, je connais chaque quartier et chaque spécificité du marché local pour valoriser votre bien."
                            </p>

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
