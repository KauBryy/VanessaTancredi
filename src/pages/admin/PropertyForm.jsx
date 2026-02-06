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
    const [citiesList, setCitiesList] = useState([]);

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
        features: '',
        dpe_energy: '', // A-G
        dpe_ges: '', // A-G
        is_favorite: false // Coup de Cœur
    });

    useEffect(() => {
        const fetchCities = async () => {
            const { data } = await supabase
                .from('cities')
                .select('*')
                .order('name', { ascending: true });
            if (data) setCitiesList(data);
        };
        fetchCities();
    }, []);

    // Fetch data if edit mode OR check for import params
    useEffect(() => {
        // 1. Edit Mode
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

        // 2. Import Mode (from Extension / SessionStorage)
        const loadImportData = () => {
            try {
                const stored = sessionStorage.getItem('import_data');
                if (stored) {
                    const data = JSON.parse(stored);

                    // Clear it so it doesn't re-import on refresh if unwanted
                    sessionStorage.removeItem('import_data');

                    if (data.description || (data.images && data.images.length > 0)) {
                        setFormData(prev => {
                            const newImgs = data.images || [];
                            return {
                                ...prev,
                                description: data.description || prev.description,
                                images: [...(prev.images || []), ...newImgs],
                                image_url: (!prev.image_url && newImgs.length > 0) ? newImgs[0] : prev.image_url
                            };
                        });
                        alert("Données importées avec succès !");
                    }
                }
            } catch (e) {
                console.error("Error loading import data", e);
            }
        };

        // Check immediately
        loadImportData();

        // Also listen for the event (in case the tab was already open/loading)
        const eventListener = () => loadImportData();
        window.addEventListener('import_data_ready', eventListener);

        // Keep the old URL param logic as a backup just in case
        const getParams = () => {
            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams.toString()) return searchParams;
            if (window.location.hash.includes('?')) {
                const hashQuery = window.location.hash.split('?')[1];
                return new URLSearchParams(hashQuery);
            }
            return new URLSearchParams();
        };

        const params = getParams();
        const importDesc = params.get('import_desc');
        if (importDesc) {
            // Fallback logic for basic imports
            // ...
        }

        return () => window.removeEventListener('import_data_ready', eventListener);
    }, [isEditMode, id]);

    // IMAGE COMPRESSION HELPER
    const compressImage = (file, maxWidth = 2000) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    // Calculate new dimensions
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    } else {
                        // Image already small enough, skip compression/resize
                        return resolve(file);
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.85); // 85% quality is visually indistinguishable from 100% but 5x smaller
                };
            };
        });
    };

    // Handle Image Upload
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        try {
            // OPTIMISATION : Compresser avant l'envoi
            const optimizedFile = await compressImage(file);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(filePath, optimizedFile);

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
            alert(`Erreur lors de la sauvegarde : ${error.message || error.details || JSON.stringify(error)}`);
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
                                                    // OPTIMISATION : Compresser avant l'envoi
                                                    const optimizedFile = await compressImage(file);
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `gallery-${Math.random()}.${fileExt}`;
                                                    const { error } = await supabase.storage.from('property-images').upload(fileName, optimizedFile);
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
                        <select
                            required
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B] bg-white"
                        >
                            <option value="">Sélectionner une ville</option>
                            {citiesList.map(city => (
                                <option key={city.id} value={city.name}>{city.name}</option>
                            ))}
                        </select>
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
                        <label className="text-xs font-bold text-gray-500 uppercase">Type d'offre</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B] bg-white">
                            <option value="Vente">Vente</option>
                            <option value="Location">Location</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-[#F4F7FA] p-4 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_favorite ? 'bg-[#C5A059]' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.is_favorite ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <input
                            type="checkbox"
                            name="is_favorite"
                            checked={formData.is_favorite}
                            onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
                            className="hidden"
                        />
                        <span className="font-bold text-[#002B5B] group-hover:text-[#C5A059] transition-colors flex items-center gap-2">
                            ❤️ Coup de Cœur Vanessa (Afficher en Une)
                        </span>
                    </label>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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

                                <option value="Baisse de prix">📉 Baisse de prix</option>
                                <option value="Loué">🤝 Loué (Location)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">DPE (Énergie)</label>
                            <select name="dpe_energy" value={formData.dpe_energy} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B] bg-white">
                                <option value="">Non renseigné</option>
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => (
                                    <option key={l} value={l}>Classe {l}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">GES (Climat)</label>
                            <select name="dpe_ges" value={formData.dpe_ges} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B] bg-white">
                                <option value="">Non renseigné</option>
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => (
                                    <option key={l} value={l}>Classe {l}</option>
                                ))}
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
                                const desc = formData.description; // Keep case for some checks
                                const descLower = desc.toLowerCase();
                                const newUpdates = {};
                                let detectedFeatures = [...(formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [])];

                                // 1. Detect Surface
                                const surfaceMatch = descLower.match(/(\d+(?:[.,]\d+)?)\s*m[2²]/);
                                if (surfaceMatch && !formData.surface) newUpdates.surface = surfaceMatch[1].replace(',', '.');

                                // 2. Detect Rooms
                                const roomMatches = [...descLower.matchAll(/(\d+)\s*chambre/g)];
                                let totalRooms = 0;
                                if (roomMatches.length > 0) {
                                    roomMatches.forEach(m => totalRooms += parseInt(m[1]));
                                }
                                if (totalRooms === 0 && descLower.includes('chambre')) totalRooms = 1;
                                if (totalRooms > 0 && !formData.rooms) newUpdates.rooms = totalRooms;

                                // 3. Detect Price
                                const priceMatch = desc.match(/(\d[\d\s]*)(?:€|euros)/i);
                                if (priceMatch && !formData.price) {
                                    newUpdates.price = priceMatch[1].replace(/\s/g, '');
                                }

                                // 4. Detect Type (Fix false positives for 'commercial')
                                // We check specific keywords. We prioritize specific types.
                                // "Local Commercial" is only detected if 'local commercial' is found explicitly, or 'bureau'
                                // We ignore 'commercial' alone because of 'agent commercial'
                                if (descLower.includes('appartement') || descLower.includes('studio') || descLower.includes('f2') || descLower.includes('f3')) newUpdates.type = 'Appartement';
                                else if (descLower.includes('terrain') || descLower.includes('parcelle')) newUpdates.type = 'Terrain';
                                else if (descLower.includes('immeuble')) newUpdates.type = 'Immeuble';
                                else if (descLower.includes('local commercial') || descLower.includes('bureau') || descLower.includes('fonds de commerce')) newUpdates.type = 'Local Commercial';
                                else if (descLower.includes('maison') || descLower.includes('pavillon') || descLower.includes('villa') || descLower.includes('fermette')) newUpdates.type = 'Maison';

                                // 5. Detect City (Priority to first mention in text)
                                const localCities = citiesList.length > 0 ? citiesList.map(c => c.name) : [
                                    'Longwy', 'Longuyon', 'Mercy-le-Bas', 'Villerupt', 'Audun-le-Roman', 'Piennes',
                                    'Bouligny', 'Boulange', 'Aumetz', 'Herserange', 'Lexy', 'Réhon', 'Mont-Saint-Martin',
                                    'Gorcy', 'Cosnes-et-Romain', 'Haucourt-Moulaine', 'Saulnes', 'Ugny', 'Doncourt',
                                    'Baslieux', 'Pierrepont', 'Arrancy', 'Beuveille', 'Boismont', 'Spincourt', 'Trieux',
                                    'Tucquegnieux', 'Joudreville', 'Mancieulles', 'Landres', 'Murville', 'Preutin'
                                ];

                                // Find the first city mentioned in the description
                                let firstCityIndex = Infinity;
                                let bestCity = null;

                                localCities.forEach(city => {
                                    const index = descLower.indexOf(city.toLowerCase());
                                    if (index !== -1 && index < firstCityIndex) {
                                        firstCityIndex = index;
                                        bestCity = city;
                                    }
                                });

                                if (bestCity && !formData.city) newUpdates.city = bestCity;

                                // 6. Detect DPE / GES
                                const dpeMatch = desc.match(/DPE\s*[:\s-]*([A-G])/i) || desc.match(/classe\s*énergie\s*[:\s-]*([A-G])/i) || desc.match(/énergie\s*[:\s-]*([A-G])/i);
                                if (dpeMatch && !formData.dpe_energy) newUpdates.dpe_energy = dpeMatch[1].toUpperCase();

                                const gesMatch = desc.match(/GES\s*[:\s-]*([A-G])/i) || desc.match(/classe\s*climat\s*[:\s-]*([A-G])/i) || desc.match(/climat\s*[:\s-]*([A-G])/i);
                                if (gesMatch && !formData.dpe_ges) newUpdates.dpe_ges = gesMatch[1].toUpperCase();

                                // 7. Detect Features
                                const keywords = {
                                    'Jardin': ['jardin', 'terrain', 'parcelle', 'cour '],
                                    'Garage': ['garage', 'box'],
                                    'Terrasse': ['terrasse'],
                                    'Balcon': ['balcon'],
                                    'Cave': ['cave', 'sous-sol'],
                                    'Parking': ['parking', 'stationnement', 'place'],
                                    'Ascenseur': ['ascenseur'],
                                    'Sans travaux': ['rénové', 'neuf', 'aucun travaux', 'refait', 'impeccable', 'clé en main']
                                };

                                Object.entries(keywords).forEach(([feat, keys]) => {
                                    if (keys.some(k => descLower.includes(k))) {
                                        if (!detectedFeatures.includes(feat)) detectedFeatures.push(feat);
                                    }
                                });

                                // 8. Auto-Generate Title
                                if (!formData.title) {
                                    const type = newUpdates.type || formData.type || 'Bien';
                                    const ville = newUpdates.city || formData.city || '';
                                    const surface = newUpdates.surface || formData.surface || '';
                                    let title = `${type}`;
                                    if (surface) title += ` ${surface}m²`;
                                    if (ville) title += ` à ${ville}`;
                                    newUpdates.title = title;
                                }

                                // Apply updates
                                setFormData(prev => ({
                                    ...prev,
                                    ...newUpdates,
                                    features: detectedFeatures.join(', ')
                                }));

                                const summary = Object.keys(newUpdates).map(k => `- ${k}: ${newUpdates[k]}`).join('\n');
                                const featuresSummary = detectedFeatures.length > 0 ? `- Atouts: ${detectedFeatures.join(', ')}` : '';

                                alert(`🪄 Analyse terminée !\n\nChamps remplis :\n${summary}\n${featuresSummary}`);
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
