import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const PropertyForm = () => {
    const { id } = useParams(); // If ID exists, we are editing
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        catch_phrase: '',
        price: '',
        surface: '',
        city: '',
        type: 'Maison', // Default
        status: 'Vente',
        description: '',
        image_url: '',
        features: ''
    });

    // Fetch data if edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchProperty = async () => {
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (data) {
                    setFormData({
                        ...data,
                        features: data.features ? data.features.join(', ') : ''
                    });
                }
            };
            fetchProperty();
        }
    }, [isEditMode, id]);

    // Handle Image Upload
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('property-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erreur lors du téléchargement de l\'image.');
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            surface: parseFloat(formData.surface),
            features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
        };

        try {
            if (isEditMode) {
                const { error } = await supabase
                    .from('properties')
                    .update(payload)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('properties')
                    .insert([payload]);
                if (error) throw error;
            }
            navigate('/admin');
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Erreur lors de la sauvegarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-[#002B5B]">
                    {isEditMode ? 'Modifier le bien' : 'Ajouter un nouveau bien'}
                </h1>
                <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-[#002B5B] font-bold">Annuler</button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-8">

                {/* Image Upload - DRAG & DROP */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase text-xs tracking-wide">Photo principale</label>
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-[#C5A059] bg-yellow-50' : 'border-gray-300 hover:border-[#002B5B]'}`}>
                        <input {...getInputProps()} />
                        {formData.image_url ? (
                            <div className="relative w-full h-full p-2 group">
                                <img src={formData.image_url} alt="Aperçu" className="w-full h-full object-cover rounded-lg" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold rounded-lg">
                                    Changer la photo
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                {uploading ? (
                                    <p>Téléchargement...</p>
                                ) : (
                                    <>
                                        <Upload size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="font-bold">Glissez une photo ici</p>
                                        <p className="text-sm">ou cliquez pour sélectionner</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Titre de l'annonce</label>
                        <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B] font-bold text-[#002B5B]" placeholder="Ex: Maison de charme..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Phrase d'accroche (Optionnel)</label>
                        <input name="catch_phrase" value={formData.catch_phrase} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Ex: Coup de coeur assuré..." />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Prix (€)</label>
                        <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Ex: 250000" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Surface (m²)</label>
                        <input required type="number" name="surface" value={formData.surface} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Ex: 120" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Ville</label>
                        <input required name="city" value={formData.city} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Ex: Boulange" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Type de bien</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B] bg-white">
                            <option>Maison</option>
                            <option>Appartement</option>
                            <option>Terrain</option>
                            <option>Immeuble</option>
                            <option>Local Commercial</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Statut</label>
                        <div className="flex gap-4 p-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="status" value="Vente" checked={formData.status === 'Vente'} onChange={handleChange} className="accent-[#002B5B] w-5 h-5" />
                                <span className={`font-bold ${formData.status === 'Vente' ? 'text-[#002B5B]' : 'text-gray-400'}`}>Vente</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="status" value="Location" checked={formData.status === 'Location'} onChange={handleChange} className="accent-[#C5A059] w-5 h-5" />
                                <span className={`font-bold ${formData.status === 'Location' ? 'text-[#C5A059]' : 'text-gray-400'}`}>Location</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description complète</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Décrivez le bien en détail..."></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Caractéristiques principales</label>
                    <input name="features" value={formData.features} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Séparées par des virgules (Ex: Garage, Jardin, 3 Chambres...)" />
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <Button type="submit" disabled={loading} className="px-8 py-4 text-base rounded-xl">
                        {loading ? 'Enregistrement...' : (
                            <><Save size={20} /> Enregistrer le bien</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PropertyForm;
