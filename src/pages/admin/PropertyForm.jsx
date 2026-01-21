import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Save, Wand2 } from 'lucide-react';
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
        rooms: '',
        city: '',
        type: 'Maison', // Default
        status: 'Vente',
        marketing_status: 'Disponible', // Label default
        description: '',
        image_url: '',
        images: [], // Gallery
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
            price: parseFloat(formData.price) || 0,
            surface: parseFloat(formData.surface) || 0,
            rooms: parseInt(formData.rooms) || 0,
            images: formData.images || [],
            marketing_status: formData.marketing_status || 'Disponible',
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
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Main Image */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase text-xs tracking-wide">Photo principale</label>
                            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${isDragActive ? 'border-[#C5A059] bg-yellow-50' : 'border-gray-300 hover:border-[#002B5B]'}`}>
                                <input {...getInputProps()} />
                                {formData.image_url ? (
                                    <div className="relative w-full h-full group">
                                        <img src={formData.image_url} alt="Aperçu" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                                            Changer
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 p-4">
                                        {uploading ? <p>...</p> : <><Upload size={32} className="mx-auto mb-2" /><p className="text-xs font-bold">Photo Principale</p></>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gallery Images */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase text-xs tracking-wide">Galerie Photos (Illimité)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl min-h-[16rem] p-4">
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {formData.images && formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#002B5B] hover:text-[#002B5B] text-gray-400 transition-colors aspect-square">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const files = Array.from(e.target.files);
                                                setUploading(true);
                                                for (const file of files) {
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `gallery-${Math.random()}.${fileExt}`;
                                                    const { error } = await supabase.storage.from('property-images').upload(fileName, file);
                                                    if (!error) {
                                                        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(fileName);
                                                        setFormData(prev => ({ ...prev, images: [...(prev.images || []), publicUrl] }));
                                                    }
                                                }
                                                setUploading(false);
                                            }}
                                        />
                                        <Upload size={20} />
                                        <span className="text-[10px] font-bold mt-1">Ajouter</span>
                                    </label>
                                </div>
                                <p className="text-center text-xs text-gray-400">Cliquez sur le + pour ajouter plusieurs photos à la suite.</p>
                            </div>
                        </div>
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

                <div className="grid md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Prix (€)</label>
                        <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Ex: 250000" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Surface (m²)</label>
                        <input required type="number" name="surface" value={formData.surface} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Ex: 120" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Chambres</label>
                        <input required type="number" name="rooms" value={formData.rooms || ''} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Ex: 3" />
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
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Type de Transaction</label>
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

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Statut Commercial (Bandeau)</label>
                            <select
                                name="marketing_status"
                                value={formData.marketing_status || 'Disponible'}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] bg-white font-bold text-[#C5A059]"
                            >
                                <option value="Disponible">Aucun (Disponible)</option>
                                <option value="Nouveauté">✨ Nouveauté</option>
                                <option value="Exclusivité">⭐️ Exclusivité</option>
                                <option value="Sous Offre">🤝 Sous Offre</option>
                                <option value="Sous Compromis">📝 Sous Compromis</option>
                                <option value="Vendu">🥂 Vendu</option>
                                <option value="Loué">🔑 Loué</option>
                                <option value="Baisse de prix">📉 Baisse de prix</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description complète</label>
                        <button
                            type="button"
                            onClick={() => {
                                const desc = formData.description.toLowerCase();
                                const newUpdates = {};
                                let detectedFeatures = [...(formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [])];

                                // 1. Detect Surface
                                const surfaceMatch = desc.match(/(\d+)(?:[.,]\d+)?\s*m[2²]/);
                                if (surfaceMatch && !formData.surface) newUpdates.surface = surfaceMatch[1];

                                // 2. Detect Rooms (Smart Sum)
                                // Looks for "3 chambres" or distinct mentions like "1 chambre... 2 chambres"
                                const roomMatches = [...desc.matchAll(/(\d+)\s*chambre/g)];
                                let totalRooms = 0;
                                if (roomMatches.length > 0) {
                                    roomMatches.forEach(m => totalRooms += parseInt(m[1]));
                                }
                                // Fallback: look for written numbers "une chambre", "deux chambres", etc? complicated for regex, let's stick to digits or check total mention "3 chambres"
                                if (totalRooms === 0 && desc.includes('chambre')) totalRooms = 1; // Default if mentioned but no number

                                // Specific logic for user example: "1 chambre" ... "2 chambres" -> sum is correct with loop above.
                                if (totalRooms > 0 && !formData.rooms) newUpdates.rooms = totalRooms;

                                // 3. Detect Features
                                const keywords = {
                                    'Jardin': ['jardin', 'terrain', 'parcelle', 'cour'],
                                    'Garage': ['garage', 'box'],
                                    'Terrasse': ['terrasse'],
                                    'Balcon': ['balcon'],
                                    'Cave': ['cave', 'sous-sol'],
                                    'Parking': ['parking', 'stationnement'],
                                    'Ascenseur': ['ascenseur'],
                                    'Sans travaux': ['rénové', 'neuf', 'aucun travaux', 'refait', 'impeccable', 'clé en main']
                                };

                                Object.entries(keywords).forEach(([feat, keys]) => {
                                    if (keys.some(k => desc.includes(k))) {
                                        if (!detectedFeatures.includes(feat)) detectedFeatures.push(feat);
                                    }
                                });

                                // Apply updates
                                setFormData(prev => ({
                                    ...prev,
                                    ...newUpdates,
                                    features: detectedFeatures.join(', ')
                                }));

                                alert("🪄 Analyse terminée !\n\nJ'ai détecté et rempli :\n" +
                                    (newUpdates.surface ? `- Surface : ${newUpdates.surface} m²\n` : '') +
                                    (newUpdates.rooms ? `- Chambres : ${newUpdates.rooms}\n` : '') +
                                    `- Atouts : ${detectedFeatures.join(', ')}`);
                            }}
                            className="text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:text-[#002B5B] transition-colors"
                        >
                            <Wand2 size={16} /> Remplissage Magique IA
                        </button>
                    </div>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows="12" className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]" placeholder="Collez votre description ici et cliquez sur le bouton magique..."></textarea>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">Caractéristiques & Atouts</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Jardin', 'Garage', 'Terrasse', 'Balcon', 'Cave', 'Parking', 'Ascenseur', 'Sans travaux'].map(feat => {
                            const isChecked = formData.features.includes(feat);
                            return (
                                <label key={feat} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isChecked ? 'bg-[#002B5B]/5 border-[#002B5B]' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                            const currentFeatures = formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [];
                                            let newFeatures;
                                            if (e.target.checked) {
                                                newFeatures = [...currentFeatures, feat];
                                            } else {
                                                newFeatures = currentFeatures.filter(f => f !== feat);
                                            }
                                            setFormData({ ...formData, features: newFeatures.join(', ') });
                                        }}
                                        className="w-5 h-5 accent-[#002B5B]"
                                    />
                                    <span className={`text-sm font-bold ${isChecked ? 'text-[#002B5B]' : 'text-gray-500'}`}>{feat}</span>
                                </label>
                            );
                        })}
                    </div>

                    <div className="mt-4">
                        <label className="text-xs font-bold text-gray-400 uppercase">Autres caractéristiques (Optionnel)</label>
                        <input
                            name="other_features"
                            placeholder="Ex: Cheminée, Cuisine équipée..."
                            className="w-full p-4 mt-2 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]"
                            // Logic for this field would need to parse/merge with the main features string, or we simplify and just say this input appends to the string. 
                            // For simplicity in this iteration, let's keep the main features input but labeled "Autres" and we handle the checkboxes separately in state? 
                            // Easier: The checkboxes edit the `features` string directly. The user can type more in the input below which APPENDS or EDITS the same string? 
                            // Better: Let's treat `features` string as the single source of truth.
                            value={formData.features}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">Vous pouvez aussi ajouter d'autres atouts manuellement, séparés par des virgules.</p>
                    </div>
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
