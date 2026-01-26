import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Search, ArrowRight, Euro, Maximize, Bed, Sofa, Droplets, Check, ChevronDown, ChevronUp, SlidersHorizontal, Trees, Car, Sun, Sparkles, Home } from 'lucide-react';
import Button from './ui/Button';
import CitySelector from './CitySelector';
import { motion, AnimatePresence } from 'framer-motion';
import heroBg from '../assets/hero_background_charme.png';

const SearchHero = ({
    activeStatus, setActiveStatus,
    activeType, setActiveType,
    activeCities, setActiveCities,
    activeBudget, setActiveBudget,
    activeMinSurface, setActiveMinSurface,
    activeMinRooms, setActiveMinRooms,
    activeFeatures, setActiveFeatures,
    cities, cityCounts, loading,
    resultsCount, isFilterActive,
    hasRentals = false // Default to false to be safe
}) => {
    const [actionTab, setActionTab] = useState('buy'); // 'buy' or 'sell'
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const navigate = useNavigate();

    const toggleFeature = (feat) => {
        if (activeFeatures.includes(feat)) {
            setActiveFeatures(activeFeatures.filter(f => f !== feat));
        } else {
            setActiveFeatures([...activeFeatures, feat]);
        }
    };

    const countActiveAdvanced = () => {
        let count = 0;
        if (activeMinSurface) count++;
        if (activeMinRooms) count++;
        count += activeFeatures.length;
        return count;
    };

    return (
        <div className="relative md:h-[85vh] md:min-h-[700px] min-h-[90svh] h-auto flex items-start justify-center pt-12 md:pt-24 z-30 pb-12 md:pb-0">
            {/* Background Image - Split for Mobile Stability vs Desktop Parallax */}
            <div className="absolute top-0 left-0 w-full h-[120vh] md:inset-0 md:h-full z-0 overflow-hidden">
                {/* Mobile: Stable Image Element with fixed over-height to prevent resize jumps */}
                <img
                    src={heroBg}
                    alt="Background Immobilier"
                    className="w-full h-full object-cover object-center md:hidden"
                    loading="eager"
                />
                {/* Desktop: Parallax Background */}
                <div
                    className="hidden md:block absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#002B5B]/80 via-[#002B5B]/40 to-white"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center text-center pt-16 md:pt-0">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold tracking-[0.2em] mb-6">
                        L'EXCELLENCE IMMOBILIÈRE
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6 leading-tight drop-shadow-2xl">
                        Votre Experte Immobilière <br />
                        <span className="text-[#C5A059] italic">en Pays-Haut</span>
                        <span className="block text-2xl md:text-4xl mt-2 font-normal text-white/90">Longwy • Villerupt • Longuyon • Piennes</span>
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl font-light max-w-4xl mx-auto mb-10 drop-shadow-md leading-relaxed">
                        Conseillère indépendante avec la force du groupe <strong className="text-white font-medium">Borbiconi</strong>, je dédie mon expertise à vos projets de <strong className="text-white font-medium">Mercy-le-Bas</strong> à tout le secteur frontalier.
                    </p>
                </motion.div>

                {/* Main Action Card with Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full max-w-5xl"
                >
                    {/* Tabs */}
                    {/* Tabs - Hidden for now as requested, simpler UI */}
                    <div className="flex justify-center mb-0 relative z-20">
                        <div
                            className="bg-white px-8 py-4 rounded-t-2xl text-sm font-bold tracking-wider text-[#002B5B] border-t border-x border-white"
                        >
                            TROUVER UN BIEN
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div className="bg-white rounded-b-3xl rounded-tr-3xl rounded-tl-none p-6 md:p-8 shadow-2xl relative z-30 min-h-[200px] flex items-start">

                        <AnimatePresence mode="wait">
                            {actionTab === 'buy' ? (
                                <motion.div
                                    key="buy"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col w-full"
                                >
                                    <div className="grid grid-cols-1 min-[598px]:grid-cols-2 md:grid-cols-4 gap-4 items-end w-full">

                                        <div className="w-full text-left">
                                            <label className="block text-[#002B5B] text-xs font-bold uppercase tracking-wider mb-2 ml-1">Projet</label>
                                            <div className="relative group">
                                                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                                                <select
                                                    value={activeStatus}
                                                    onChange={(e) => setActiveStatus(e.target.value)}
                                                    className="w-full h-[58px] pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-[#002B5B] font-bold focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all appearance-none cursor-pointer hover:bg-gray-50"
                                                >
                                                    {hasRentals && <option value="Tous">Acheter & Louer</option>}
                                                    <option value="Vente">Acheter</option>
                                                    {hasRentals && <option value="Location">Louer</option>}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="w-full text-left">
                                            <label className="block text-[#002B5B] text-xs font-bold uppercase tracking-wider mb-2 ml-1">Type de bien</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                                                <select
                                                    value={activeType}
                                                    onChange={(e) => setActiveType(e.target.value)}
                                                    className="w-full h-[58px] pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-[#002B5B] font-bold focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all appearance-none cursor-pointer hover:bg-gray-50"
                                                >
                                                    <option value="Tous">Tout voir</option>
                                                    <option value="Maison">Maison</option>
                                                    <option value="Appartement">Appartement</option>
                                                    <option value="Terrain">Terrain</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="w-full text-left">
                                            <label className="block text-[#002B5B] text-xs font-bold uppercase tracking-wider mb-2 ml-1">Localisation</label>
                                            <CitySelector selectedCities={activeCities} onChange={setActiveCities} cityCounts={cityCounts} loading={loading} availableCities={cities} />
                                        </div>
                                        <div className="w-full text-left">
                                            <label className="block text-[#002B5B] text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                                                {activeStatus === 'Location' ? 'Budget Max / Mois' : 'Budget Max'}
                                            </label>
                                            <div className="relative group">
                                                {activeStatus !== 'Location' && (
                                                    <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                                                )}

                                                {activeStatus === 'Location' ? (
                                                    <div className="w-full h-[58px] pl-4 pr-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3">
                                                        <div className="flex-1 flex items-center">
                                                            <input
                                                                type="range"
                                                                min="300"
                                                                max="2000"
                                                                step="50"
                                                                value={activeBudget || 2000}
                                                                onChange={(e) => setActiveBudget(e.target.value === "2000" ? "" : e.target.value)}
                                                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059] transition-all touch-none"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-[#F4F7FA] px-2 py-1.5 rounded-lg border border-gray-100 group-focus-within:border-[#C5A059]/30 transition-all">
                                                            <input
                                                                type="number"
                                                                value={activeBudget}
                                                                onChange={(e) => setActiveBudget(e.target.value)}
                                                                placeholder="2000"
                                                                className="w-11 bg-transparent text-[#002B5B] font-bold text-sm outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            />
                                                            <span className="text-[#002B5B]/50 font-bold text-xs">€</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <select
                                                        value={activeBudget}
                                                        onChange={(e) => setActiveBudget(e.target.value)}
                                                        className="w-full h-[58px] pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-[#002B5B] font-bold focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all appearance-none cursor-pointer hover:bg-gray-50"
                                                    >
                                                        <option value="">Budget illimité</option>
                                                        <option value="100000">100 000 €</option>
                                                        <option value="150000">150 000 €</option>
                                                        <option value="200000">200 000 €</option>
                                                        <option value="250000">250 000 €</option>
                                                        <option value="300000">300 000 €</option>
                                                        <option value="400000">400 000 €</option>
                                                        <option value="500000">500 000 €</option>
                                                        <option value="700000">700 000 €</option>
                                                        <option value="1000000">1 000 000 €</option>
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                        <div className="min-[598px]:col-span-2 md:col-span-4 flex justify-center mt-2 mb-1">
                                            <button
                                                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                                className="flex items-center gap-2 text-gray-500 hover:text-[#002B5B] font-bold text-sm transition-colors py-2 px-4 rounded-full hover:bg-gray-100"
                                            >
                                                <SlidersHorizontal size={16} />
                                                Filtres avancés
                                                {countActiveAdvanced() > 0 && (
                                                    <span className="bg-[#C5A059] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                                        {countActiveAdvanced()}
                                                    </span>
                                                )}
                                                {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Button inside Filter area when active */}
                                    <AnimatePresence>
                                        {isFilterActive && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="mt-6 flex justify-center"
                                            >
                                                <button
                                                    onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                                                    className="bg-[#002B5B] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/30 flex items-center gap-3 hover:bg-[#003d82] transition-all hover:translate-y-[-2px]"
                                                >
                                                    <Search size={18} />
                                                    Afficher les {resultsCount} biens correspondants
                                                    <ArrowRight size={18} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Advanced Filters Panel */}
                                    <AnimatePresence>
                                        {isAdvancedOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } }}
                                                exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
                                                className="overflow-hidden w-full"
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
                                                    {/* Surface + Rooms Group */}
                                                    <div className="lg:col-span-2 flex flex-wrap items-end gap-4">
                                                        <div className="text-left flex-1 min-w-[150px]">
                                                            <label className="block text-[#002B5B] text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">Surface Min</label>
                                                            <div className="relative">
                                                                <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                                                <input
                                                                    type="number"
                                                                    value={activeMinSurface}
                                                                    onChange={(e) => setActiveMinSurface(e.target.value)}
                                                                    className="w-full h-11 pl-9 pr-7 bg-white border border-gray-200 rounded-lg text-sm text-[#002B5B] font-bold outline-none focus:border-[#C5A059] transition-all"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[10px]">m²</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-left flex-1 min-w-[130px]">
                                                            <label className="block text-[#002B5B] text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">Chambres</label>
                                                            <div className="relative">
                                                                <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                                                <select
                                                                    value={activeMinRooms}
                                                                    onChange={(e) => setActiveMinRooms(e.target.value)}
                                                                    className="w-full h-11 pl-9 pr-4 bg-white border border-gray-200 rounded-lg text-sm text-[#002B5B] font-bold outline-none focus:border-[#C5A059] appearance-none cursor-pointer"
                                                                >
                                                                    <option value="">Indiff.</option>
                                                                    <option value="1">1+</option>
                                                                    <option value="2">2+</option>
                                                                    <option value="3">3+</option>
                                                                    <option value="4">4+</option>
                                                                    <option value="5">5+</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Features Tags */}
                                                    <div className="lg:col-span-2 flex flex-col lg:items-end">
                                                        <div className="flex flex-col items-start">
                                                            <label className="block text-[#002B5B] text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">Caractéristiques & État</label>
                                                            <div className="flex flex-wrap lg:flex-nowrap gap-2">
                                                                {[
                                                                    { id: 'Jardin', icon: Trees },
                                                                    { id: 'Garage', icon: Car },
                                                                    { id: 'Terrasse', icon: Sun },
                                                                    { id: 'Sans travaux', icon: Sparkles }
                                                                ].map(({ id, icon: Icon }) => (
                                                                    <button
                                                                        key={id}
                                                                        onClick={() => toggleFeature(id)}
                                                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${activeFeatures.includes(id)
                                                                            ? 'bg-[#002B5B] border-[#002B5B] text-white'
                                                                            : 'bg-white border-gray-200 text-gray-500 hover:border-[#002B5B] hover:text-[#002B5B]'
                                                                            }`}
                                                                    >
                                                                        <Icon size={14} />
                                                                        {id}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="sell"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col md:flex-row items-center justify-between gap-8"
                                >
                                    <div className="text-left flex-1 pl-2">
                                        <h3 className="text-2xl font-display font-bold text-[#002B5B] mb-2">Vous souhaitez vendre votre bien ?</h3>
                                        <p className="text-gray-500 font-medium">Obtenez une estimation précise et confidentielle de la valeur de votre bien à Mercy-le-Bas.</p>
                                    </div>
                                    <Button
                                        onClick={() => navigate('/estimation')}
                                        className="w-full md:w-auto h-[64px] px-10 rounded-xl shadow-xl shadow-[#C5A059]/30 flex items-center justify-center gap-3 text-lg font-bold bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-white border-none transition-all"
                                    >
                                        ESTIMER MON BIEN
                                        <ArrowRight size={20} />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SearchHero;
