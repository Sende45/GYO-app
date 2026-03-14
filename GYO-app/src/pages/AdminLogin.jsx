import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios'; 
import logo from '../assets/logo.png'; 
import useGyoStore from '../store/useGyoStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { setUser } = useGyoStore();

  // Vérification de session au montage
  useEffect(() => {
    // MODIF : On utilise la clé 'user' cohérente
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Utilisation du chaînage optionnel ?.
        if (user?.role === 'admin' || user?.role === 'agent') {
          navigate('/admin-dashboard', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/users/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });

      // MODIF : Extraction robuste
      const userData = response.data.user || response.data;

      // ✅ LA MODIF CRUCIALE : userData?.role évite le crash si le serveur répond mal
      if (userData?.role === 'admin' || userData?.role === 'agent') {
        setUser(userData);
        
        // Stockage du token si présent pour les headers Axios
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }
        
        navigate('/admin-dashboard', { replace: true }); 
      } else {
        setError("Accès refusé. Réservé au staff GYO.");
      }

    } catch (err) {
      console.error("Erreur Login Admin:", err);
      // Gère les erreurs 500 ou les problèmes réseau sans faire planter l'UI
      const message = err.response?.data?.message || "Identifiants de sécurité incorrects ou erreur serveur.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-10 rounded-2xl shadow-2xl">
          <div className="text-center mb-10">
            <img src={logo} alt="Logo GYO" className="h-10 mx-auto mb-6 grayscale brightness-200" />
            <h2 className="text-sm font-black text-white tracking-[0.4em] uppercase">
              Terminal <span className="text-purple-500">Staff</span>
            </h2>
            <div className="h-1 w-12 bg-purple-500 mx-auto mt-4 rounded-full" />
          </div>

          {error && (
            <motion.div 
              initial={{ x: -10 }} animate={{ x: 0 }}
              className="bg-red-500/10 border-l-2 border-red-500 p-4 mb-6"
            >
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Identifiant Staff</label>
              <input 
                type="email" 
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-all"
                placeholder="admin@gyospa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Clé de sécurité</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Vérification...' : 'Initialiser la session'}
            </button>
          </form>

          <div className="mt-10 flex justify-between items-center opacity-30">
            <span className="text-[8px] text-white uppercase font-bold tracking-tighter">GYO System v2.0</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] text-green-500 uppercase font-bold">Encrypted Connection</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;