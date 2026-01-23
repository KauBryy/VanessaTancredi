import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, CheckCircle2, Award, Sparkles, TrendingUp, Camera, Truck, Sofa, PenTool, RefreshCcw, Search } from 'lucide-react';
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
    const [activeStatus, setActiveStatus] = useState('Tous');
    const [activeType, setActiveType] = useState('Tous');
    const [activeCities, setActiveCities] = useState([]); // Array of strings, empty = all
    const [activeBudget, setActiveBudget] = useState('');
    const [activeMinSurface, setActiveMinSurface] = useState('');
    const [activeMinRooms, setActiveMinRooms] = useState('');
    const [activeFeatures, setActiveFeatures] = useState([]); // ['Jardin', 'Garage', etc]
    const [dbCities, setDbCities] = useState([]); // Cities from DB

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

        const fetchCities = async () => {
            const { data } = await supabase
                .from('cities')
                .select('*')
                .order('name', { ascending: true });
            if (data) setDbCities(data);
        };

        fetchProperties();
        fetchCities();
    }, []);

    const filteredProperties = useMemo(() => {
        // 1. Strict Filters (Base Criteria)
        let candidates = properties.filter(p => {
            const statusMatch = activeStatus === 'Tous' || (p.status || 'Vente') === activeStatus;
            const typeMatch = activeType === 'Tous' || p.type === activeType;
            const cityMatch = activeCities.length === 0 || activeCities.includes(p.city);
            const priceMatch = activeBudget === '' || p.price <= parseInt(activeBudget);
            return statusMatch && typeMatch && cityMatch && priceMatch;
        });

        // If no advanced filters are active, return candidates directly (Score 100 implied)
        const hasAdvancedFilters = activeMinSurface !== '' || activeMinRooms !== '' || activeFeatures.length > 0;

        if (!hasAdvancedFilters) {
            return candidates;
        }

        // 2. Scoring & Ranking (Weighted Filters)
        const scoredCandidates = candidates.map(p => {
            let score = 100;
            let missing = [];

            // Surface check
            if (activeMinSurface !== '' && p.surface < parseInt(activeMinSurface)) {
                score -= 20; // Heavy penalty for surface
                missing.push(`Surface < ${activeMinSurface}m²`);
            }

            // Rooms check
            const roomsCount = p.rooms || (p.features ? parseInt(p.features.find(f => f.toLowerCase().includes('chambre')) || 0) : 0);
            if (activeMinRooms !== '' && roomsCount < parseInt(activeMinRooms)) {
                score -= 20;
                missing.push(`< ${activeMinRooms} Chambres`);
            }

            // Features check
            activeFeatures.forEach(feat => {
                let hasFeature = false;

                if (feat === 'Sans travaux') {
                    // Smart keyword search for condition
                    const keywords = ['rénové', 'aucun travaux', 'neuf', 'impeccable', 'refait', 'excellent état'];
                    const textContent = `${p.description} ${p.catch_phrase} ${p.features?.join(' ')}`.toLowerCase();
                    hasFeature = keywords.some(k => textContent.includes(k));
                } else {
                    // Standard feature check
                    hasFeature = p.features?.some(f => f.toLowerCase().includes(feat.toLowerCase()));
                }

                if (!hasFeature) {
                    score -= 10;
                    missing.push(`${feat === 'Sans travaux' ? 'Travaux à prévoir' : `Pas de ${feat}`}`);
                }
            });

            return { ...p, matchScore: Math.max(0, score), missingCriteria: missing };
        });

        // 3. Sort by Score (Best match first)
        return scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    }, [properties, activeStatus, activeType, activeCities, activeBudget, activeMinSurface, activeMinRooms, activeFeatures]);

    const cityCounts = useMemo(() => {
        const counts = {};
        properties.forEach(p => {
            if (activeStatus === 'Tous' || (p.status || 'Vente') === activeStatus) {
                counts[p.city] = (counts[p.city] || 0) + 1;
            }
        });
        return counts;
    }, [properties, activeStatus]);

    // Fallback: if dbCities is empty, derive from properties to avoid empty dropdown
    const cities = useMemo(() => {
        if (dbCities.length > 0) return dbCities.map(c => c.name);
        return [...new Set(properties.filter(p => activeStatus === 'Tous' || (p.status || 'Vente') === activeStatus).map(p => p.city))];
    }, [properties, activeStatus, dbCities]);

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
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                activeType={activeType}
                setActiveType={setActiveType}
                activeCities={activeCities}
                setActiveCities={setActiveCities}
                activeBudget={activeBudget}
                setActiveBudget={setActiveBudget}
                activeMinSurface={activeMinSurface}
                setActiveMinSurface={setActiveMinSurface}
                activeMinRooms={activeMinRooms}
                setActiveMinRooms={setActiveMinRooms}
                activeFeatures={activeFeatures}
                setActiveFeatures={setActiveFeatures}
                cities={dbCities.length > 0 ? dbCities : cities}
                cityCounts={cityCounts}
                loading={loading}
            />

            <div className="max-w-7xl mx-auto px-4 pt-12 md:pt-48 lg:pt-40 pb-20 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-display font-black text-[#002B5B]">Biens à la Une</h2>
                        <div className="w-24 h-1.5 bg-[#C5A059] mt-3 rounded-full mx-auto md:mx-0"></div>
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
                        <div className="flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setActiveStatus('Tous');
                                    setActiveType('Tous');
                                    setActiveCities([]);
                                    setActiveBudget('');
                                    setActiveMinSurface('');
                                    setActiveMinRooms('');
                                    setActiveFeatures([]);
                                }}
                                className="group flex items-center gap-3 px-8 py-4 bg-[#002B5B] hover:bg-[#003d82] text-white rounded-2xl font-bold transition-all shadow-xl shadow-[#002B5B]/20 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span>NOUVELLE RECHERCHE</span>
                            </motion.button>
                        </div>
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
                            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mb-6 text-[#C5A059]">
                                <Camera size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Photos & Visite Virtuelle</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Shooting HDR et <span className="font-bold text-[#C5A059]">visite immersive</span> pour sublimer votre bien dès le premier regard.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mb-6 text-[#C5A059]">
                                <Truck size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Camion de Déménagement</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Un véhicule utilitaire mis <span className="font-bold text-[#C5A059]">gratuitement</span> à votre disposition pour votre emménagement.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mb-6 text-[#C5A059]">
                                <Sofa size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Home Staging 3D</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Rénovation virtuelle et projections 3D pour révéler tout le <span className="font-bold text-[#C5A059]">potentiel</span> de vos espaces.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mb-6 text-[#C5A059]">
                                <PenTool size={32} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#002B5B] mb-3">Signature Électronique</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Gagnez du temps et <span className="font-bold text-[#C5A059]">sécurisez</span> vos démarches avec la signature certifiée à distance.</p>
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
                            <div className="relative w-48 h-64 rounded-2xl overflow-hidden border-4 border-white shadow-xl transform rotate-3 group-hover:rotate-0 transition-all duration-500">
                                <div className="absolute inset-0 bg-[#002B5B]/10 group-hover:bg-transparent transition-colors z-10"></div>
                                <img src={AGENT_INFO.photo} alt="Vanessa Tancredi" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 md:right-12 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-float z-20">
                                <div className="bg-[#C5A059] p-2 rounded-full text-white">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="font-black text-[#002B5B] text-lg">Experte</p>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Pays-Haut</p>
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
                                    Passionnée par l’immobilier et profondément ancrée dans notre région, je ne me contente pas de vendre des biens : je concrétise des projets de vie. En tant qu'agent commercial indépendant pour <strong>BORBICONI Immobilier</strong>, je vous offre le meilleur des deux mondes : l'agilité et la disponibilité d'une conseillère de proximité, alliées à la puissance d'un groupe implanté d'Ottange au Luxembourg, jusqu'à la Meuse.
                                </p>

                                <h4 className="font-bold text-[#002B5B] pt-2">Un terrain de jeu que je connais par cœur</h4>
                                <p>
                                    J’interviens au quotidien sur un secteur stratégique entre <strong>Longwy, Villerupt, Longuyon et Piennes</strong>. Que vous soyez à Mercy-le-Bas, Bouligny ou dans les villages voisins, je connais chaque spécificité du marché local. Cette expertise me permet de vous conseiller avec précision, qu'il s'agisse d'estimer votre bien au juste prix ou de dénicher l'emplacement idéal pour votre future famille.
                                </p>

                                <h4 className="font-bold text-[#002B5B] pt-2">L'humain au centre de chaque transaction</h4>
                                <p>
                                    Parce que chaque projet est unique, je privilégie un accompagnement sur-mesure. En travaillant avec moi, vous avez une interlocutrice unique, transparente et disponible, qui défend vos intérêts de la première estimation jusqu'à la signature finale.
                                </p>

                                <p className="text-xl font-display font-medium text-[#C5A059] italic text-center py-4 leading-relaxed">
                                    "Chaque projet est unique. C'est pourquoi je privilégie un accompagnement humain, personnalisé et transparent, fondé sur l'écoute, la confiance et la disponibilité."
                                </p>

                                <p className="font-bold text-[#002B5B] italic pt-2">
                                    Vous avez un projet immobilier ?
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Button onClick={() => navigate('/contact')} className="shadow-xl shadow-blue-900/10 px-8 py-4 text-base rounded-xl">
                                    Parlons-en simplement
                                </Button>
                                <Button variant="outline" onClick={() => navigate('/estimation')} className="px-8 py-4 text-base rounded-xl">
                                    Demander une estimation
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Text Section */}
            <div className="bg-[#F4F7FA] py-16 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4 text-center md:text-left">
                    <h2 className="text-xl font-bold text-[#002B5B] mb-6">Zones d'intervention & Expertise Immobilière</h2>
                    <div className="text-gray-400 text-xs leading-relaxed space-y-4 text-justify">
                        <p>
                            <strong>Secteur Nord Meurthe-et-Moselle & Frontalier :</strong> Immobilier Longwy, Vente maison Longuyon, Appartements à Mercy-le-Bas, Achat Piennes, Estimation Bouligny, Immobilier Villerupt, Audun-le-Roman.
                        </p>
                        <p>
                            <strong>Nos services :</strong> Estimation immobilière gratuite, Vente d'appartements et maisons, Terrains à bâtir, Investissement locatif frontalier, Honoraires adaptés, Accompagnement personnalisé.
                        </p>
                        <p>
                            Vanessa Tancredi, mandataire indépendant partenaire du groupe Borbiconi Immobilier.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
