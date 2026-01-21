import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Search, ArrowRight, Euro, Maximize, Bed, Sofa, Droplets, Check, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import Button from './ui/Button';
import CitySelector from './CitySelector';
import { motion, AnimatePresence } from 'framer-motion';
import heroBg from '../assets/hero_background_charme.png';

const SearchHero = ({
    activeType, setActiveType,
    activeCities, setActiveCities,
    activeBudget, setActiveBudget,
    activeMinSurface, setActiveMinSurface,
    activeMinRooms, setActiveMinRooms,
    activeFeatures, setActiveFeatures,
    cities, cityCounts, loading
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
        <div className="relative h-[85vh] min-h-[700px] flex items-start justify-center pt-16 md:pt-24 z-50">
            {/* Background Image Parallax Effect can be simpler here: Fixed BG */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#002B5B]/80 via-[#002B5B]/40 to-white"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center pt-24 md:pt-0">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold tracking-[0.2em] mb-6 backdrop-blur-md">
                        L'EXCELLENCE IMMOBILIÈRE
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6 leading-tight drop-shadow-2xl">
                        Votre Experte Immobilière à <br />
                        <span className="text-[#C5A059] italic">Mercy-le-Bas</span> et ses environs
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 drop-shadow-md">
                        La force du groupe Borbiconi, la proximité d'une spécialiste locale.
                    </p>
                </motion.div>

                {/* Main Action Card with Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full max-w-4xl"
                >
                    {/* Tabs */}
                    <div className="flex justify-center mb-0 relative z-20">
                        <button
                            onClick={() => setActionTab('buy')}
                            className={`px-8 py-4 rounded-t-2xl text-sm font-bold tracking-wider transition-all duration-300 border-t border-x ${actionTab === 'buy'
                                ? 'bg-white text-[#002B5B] border-white'
                                : 'bg-[#002B5B]/40 text-gray-300 border-white/10 hover:bg-[#002B5B]/60 backdrop-blur-sm'
                                }`}
                        >
                            ACHETER UN BIEN
                        </button>
                        <button
                            onClick={() => setActionTab('sell')}
                            className={`px-8 py-4 rounded-t-2xl text-sm font-bold tracking-wider transition-all duration-300 border-t border-x ${actionTab === 'sell'
                                ? 'bg-white text-[#002B5B] border-white'
                                : 'bg-[#002B5B]/40 text-gray-300 border-white/10 hover:bg-[#002B5B]/60 backdrop-blur-sm'
                                }`}
                        >
                            VENDRE UN BIEN
                        </button>
                    </div>

                    {/* Content Panel */}
                    <div className="bg-white rounded-b-3xl rounded-tr-3xl rounded-tl-none p-6 md:p-8 shadow-2xl relative z-30 min-h-[320px] flex items-start">

                        <AnimatePresence mode="wait">
                            {actionTab === 'buy' ? (
                                <motion.div
                                    key="buy"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end w-full"
                                >
                                    <div className="w-full text-left">
                                        <label className="block text-[#002B5B] text-xs font-bold uppercase tracking-wider mb-2 ml-1">Type de bien</label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                                            <select
                                                value={activeType}
                                                onChange={(e) => setActiveType(e.target.value)}
                                                className="w-full h-[58px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[#002B5B] font-bold focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all appearance-none cursor-pointer hover:bg-gray-100"
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
                                        <CitySelector selectedCities={activeCities} onChange={setActiveCities} cityCounts={cityCounts} loading={loading} />
                                    </div>
                                    <div className="w-full text-left">
                                        <label className="block text-[#002B5B] text-xs font-bold uppercase tracking-wider mb-2 ml-1">Budget Max</label>
                                        <div className="relative group">
                                            <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                                            <select
                                                value={activeBudget}
                                                onChange={(e) => setActiveBudget(e.target.value)}
                                                className="w-full h-[58px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[#002B5B] font-bold focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all appearance-none cursor-pointer hover:bg-gray-100"
                                            >
                                                <option value="">Indifférent</option>
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
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 flex justify-center mt-2 mb-4">
                                        <button
                                            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                            className="flex items-center gap-2 text-gray-500 hover:text-[#002B5B] font-bold text-sm transition-colors py-2 px-4 rounded-full hover:bg-gray-100"
                                        >
                                            <SlidersHorizontal size={16} />
                                            Critères précis
                                            {countActiveAdvanced() > 0 && (
                                                <span className="bg-[#C5A059] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                                    {countActiveAdvanced()}
                                                </span>
                                            )}
                                            {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    </div>

                                    {/* Advanced Filters Panel */}
                                    <AnimatePresence>
                                        {isAdvancedOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } }}
                                                exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
                                                className="md:col-span-3 overflow-hidden pb-1"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-gray-100 pt-6">
                                                    {/* Min Surface */}
                                                    <div className="text-left">
                                                        <label className="block text-[#002B5B] text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">Surface Min (m²)</label>
                                                        <div className="relative">
                                                            <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                                            <input
                                                                type="number"
                                                                value={activeMinSurface}
                                                                onChange={(e) => setActiveMinSurface(e.target.value)}
                                                                placeholder="Ex: 50"
                                                                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-lg text-sm text-[#002B5B] font-bold outline-none focus:border-[#C5A059] transition-all"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Min Rooms */}
                                                    <div className="text-left">
                                                        <label className="block text-[#002B5B] text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">Chambres Min</label>
                                                        <div className="relative">
                                                            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                                            <select
                                                                value={activeMinRooms}
                                                                onChange={(e) => setActiveMinRooms(e.target.value)}
                                                                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-lg text-sm text-[#002B5B] font-bold outline-none focus:border-[#C5A059] appearance-none cursor-pointer"
                                                            >
                                                                <option value="">Indifférent</option>
                                                                <option value="1">1+</option>
                                                                <option value="2">2+</option>
                                                                <option value="3">3+</option>
                                                                <option value="4">4+</option>
                                                                <option value="5">5+</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Features Tags */}
                                                    <div className="md:col-span-2 text-left">
                                                        <label className="block text-[#002B5B] text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">Caractéristiques & État</label>
                                                        <div className="flex flex-wrap gap-2 text-justify">
                                                            {['Jardin', 'Garage', 'Terrasse', 'Balcon', 'Sans travaux'].map(feat => (
                                                                <button
                                                                    key={feat}
                                                                    onClick={() => toggleFeature(feat)}
                                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${activeFeatures.includes(feat)
                                                                        ? 'bg-[#002B5B] border-[#002B5B] text-white'
                                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#002B5B] hover:text-[#002B5B]'
                                                                        }`}
                                                                >
                                                                    {feat}
                                                                </button>
                                                            ))}
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
                                        className="w-full md:w-auto h-[64px] px-10 rounded-xl shadow-xl shadow-[#C5A059]/30 flex items-center justify-center gap-3 text-lg font-bold bg-gradient-to-r from-[#C5A059] to-[#D4B06A] hover:to-[#C5A059] text-white border-none transform hover:-translate-y-1 transition-all"
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
