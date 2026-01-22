import React from 'react';
import { MapPin, Maximize2, Home, ArrowRight, Bed } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../constants';

const PropertyCard = ({ property, onClick }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -12, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onClick}
        className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full group rounded-2xl overflow-hidden font-sans relative"
    >
        {/* Image + Badge Statut */}
        <div className="relative h-72 overflow-hidden">
            <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-black/0 transition-colors"></div>
            <img
                src={property.image_url || property.image || 'https://via.placeholder.com/400x300'}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">

                {/* Sale/Rent Badge */}
                <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg rounded-full backdrop-blur-md ${property.status === 'Location' ? 'bg-[#C5A059]/90' : 'bg-[#002B5B]/90'}`}>
                    {property.status === 'Location' ? 'Location' : 'Vente'}
                </span>

                {/* Marketing Status Badge */}
                {property.marketing_status && property.marketing_status !== 'Disponible' && (
                    <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg rounded-full backdrop-blur-md
                        ${['Nouveauté', 'Baisse de prix'].includes(property.marketing_status) ? 'bg-[#C5A059]/90' : ''}
                        ${property.marketing_status === 'Exclusivité' ? 'bg-[#002B5B]/90' : ''}
                        ${property.marketing_status.includes('Sous') ? 'bg-orange-600/90' : ''}
                        ${property.marketing_status === 'Vendu' ? 'bg-red-600/90' : ''}
                    `}>
                        {property.marketing_status}
                    </span>
                )}
            </div>

            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                {property.matchScore !== undefined && (
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg rounded-full backdrop-blur-md ${property.matchScore === 100 ? 'bg-green-500/90' : 'bg-orange-500/90'}`}>
                        Match {property.matchScore}%
                    </span>
                )}
            </div>



            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#002B5B]/90 via-[#002B5B]/60 to-transparent p-6 pt-12 flex items-end justify-between text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10">
                <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
                    <MapPin size={16} className="text-[#C5A059]" /> {property.city}
                </div>
            </div>
        </div>

        {/* Contenu */}
        <div className="p-8 flex flex-col flex-1 relative bg-white z-20">
            <div className="mb-4">
                <h3 className="text-xl font-display font-bold text-[#002B5B] leading-tight group-hover:text-[#C5A059] transition-colors mb-2">{property.title}</h3>
                {property.catch_phrase && (
                    <p className="text-sm text-gray-500 italic border-l-4 border-[#C5A059] pl-3 py-1 bg-gray-50/50 rounded-r">
                        "{property.catch_phrase}"
                    </p>
                )}
            </div>

            {/* Missing Criteria Warning */}
            {property.missingCriteria && property.missingCriteria.length > 0 && (
                <div className="mb-4 bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide mb-1">Critères manquants :</p>
                    <div className="flex flex-wrap gap-1">
                        {property.missingCriteria.map((item, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Caractéristiques Styled */}
            <div className="grid grid-cols-3 gap-2 mb-6 pb-6 border-b border-gray-100">
                <div className="flex flex-col items-center justify-center p-2 bg-[#F4F7FA] rounded-lg">
                    <Home size={16} className="text-[#002B5B] mb-1" />
                    <span className="text-xs font-bold text-gray-600 truncate w-full text-center">{property.type}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-[#F4F7FA] rounded-lg">
                    <Maximize2 size={16} className="text-[#002B5B] mb-1" />
                    <span className="text-xs font-bold text-gray-600">{property.surface} m²</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-[#F4F7FA] rounded-lg">
                    <Bed size={16} className="text-[#002B5B] mb-1" />
                    <span className="text-xs font-bold text-gray-600">{property.rooms} ch.</span>
                </div>
            </div>

            {/* Prix & CTA */}
            <div className="mt-auto flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold mb-0.5">Prix</p>
                    <div className="text-2xl font-display font-black text-[#002B5B]">
                        {formatPrice(property.price)} {property.status === 'Location' && <span className="text-sm font-medium text-gray-500">/mois</span>}
                    </div>
                </div>

                <button className="w-12 h-12 rounded-full border-2 border-[#F4F7FA] text-[#002B5B] flex items-center justify-center group-hover:bg-[#002B5B] group-hover:text-white group-hover:border-[#002B5B] transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    </motion.div>
);

export default PropertyCard;
