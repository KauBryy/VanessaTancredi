import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border-t-4 border-[#002B5B]">
                <h1 className="text-2xl font-black text-[#002B5B] mb-6 text-center">Espace Conseillère</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none"
                            placeholder="vanessa@borbiconi.immo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

                    <Button type="submit" className="w-full py-4 text-base" disabled={loading}>
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
