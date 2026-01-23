import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CitySelector = ({ selectedCities, onChange, cityCounts = {}, loading, availableCities }) => {
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
        // Collect all available cities in this sector (count > 0 or loading or DB list)
        // If we are using DB list (availableCities provided), we want to allow selecting them all regardless of count potentially?
        // But usually search filters only care about active properties.
        // HOWEVER, the user asked for "Manageable" list.
        // Let's stick to: Select all cities in this sector that are visible in the list.

        const citiesInSector = sector.cities;

        // Use the same logic as rendering to decide which ones are "toggleable"
        // If passed availableCities (DB mode), all are toggleable.
        // If not (legacy mode), only those with count > 0 are.

        const toggleableCities = citiesInSector.filter(city => {
            if (availableCities && availableCities.length > 0) return true;
            return loading || (cityCounts[city] || 0) > 0;
        });

        if (toggleableCities.length === 0) return;

        const allSelected = toggleableCities.every(city => selectedCities.includes(city));

        if (allSelected) {
            // Deselect all
            onChange(selectedCities.filter(c => !toggleableCities.includes(c)));
        } else {
            // Select all (merge)
            const otherCities = selectedCities.filter(c => !toggleableCities.includes(c));
            onChange([...otherCities, ...toggleableCities]);
        }
    };

    const displayValue = selectedCities.length === 0
        ? "Toutes les villes"
        : selectedCities.length === 1
            ? selectedCities[0]
            : `${selectedCities.length} villes sélectionnées`;

    // TRANSFORM DATA
    // We need to group 'availableCities' (array of objects {name, sector}) into sectors.
    // OR allow legacy 'activeCities' logic if input is just names.

    let sectorsToRender = [];

    if (availableCities && availableCities.length > 0 && typeof availableCities[0] === 'object') {
        // New Mode: DB Objects passed
        const grouped = availableCities.reduce((acc, city) => {
            const sectName = city.sector || "Autres";
            if (!acc[sectName]) acc[sectName] = [];
            acc[sectName].push(city.name);
            return acc;
        }, {});

        // Convert to array format expected by renderer
        // We might want to enforce specific order of sectors if possible, but alphabetically or random for now.
        // If we want specific order, we can map against the known list.
        const PREFERRED_ORDER = [
            "Bassin de Longwy & Frontières",
            "Cœur de Secteur (Pays-Haut)",
            "Secteur Longuyon & Environs",
            "Secteur Boulange / Audun"
        ];

        sectorsToRender = Object.entries(grouped).map(([name, cities]) => ({ name, cities }));

        // Sort sectors
        sectorsToRender.sort((a, b) => {
            const idxA = PREFERRED_ORDER.indexOf(a.name);
            const idxB = PREFERRED_ORDER.indexOf(b.name);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.name.localeCompare(b.name);
        });

    } else {
        // Fallback or Legacy Mode (should not happen if Home passes DB data correctly)
        // If availableCities is just strings (names), we put them in one "Nos Villes" group.
        if (availableCities && availableCities.length > 0) {
            sectorsToRender = [{ name: "Nos Localités", cities: availableCities }];
        } else {
            // Empty? 
            sectorsToRender = [];
        }
    }

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

                            {sectorsToRender.map((sector) => {
                                const relevantCities = sector.cities.map(c => c); // simple copy

                                // Calculate selection state
                                const isSectorSelected = relevantCities.length > 0 && relevantCities.every(city => selectedCities.includes(city));

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
                                            {relevantCities.map((city) => {
                                                const isSelected = selectedCities.includes(city);
                                                const count = cityCounts[city] || 0;
                                                // Disable if count is 0 (and we are not in a loading state)
                                                // Exception: If the city is already selected (e.g. from URL or previous state), allow deselecting? 
                                                // Standard UX: If 0 results, you can't filter by it.
                                                const isDisabled = !loading && count === 0;

                                                return (
                                                    <div
                                                        key={city}
                                                        onClick={() => !isDisabled && toggleCity(city)}
                                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isDisabled
                                                            ? 'opacity-40 cursor-not-allowed bg-gray-50'
                                                            : 'cursor-pointer hover:bg-gray-50'
                                                            } ${isSelected ? 'bg-[#002B5B]/5 text-[#002B5B]' : 'text-gray-600'}`}
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#002B5B] border-[#002B5B]' : 'border-gray-300 bg-white'}`}>
                                                            {isSelected && <Check size={12} className="text-white" />}
                                                        </div>
                                                        <span className="text-sm font-medium flex items-center gap-1">
                                                            {city}
                                                            {!loading && count > 0 && (
                                                                <span className="text-xs font-normal text-gray-400">
                                                                    ({count})
                                                                </span>
                                                            )}
                                                            {!loading && count === 0 && (
                                                                <span className="text-xs font-normal text-gray-300 italic">
                                                                    (0)
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
