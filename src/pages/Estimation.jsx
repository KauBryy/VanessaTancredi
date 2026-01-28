import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { AGENT_INFO } from '../constants';
import { trackEvent } from '../lib/analytics';

const Estimation = () => {
    // Just reusing the contact or simplified logic for estimation requests
    // Ideally this would save to a specific table or send email
    // For MVP, we save to 'leads' with a message
    const [formData, setFormData] = useState({
        type: 'Maison', city: '', surface: '', rooms: '',
        name: '', phone: '', email: ''
    });
    const [status, setStatus] = useState('idle');

    React.useEffect(() => {
        document.title = 'Estimation Immobilière Gratuite - Vanessa Tancredi';
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${AGENT_INFO.email}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: "Nouvelle demande d'ESTIMATION - Site Vanessa Tancredi",
                    Type_de_bien: formData.type,
                    Ville: formData.city,
                    Surface: `${formData.surface} m²`,
                    Pieces: formData.rooms,
                    Nom_Client: formData.name,
                    Telephone: formData.phone,
                    Email: formData.email
                })
            });

            if (response.ok) {
                setStatus('success');
                trackEvent('generate_lead', {
                    method: 'estimation_form',
                    property_type: formData.type,
                    city: formData.city
                });
                setFormData({ type: 'Maison', city: '', surface: '', rooms: '', name: '', phone: '', email: '' });
            } else {
                throw new Error('Erreur FormSubmit');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FA] font-sans">
            <div className="bg-[#002B5B] py-24 text-center text-white relative overflow-hidden">
                <div className="relative z-10 px-4">
                    <span className="text-[#C5A059] font-bold uppercase tracking-widest text-sm mb-4 block">Gratuit & Confidentiel</span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Estimez votre bien</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                        Vendez au meilleur prix à Mercy-le-Bas, Boulange, Crusnes et environs grâce à une estimation précise de terrain.
                    </p>
                </div>
                {/* Pattern subtil en fond */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-20 pb-20">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-t-8 border-[#C5A059]">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#002B5B] uppercase ml-1">Type de bien</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all">
                                    <option>Maison</option>
                                    <option>Appartement</option>
                                    <option>Terrain</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#002B5B] uppercase ml-1">Ville</label>
                                <input required name="city" value={formData.city} onChange={handleChange} type="text" placeholder="Ex: Boulange..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#002B5B] uppercase ml-1">Surface (m²)</label>
                                <input required name="surface" value={formData.surface} onChange={handleChange} type="number" placeholder="100" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#002B5B] uppercase ml-1">Nombre de pièces</label>
                                <input required name="rooms" value={formData.rooms} onChange={handleChange} type="number" placeholder="4" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all" />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-xl font-black text-[#002B5B] mb-6">Vos coordonnées</h3>
                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nom Complet</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Téléphone</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full py-5 text-lg shadow-xl mt-4 rounded-xl" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Envoi...' : 'Demander mon estimation gratuite'}
                        </Button>
                        {status === 'success' && <p className="text-green-600 text-center font-bold mt-4">Demande envoyée ! Vanessa vous recontactera.</p>}
                        {status === 'error' && <p className="text-red-500 text-center font-bold mt-4">Erreur lors de l'envoi.</p>}

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Vos données sont transmises directement à Vanessa Tancredi et restent strictement confidentielles.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Estimation;
