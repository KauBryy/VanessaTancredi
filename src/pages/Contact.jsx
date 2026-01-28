import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { AGENT_INFO } from '../constants';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    React.useEffect(() => {
        document.title = 'Contactez Vanessa Tancredi - Experte Immobilière';
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
                    ...formData,
                    _subject: "Nouveau message de contact - Site Vanessa Tancredi",
                    //_autoresponse: "Merci pour votre message, je reviens vers vous rapidement." 
                })
            });

            if (response.ok) {
                setStatus('success');
                trackEvent('generate_lead', {
                    method: 'contact_form',
                    email: formData.email
                });
                setFormData({ name: '', phone: '', email: '', message: '' });
            } else {
                throw new Error('Erreur FormSubmit');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FA] py-20 px-4 font-sans">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                <div className="bg-[#002B5B] p-12 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="text-[#C5A059] font-bold text-xs uppercase tracking-widest mb-4 block">Parlons Immobilier</span>
                        <h2 className="text-4xl font-black mb-8">Contactez<br />Vanessa</h2>
                        <p className="text-blue-200 mb-8 leading-relaxed">Une question ? Un projet ? Je suis à votre écoute pour concrétiser vos envies immobilières à {AGENT_INFO.sector}.</p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-lg font-bold"><Phone size={20} className="text-[#C5A059]" /> {AGENT_INFO.phone}</div>
                            <div className="flex items-center gap-4"><Mail size={20} className="text-[#C5A059]" /> {AGENT_INFO.email}</div>
                            <div className="flex items-center gap-4"><MapPin size={20} className="text-[#C5A059]" /> Mercy-le-Bas, France</div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                        <p className="text-xs opacity-50 uppercase tracking-widest">Partenaire Groupe Borbiconi</p>
                    </div>

                    {/* Cercles déco */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#C5A059] rounded-full opacity-20 blur-3xl"></div>
                </div>

                <div className="p-12 md:w-3/5 overflow-y-auto">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nom</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#002B5B]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tel</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#002B5B]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                            <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#002B5B]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Message</label>
                            <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#002B5B]"></textarea>
                        </div>

                        <Button type="submit" className="w-full py-4 text-lg rounded-xl" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Envoi...' : 'Envoyer mon message'}
                        </Button>

                        {status === 'success' && <p className="text-green-600 text-center font-bold">Message envoyé avec succès !</p>}
                        {status === 'error' && <p className="text-red-500 text-center font-bold">Erreur lors de l'envoi. Réessayez.</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
