import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Maximize2, Home as HomeIcon, Star, CheckCircle2, Phone, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import { formatPrice, AGENT_INFO } from '../constants';
import { supabase } from '../lib/supabase';
import { MOCK_PROPERTIES } from '../data/mocks';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <div className="bg-[#F4F7FA] min-h-screen pb-20 font-sans">
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
                            <img src={property.image_url || property.image} alt={property.title} className="w-full h-auto object-cover max-h-[600px] rounded-xl" />
                        </div>

                        <div className="bg-white p-8 shadow-sm rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-black text-[#002B5B] mb-2">{property.title}</h1>
                                    <p className="text-gray-500 flex items-center gap-1 font-medium"><MapPin size={18} className="text-[#C5A059]" /> {property.city}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-[#002B5B]">
                                        {formatPrice(property.price, property.status === 'Location')}
                                    </div>
                                    <div className="inline-block bg-[#C5A059] text-white text-xs font-bold px-3 py-1 uppercase mt-2 rounded-full shadow-md shadow-orange-200">{property.status}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-10">
                                <div className="text-center p-6 bg-[#F4F7FA] rounded-2xl">
                                    <Maximize2 size={24} className="mx-auto text-[#C5A059] mb-2" />
                                    <span className="block text-xl font-black text-[#002B5B]">{property.surface} m²</span>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Surface</span>
                                </div>
                                <div className="text-center p-6 bg-[#F4F7FA] rounded-2xl">
                                    <HomeIcon size={24} className="mx-auto text-[#C5A059] mb-2" />
                                    <span className="block text-xl font-black text-[#002B5B]">{property.type}</span>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Type</span>
                                </div>
                                <div className="text-center p-6 bg-[#F4F7FA] rounded-2xl">
                                    <Star size={24} className="mx-auto text-[#C5A059] mb-2" />
                                    <span className="block text-xl font-black text-[#002B5B]">Ref</span>
                                    <span className="text-xs text-gray-400 uppercase font-bold">{property.id.slice(0, 4)}...</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-xl mb-4 text-[#002B5B]">Description</h3>
                            <p className="text-gray-600 leading-loose mb-10 text-justify text-lg">
                                {property.description}
                            </p>

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
                                <img src={AGENT_INFO.photo} className="w-20 h-20 rounded-full object-cover border-4 border-[#F4F7FA]" alt="Agent" />
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
                                <p className="text-xs text-gray-400 font-medium">Référence du bien : {property.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
