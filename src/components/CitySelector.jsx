import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTORS = [
    {
        name: "Bassin de Longwy & Frontières",
        cities: ["Longwy", "Mont-Saint-Martin", "Herserange", "Réhon", "Lexy", "Villers-la-Montagne", "Saulnes"]
    },
    {
        name: "Cœur de Secteur (Pays-Haut)",
        cities: ["Mercy-le-Bas", "Joppécourt", "Boismont", "Bazailles", "Ville-au-Montois", "Fillières", "Boudrezy"]
    },
    {
        name: "Secteur Longuyon & Environs",
        cities: ["Longuyon", "Pierrepont", "Arrancy-sur-Crusnes", "Beuveille", "Doncourt-lès-Longuyon", "Spincourt"]
    },
    {
        name: "Secteur Boulange / Audun",
        cities: ["Boulange", "Aumetz", "Audun-le-Roman", "Ottange", "Trieux", "Hayange"]
    }
];

const CitySelector = ({ selectedCities, onChange, cityCounts = {}, loading }) => {
    // selectedCities is an array of strings. If empty, it implicitly means "All".

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCity = (city) => {
        if (selectedCities.includes(city)) {
            onChange(selectedCities.filter(c => c !== city));
        } else {
            onChange([...selectedCities, city]);
        }
    };

    const toggleSector = (sector) => {
        // Collect all available cities in this sector (count > 0 or loading)
        const availableCities = sector.cities.filter(city => {
            const count = cityCounts[city] || 0;
            return loading || count > 0;
        });

        if (availableCities.length === 0) return;

        const allSelected = availableCities.every(city => selectedCities.includes(city));

        if (allSelected) {
            // Deselect all
            onChange(selectedCities.filter(c => !availableCities.includes(c)));
        } else {
            // Select all (merge)
            const otherCities = selectedCities.filter(c => !availableCities.includes(c));
            onChange([...otherCities, ...availableCities]);
        }
    };

    const displayValue = selectedCities.length === 0
        ? "Toutes les villes"
        : selectedCities.length === 1
            ? selectedCities[0]
            : `${selectedCities.length} villes sélectionnées`;

    return (
        <div className="relative group" ref={containerRef}>
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors z-10" size={20} />

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left pl-12 pr-4 h-[58px] bg-gray-50 border border-gray-200 rounded-xl text-[#002B5B] font-bold focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all cursor-pointer hover:bg-gray-100 flex items-center justify-between ${isOpen ? 'ring-2 ring-[#C5A059]/20 border-[#C5A059]' : ''}`}
            >
                <span className="truncate">{displayValue}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] max-h-[400px] overflow-y-auto"
                    >
                        <div className="p-4 space-y-6">
                            <div
                                onClick={() => onChange([])}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${selectedCities.length === 0
                                    ? 'bg-[#002B5B]/5 text-[#002B5B]'
                                    : 'text-gray-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCities.length === 0 ? 'bg-[#002B5B] border-[#002B5B]' : 'border-gray-300 bg-white'}`}>
                                    {selectedCities.length === 0 && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm font-bold flex items-center gap-1">
                                    Toutes les villes
                                </span>
                            </div>

                            {SECTORS.map((sector) => {
                                // Check if all available cities in this sector are selected
                                const availableCities = sector.cities.filter(city => {
                                    const count = cityCounts[city] || 0;
                                    return loading || count > 0;
                                });
                                const isSectorSelected = availableCities.length > 0 && availableCities.every(city => selectedCities.includes(city));
                                const isSectorPartiallySelected = !isSectorSelected && availableCities.some(city => selectedCities.includes(city));

                                return (
                                    <div key={sector.name}>
                                        <div
                                            onClick={() => toggleSector(sector)}
                                            className="flex items-center justify-between mb-2 border-b border-gray-100 pb-1 cursor-pointer hover:bg-gray-50 rounded px-1 transition-colors group/sector"
                                        >
                                            <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                                                {sector.name}
                                            </h4>
                                            <div className={`text-xs font-semibold ${isSectorSelected ? 'text-[#002B5B]' : 'text-gray-400'} group-hover/sector:text-[#002B5B]`}>
                                                {isSectorSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {sector.cities.map((city) => {
                                                const isSelected = selectedCities.includes(city);
                                                const count = cityCounts[city] || 0;
                                                const isDisabled = !loading && count === 0;

                                                return (
                                                    <div
                                                        key={city}
                                                        onClick={() => !isDisabled && toggleCity(city)}
                                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isDisabled
                                                            ? 'opacity-40 cursor-not-allowed bg-gray-50 pointer-events-none'
                                                            : 'cursor-pointer hover:bg-gray-50'
                                                            } ${isSelected ? 'bg-[#002B5B]/5 text-[#002B5B]' : 'text-gray-600'}`}
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#002B5B] border-[#002B5B]' : 'border-gray-300 bg-white'}`}>
                                                            {isSelected && <Check size={12} className="text-white" />}
                                                        </div>
                                                        <span className="text-sm font-medium flex items-center gap-1">
                                                            {city}
                                                            {!loading && (
                                                                <span className={`text-xs font-normal ${count === 0 ? 'text-gray-300' : 'text-gray-400'}`}>
                                                                    ({count})
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-100 sticky bottom-0 text-center bg-white/95 backdrop-blur">
                            <span className="text-xs text-gray-400">
                                {selectedCities.length === 0 ? "Toute la zone est sélectionnée" : `${selectedCities.length} localités sélectionnées`}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CitySelector;
