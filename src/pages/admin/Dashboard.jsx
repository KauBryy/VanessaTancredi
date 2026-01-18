import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, LayoutDashboard } from 'lucide-react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setProperties(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûre de vouloir supprimer ce bien ?')) {
            await supabase.from('properties').delete().eq('id', id);
            fetchProperties(); // Refresh
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Bar for Admin */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#002B5B] text-white p-2 rounded-lg">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <h1 className="font-black text-[#002B5B] text-xl leading-none">Espace Vanessa</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Gestion des biens</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link to="/" target="_blank">
                            <Button variant="ghost" className="hidden md:flex">Voir le site</Button>
                        </Link>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                            <LogOut size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Vos Annonces ({properties.length})</h2>
                    <Button onClick={() => navigate('/admin/new')} className="shadow-lg shadow-blue-900/10 rounded-xl">
                        <Plus size={20} /> Ajouter un bien
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Chargement...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
                                        <th className="p-4">Bien</th>
                                        <th className="p-4">Prix</th>
                                        <th className="p-4">Ville</th>
                                        <th className="p-4">Statut</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {properties.map(property => (
                                        <tr key={property.id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="p-4 flex items-center gap-4">
                                                <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                    <img src={property.image_url || property.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#002B5B] truncate max-w-xs">{property.title}</p>
                                                    <p className="text-xs text-gray-400">{property.type}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold text-gray-600">{new Intl.NumberFormat('fr-FR').format(property.price)} €</td>
                                            <td className="p-4 text-sm text-gray-500">{property.city}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${property.status === 'Vente' ? 'bg-[#002B5B]/10 text-[#002B5B]' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                                                    {property.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/edit/${property.id}`)}
                                                        className="p-2 hover:bg-gray-100 rounded text-gray-500 hover:text-[#002B5B]"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(property.id)}
                                                        className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {properties.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-gray-400">
                                                Vous n'avez ajouté aucun bien pour le moment.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
