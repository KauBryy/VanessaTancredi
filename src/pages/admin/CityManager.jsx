import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, X, FolderInput } from 'lucide-react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const SECTORS_OPTIONS = [
    "Bassin de Longwy & Frontières",
    "Cœur de Secteur (Pays-Haut)",
    "Secteur Longuyon & Environs",
    "Secteur Boulange / Audun"
];

const CityManager = () => {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Form
    const [newCity, setNewCity] = useState('');
    const [newSector, setNewSector] = useState(SECTORS_OPTIONS[0]);
    const [isCustomSector, setIsCustomSector] = useState(false);
    const [customSectorName, setCustomSectorName] = useState('');

    // Edit Form
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editSector, setEditSector] = useState('');

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        const { data, error } = await supabase
            .from('cities')
            .select('*')
            .order('sector', { ascending: true }) // Sort by sector first
            .order('name', { ascending: true }); // Then by name

        if (data) {
            setCities(data);
        }
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const cityToSave = newCity.trim();
        const sectorToSave = isCustomSector ? customSectorName.trim() : newSector;

        if (!cityToSave || !sectorToSave) return;

        try {
            const { error } = await supabase
                .from('cities')
                .insert([{ name: cityToSave, sector: sectorToSave }]);

            if (error) throw error;

            setNewCity('');
            if (isCustomSector) setCustomSectorName('');
            fetchCities();
        } catch (error) {
            console.error('Error adding city:', error);
            alert('Erreur: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) return;

        try {
            const { error } = await supabase
                .from('cities')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCities();
        } catch (error) {
            console.error('Error deleting city:', error);
            alert('Erreur: ' + error.message);
        }
    };

    const startEdit = (city) => {
        setEditingId(city.id);
        setEditName(city.name);
        setEditSector(city.sector || SECTORS_OPTIONS[0]);
    };

    const saveEdit = async () => {
        try {
            const { error } = await supabase
                .from('cities')
                .update({
                    name: editName.trim(),
                    sector: editSector
                })
                .eq('id', editingId);

            if (error) throw error;

            setEditingId(null);
            fetchCities();
        } catch (error) {
            console.error('Error updating city:', error);
            alert('Erreur: ' + error.message);
        }
    };

    // Group cities by sector for display
    const groupedCities = cities.reduce((acc, city) => {
        const sector = city.sector || "Autres";
        if (!acc[sector]) acc[sector] = [];
        acc[sector].push(city);
        return acc;
    }, {});

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-500" />
                </button>
                <h1 className="text-3xl font-black text-[#002B5B]">Gérer les Secteurs & Villes</h1>
            </div>

            {/* Add New City Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Ajouter une nouvelle ville</h3>
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <select
                            value={isCustomSector ? 'custom' : newSector}
                            onChange={(e) => {
                                if (e.target.value === 'custom') {
                                    setIsCustomSector(true);
                                } else {
                                    setIsCustomSector(false);
                                    setNewSector(e.target.value);
                                }
                            }}
                            className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] bg-white font-medium"
                        >
                            {SECTORS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            <option value="custom">+ Nouveau Secteur...</option>
                        </select>
                        {isCustomSector && (
                            <input
                                type="text"
                                value={customSectorName}
                                onChange={(e) => setCustomSectorName(e.target.value)}
                                placeholder="Nom du nouveau secteur"
                                className="w-full p-2 border border-[#C5A059] rounded-lg text-sm"
                                autoFocus
                            />
                        )}
                    </div>

                    <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Nom de la ville..."
                        className="flex-1 p-4 border border-gray-200 rounded-lg outline-none focus:border-[#002B5B]"
                    />

                    <Button type="submit" disabled={!newCity.trim() || (isCustomSector && !customSectorName.trim())} className="px-6 rounded-lg whitespace-nowrap">
                        <Plus size={20} className="mr-2" /> Ajouter
                    </Button>
                </form>
            </div>

            <div className="space-y-8">
                {Object.entries(groupedCities).map(([sector, cityList]) => (
                    <div key={sector} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-[#C5A059] uppercase tracking-wider text-sm flex items-center gap-2">
                                <FolderInput size={16} /> {sector}
                            </h3>
                            <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-200">{cityList.length} villes</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {cityList.map(city => (
                                <div key={city.id} className="p-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors">
                                    {editingId === city.id ? (
                                        <div className="flex-1 flex gap-2 mr-4">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="flex-1 p-2 border border-[#002B5B] rounded bg-white"
                                                placeholder="Nom de la ville"
                                            />
                                            {/* Optional: Allow moving sector during edit */}
                                            <select
                                                value={SECTORS_OPTIONS.includes(editSector) ? editSector : 'custom'}
                                                onChange={(e) => setEditSector(e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded bg-white text-xs"
                                            >
                                                {SECTORS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                {/* If current sector is not in options, show it */}
                                                {!SECTORS_OPTIONS.includes(editSector) && <option value={editSector}>{editSector}</option>}
                                            </select>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-gray-700">{city.name}</span>
                                    )}

                                    <div className="flex gap-2">
                                        {editingId === city.id ? (
                                            <>
                                                <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded">
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(city)}
                                                    className="p-2 text-gray-400 hover:text-[#002B5B] hover:bg-blue-50 rounded"
                                                    title="Modifier"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(city.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {cities.length === 0 && !loading && (
                    <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                        <p className="text-gray-400">Aucune ville configurée. Ajoutez votre première ville ci-dessus.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CityManager;
