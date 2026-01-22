import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Maximize2, Home as HomeIcon, Star, CheckCircle2, Phone, Mail, ChevronLeft, X, BedDouble } from 'lucide-react';
import Button from '../components/ui/Button';
import { formatPrice, AGENT_INFO } from '../constants';
import { supabase } from '../lib/supabase';
import { MOCK_PROPERTIES } from '../data/mocks';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Lightbox Logic
    const allImages = property ? [property.image_url || property.image, ...(property.images || [])].filter(Boolean) : [];
    const currentImageSrc = selectedImage || property?.image_url || property?.image;
    const currentIndex = allImages.indexOf(currentImageSrc);

    const nextImage = (e) => {
        e?.stopPropagation();
        const nextIdx = (currentIndex + 1) % allImages.length;
        setSelectedImage(allImages[nextIdx]);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        const prevIdx = (currentIndex - 1 + allImages.length) % allImages.length;
        setSelectedImage(allImages[prevIdx]);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, currentIndex, allImages.length]); // added dep

    useEffect(() => {
        const fetchProperty = async () => {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                // Check Mocks
                const mock = MOCK_PROPERTIES.find(p => p.id === id);
                if (mock) {
                    setProperty(mock);
                } else {
                    // Not found
                }
            } else {
                setProperty(data);
            }
            setLoading(false);
        };
        fetchProperty();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="p-20 text-center">Chargement...</div>;
    if (!property) return <div className="p-20 text-center">Bien introuvable.</div>;

    return (
        <div className="bg-[#F4F7FA] min-h-screen pb-20 font-sans relative">
            {/* Lightbox Overlay */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsLightboxOpen(false)}>
                    <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2">
                        <X size={32} />
                    </button>

                    <button onClick={prevImage} className="absolute left-6 text-white/50 hover:text-white transition-colors p-4 hidden md:block">
                        <ChevronLeft size={48} />
                    </button>

                    <img
                        src={currentImageSrc}
                        alt="Plein écran"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button onClick={nextImage} className="absolute right-6 text-white/50 hover:text-white transition-colors p-4 hidden md:block">
                        <ChevronRight size={48} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest uppercase">
                        {currentIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}

            <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-20 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
                    <span className="cursor-pointer hover:text-[#002B5B]" onClick={() => navigate('/')}>Accueil</span>
                    <ChevronRight size={14} />
                    <span className="cursor-pointer hover:text-[#002B5B]" onClick={() => navigate('/')}>Biens</span>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#002B5B] truncate">{property.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-2 shadow-sm rounded-2xl overflow-hidden border border-gray-100">
                            {/* Main Image */}
                            <div
                                className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-gray-100 cursor-pointer group"
                                onClick={() => setIsLightboxOpen(true)}
                            >
                                <img
                                    src={selectedImage || property.image_url || property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-[#002B5B] font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                                        <Maximize2 size={18} /> Agrandir
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Grid */}
                            {property.images && property.images.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                    {/* Include Main Image in thumbnails to switch back */}
                                    <button
                                        onClick={() => setSelectedImage(null)} // null means show main image_url
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${!selectedImage ? 'border-[#C5A059] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={property.image_url || property.image} alt="Principale" className="w-full h-full object-cover" />
                                    </button>

                                    {/* Gallery Images */}
                                    {property.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-[#C5A059] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Vue ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-8 shadow-sm rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-black text-[#002B5B] mb-2">{property.title}</h1>
                                    <p className="text-gray-500 flex items-center gap-1 font-medium"><MapPin size={18} className="text-[#C5A059]" /> {property.city}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-[#002B5B]">
                                        {formatPrice(property.price)} {property.status === 'Location' && <span className="text-lg font-medium text-gray-500">/mois</span>}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 mt-2">
                                        <span className={`inline-block text-white text-xs font-bold px-3 py-1 uppercase rounded-full shadow-md ${property.status === 'Location' ? 'bg-[#C5A059]' : 'bg-[#002B5B]'}`}>
                                            {property.status === 'Location' ? 'Location' : 'Vente'}
                                        </span>
                                        {property.marketing_status && property.marketing_status !== 'Disponible' && (
                                            <span className={`inline-block text-white text-xs font-bold px-3 py-1 uppercase rounded-full shadow-md
                                                ${['Nouveauté', 'Baisse de prix'].includes(property.marketing_status) ? 'bg-[#C5A059]' : ''}
                                                ${property.marketing_status === 'Exclusivité' ? 'bg-[#002B5B]' : ''}
                                                ${property.marketing_status.includes('Sous') ? 'bg-orange-600' : ''}
                                                ${['Vendu', 'Loué'].includes(property.marketing_status) ? 'bg-red-600' : ''}
                                            `}>
                                                {property.marketing_status}
                                            </span>
                                        )}

                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-10">
                                <div className="text-center p-6 bg-[#F4F7FA] rounded-2xl">
                                    <HomeIcon size={24} className="mx-auto text-[#C5A059] mb-2" />
                                    <span className="block text-xl font-black text-[#002B5B]">{property.type}</span>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Type</span>
                                </div>
                                <div className="text-center p-6 bg-[#F4F7FA] rounded-2xl">
                                    <Maximize2 size={24} className="mx-auto text-[#C5A059] mb-2" />
                                    <span className="block text-xl font-black text-[#002B5B]">{property.surface} m²</span>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Surface</span>
                                </div>
                                <div className="text-center p-6 bg-[#F4F7FA] rounded-2xl">
                                    <BedDouble size={24} className="mx-auto text-[#C5A059] mb-2" />
                                    <span className="block text-xl font-black text-[#002B5B]">{property.rooms || '-'}</span>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Chambres</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-xl mb-4 text-[#002B5B]">Description</h3>
                            <p className="text-gray-600 leading-loose mb-10 text-justify text-lg whitespace-pre-line">
                                {property.description}
                            </p>

                            <h3 className="font-bold text-xl mb-4 text-[#002B5B]">Performance Énergétique</h3>
                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                {/* DPE Energie */}
                                <div className="bg-[#F4F7FA] p-6 rounded-2xl">
                                    <h4 className="font-bold text-sm text-[#002B5B] uppercase mb-4 flex justify-between">
                                        Consommation Énergie
                                        <span className={`px-2 py-0.5 rounded text-white text-xs ${property.dpe_energy === 'A' ? 'bg-green-500' : property.dpe_energy === 'B' ? 'bg-green-400' : property.dpe_energy === 'C' ? 'bg-lime-300' : 'bg-gray-400'}`}>
                                            {property.dpe_energy || '-'}
                                        </span>
                                    </h4>
                                    <div className="space-y-1">
                                        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter, i) => (
                                            <div key={letter} className="relative h-6 flex items-center">
                                                {/* Barre colorée */}
                                                <div
                                                    className={`h-full rounded-r-md flex items-center px-2 text-[10px] font-bold text-white/90 shadow-sm
                                                    ${letter === 'A' ? 'w-[30%] bg-green-600' : ''}
                                                    ${letter === 'B' ? 'w-[40%] bg-green-500' : ''}
                                                    ${letter === 'C' ? 'w-[50%] bg-lime-400' : ''}
                                                    ${letter === 'D' ? 'w-[60%] bg-yellow-400' : ''}
                                                    ${letter === 'E' ? 'w-[70%] bg-orange-400' : ''}
                                                    ${letter === 'F' ? 'w-[80%] bg-orange-600' : ''}
                                                    ${letter === 'G' ? 'w-[90%] bg-red-600' : ''}
                                                    `}
                                                >
                                                    {letter}
                                                </div>

                                                {/* Flèche indicatrice si match */}
                                                {property.dpe_energy === letter && (
                                                    <div className="absolute left-[92%] ml-2 flex items-center">
                                                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[10px] border-r-black mr-1 rotate-180"></div>
                                                        <span className="font-black text-xl text-black">{letter}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* GES Climat (affiché seulement si renseigné) */}
                                {property.dpe_ges && (
                                    <div className="bg-[#F4F7FA] p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#002B5B] uppercase mb-4 flex justify-between">
                                            Émissions GES
                                            <span className={`px-2 py-0.5 rounded text-white text-xs ${property.dpe_ges === 'A' ? 'bg-purple-200 text-purple-800' : 'bg-gray-300'}`}>
                                                {property.dpe_ges || '-'}
                                            </span>
                                        </h4>
                                        <div className="space-y-1">
                                            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter, i) => (
                                                <div key={letter} className="relative h-6 flex items-center">
                                                    <div
                                                        className={`h-full rounded-r-md flex items-center px-2 text-[10px] font-bold text-white/90 shadow-sm
                                                        ${letter === 'A' ? 'w-[30%] bg-[#E5D7F1]' : ''}
                                                        ${letter === 'B' ? 'w-[40%] bg-[#D0BFE5]' : ''}
                                                        ${letter === 'C' ? 'w-[50%] bg-[#BCA8D9]' : ''}
                                                        ${letter === 'D' ? 'w-[60%] bg-[#A890CD]' : ''}
                                                        ${letter === 'E' ? 'w-[70%] bg-[#9379C1]' : ''}
                                                        ${letter === 'F' ? 'w-[80%] bg-[#7F61B5]' : ''}
                                                        ${letter === 'G' ? 'w-[90%] bg-[#6B4AA9]' : ''}
                                                        `}
                                                    >
                                                        {letter}
                                                    </div>

                                                    {/* Flèche indicatrice si match */}
                                                    {property.dpe_ges === letter && (
                                                        <div className="absolute left-[92%] ml-2 flex items-center">
                                                            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[10px] border-r-black mr-1 rotate-180"></div>
                                                            <span className="font-black text-xl text-black">{letter}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <h3 className="font-bold text-xl mb-4 text-[#002B5B]">Les plus</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {property.features && property.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-xl text-sm font-bold text-gray-700">
                                        <CheckCircle2 size={20} className="text-[#C5A059]" /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-8 shadow-xl rounded-2xl sticky top-36 border-t-4 border-[#002B5B]">
                            <div className="flex items-center gap-4 mb-8">
                                <img src={AGENT_INFO.photo} className="w-16 h-16 rounded-full object-cover border-4 border-[#F4F7FA]" alt="Agent" />
                                <div>
                                    <p className="font-black text-[#002B5B] text-xl">{AGENT_INFO.name}</p>
                                    <p className="text-xs text-[#C5A059] font-bold uppercase tracking-wide">{AGENT_INFO.role}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] shadow-none flex items-center justify-center gap-3 py-4 rounded-xl text-base">
                                    <Phone size={20} /> Appeler maintenant
                                </Button>
                                <Button variant="outline" onClick={() => navigate('/contact')} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-base border-gray-200 hover:border-[#002B5B] text-gray-600">
                                    <Mail size={20} /> Envoyer un email
                                </Button>
                            </div>

                            <div className="text-center pt-6 border-t border-gray-100">
                                {/* Ref removed per user request */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
