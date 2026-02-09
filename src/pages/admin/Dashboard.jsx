import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, LayoutDashboard, MapPin, TrendingUp, Users, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
        fetchStats();

        // Check opting out status
        const isOptOut = localStorage.getItem('admin_opt_out') === 'true';
        setNotTrackingMe(isOptOut);
    }, []);

    const [stats, setStats] = useState({
        visitors24h: 0,
        views24h: 0,
        visitors7d: 0,
        visitors30d: 0
    });
    const [notTrackingMe, setNotTrackingMe] = useState(false);

    const toggleOptOut = () => {
        const newValue = !notTrackingMe;
        setNotTrackingMe(newValue);
        localStorage.setItem('admin_opt_out', newValue);
        alert(newValue ? "Vos visites ne seront plus comptées dans les statistiques." : "Vos visites sont de nouveau comptées.");
    };

    const fetchStats = async () => {
        // Calculate date thresholds
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString();

        try {
            // Get all stats for last 30 days to process locally (simpler than complex SQL grouping for now)
            const { data, error } = await supabase
                .from('site_stats')
                .select('visitor_id, created_at')
                .gte('created_at', thirtyDaysAgo)
                .order('created_at', { ascending: false })
                .limit(10000);

            if (error) throw error;

            if (data) {
                // Filter arrays
                const stats24h = data.filter(d => d.created_at >= oneDayAgo);
                const stats7d = data.filter(d => d.created_at >= sevenDaysAgo);

                // Unique Visitors Sets
                const unique24h = new Set(stats24h.map(d => d.visitor_id)).size;
                const unique7d = new Set(stats7d.map(d => d.visitor_id)).size;
                const unique30d = new Set(data.map(d => d.visitor_id)).size;

                setStats({
                    visitors24h: unique24h,
                    views24h: stats24h.length,
                    visitors7d: unique7d,
                    visitors30d: unique30d
                });
            }
        } catch (e) {
            console.error("Error fetching stats:", e);
        }
    };

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

    const handleToggleFavorite = async (id) => {
        // Optimistic update locally
        const newProperties = properties.map(p => {
            if (p.id === id) {
                // If we are clicking the one that is already favorite, we toggle it off.
                // If we are clicking a new one, it becomes favorite.
                return { ...p, is_favorite: !p.is_favorite };
            }
            // If we are clicking a new one (to ON), all others must be OFF.
            // If we are toggling OFF the current favorite, others remain OFF.
            // Wait, logic: if clicking ID and it wasn't favorite -> It Becomes Favorite (Unique). Others become false.
            // If clicking ID and it WAS favorite -> It becomes false. Others remain false.
            if (!properties.find(prop => prop.id === id).is_favorite) {
                return { ...p, is_favorite: false };
            }
            return p;
        });

        setProperties(newProperties);

        // Perform actual update
        const targetProp = properties.find(p => p.id === id);
        const isTurningOn = !targetProp.is_favorite;

        if (isTurningOn) {
            // Disable all others first
            await supabase.from('properties').update({ is_favorite: false }).neq('id', id);
            // Enable target
            await supabase.from('properties').update({ is_favorite: true }).eq('id', id);
        } else {
            // Just disable target
            await supabase.from('properties').update({ is_favorite: false }).eq('id', id);
        }

        fetchProperties(); // Refresh to be sure
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Bar for Admin */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#002B5B] text-white p-2 rounded-lg shadow-lg shadow-blue-900/20">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <h1 className="font-black text-[#002B5B] text-xl leading-none">Espace Vanessa</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Gestion des biens</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <button
                            onClick={toggleOptOut}
                            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase border transition-all ${notTrackingMe ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}
                            title="Empêche de compter vos propres visites dans les statistiques"
                        >
                            {notTrackingMe ? <EyeOff size={16} /> : <Eye size={16} />}
                            {notTrackingMe ? 'Tracking Désactivé' : 'Tracking Activé'}
                        </button>

                        <Link to="/" target="_blank">
                            <Button variant="ghost" className="hidden md:flex">Voir le site</Button>
                        </Link>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                            <LogOut size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Visiteurs (24h)</p>
                            <p className="text-3xl font-black text-[#002B5B]">{stats.visitors24h}</p>
                            <p className="text-xs text-gray-400 mt-1">{stats.views24h} pages vues</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-[#002B5B] rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Visiteurs (7 jours)</p>
                            <p className="text-3xl font-black text-[#002B5B]">{stats.visitors7d}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Visiteurs (30 jours)</p>
                            <p className="text-3xl font-black text-[#002B5B]">{stats.visitors30d}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#002B5B] to-[#001B3B] p-6 rounded-2xl shadow-lg shadow-blue-900/20 text-white flex items-center justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Biens</p>
                            <p className="text-3xl font-black text-white">{properties.length}</p>
                            <p className="text-xs text-white/40 mt-1">En ligne</p>
                        </div>
                        <div className="relative z-10 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <LayoutDashboard size={24} />
                        </div>
                        {/* Decor */}
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Vos Annonces ({properties.length})</h2>
                    <div className="flex gap-4">
                        <Button onClick={() => navigate('/admin/cities')} variant="outline" className="rounded-xl">
                            <MapPin size={20} className="mr-2" /> Gérer les Villes
                        </Button>
                        <Button onClick={() => navigate('/admin/new')} className="shadow-lg shadow-blue-900/10 rounded-xl">
                            <Plus size={20} /> Ajouter un bien
                        </Button>
                    </div>
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
                                        <tr key={property.id} className={`transition-colors ${property.is_favorite ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-blue-50/50'}`}>
                                            <td className="p-4 flex items-center gap-4">
                                                <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                                                    <img src={property.image_url || property.image} alt="" className="w-full h-full object-cover" />
                                                    {property.is_favorite && <div className="absolute inset-0 bg-yellow-500/20 ring-2 ring-inset ring-[#C5A059]"></div>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#002B5B] truncate max-w-xs flex items-center gap-2">
                                                        {property.title}
                                                        {property.is_favorite && <span className="text-xs text-[#C5A059]">❤️ Une</span>}
                                                    </p>
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
                                                        onClick={() => handleToggleFavorite(property.id)}
                                                        className={`p-2 rounded transition-colors ${property.is_favorite ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'hover:bg-gray-100 text-gray-300 hover:text-red-400'}`}
                                                        title={property.is_favorite ? "Retirer des favoris" : "Mettre en UNE (Remplace l'actuel)"}
                                                    >
                                                        <span className={property.is_favorite ? "text-lg" : "text-lg grayscale opacity-50"}>❤️</span>
                                                    </button>
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
