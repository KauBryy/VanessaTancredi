import React from 'react';
import { MapPin, Maximize2, Home, ArrowRight, Heart } from 'lucide-react';
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
                <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg rounded-full backdrop-blur-md ${property.status === 'Location' ? 'bg-[#C5A059]/90' : 'bg-[#002B5B]/90'}`}>
                    {property.status}
                </span>
                {/* Example of another badge */}
                <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#002B5B] bg-white/90 shadow-lg rounded-full backdrop-blur-md">
                    Exclusivité
                </span>
            </div>

            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors shadow-lg">
                    <Heart size={20} />
                </button>
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

            {/* Caractéristiques Styled */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="p-1.5 bg-[#F4F7FA] rounded-md text-[#002B5B]"><Maximize2 size={16} /></div>
                    <span className="font-semibold">{property.surface} m²</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="p-1.5 bg-[#F4F7FA] rounded-md text-[#002B5B]"><Home size={16} /></div>
                    <span className="font-semibold">{property.type}</span>
                </div>
            </div>

            {/* Prix & CTA */}
            <div className="mt-auto flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold mb-0.5">Prix</p>
                    <div className="text-2xl font-display font-black text-[#002B5B]">
                        {formatPrice(property.price, property.status === 'Location')}
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
