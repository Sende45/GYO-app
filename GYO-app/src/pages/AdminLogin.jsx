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

  useEffect(() => {
    // Changement ici : On utilise gyo_user
    const userData = localStorage.getItem('gyo_user');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const isStaff = user?.role === 'admin' || user?.role === 'agent';
        const isNotAlreadyOnDashboard = window.location.pathname !== '/admin-dashboard';

        if (isStaff && isNotAlreadyOnDashboard) {
          navigate('/admin-dashboard', { replace: true });
        }
      } catch (e) {
        console.error("Session corrompue, nettoyage...");
        localStorage.removeItem('gyo_user'); // Harmonisé
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

      const userData = response.data.user || response.data;

      if (userData?.role === 'admin' || userData?.role === 'agent') {
        setUser(userData);
        
        // --- MODIF : Stockage harmonisé sur gyo_user ---
        localStorage.setItem('gyo_user', JSON.stringify(userData));
        
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }
        
        navigate('/admin-dashboard', { replace: true }); 
      } else {
        setError("Accès refusé. Réservé au staff GYO.");
      }

    } catch (err) {
      console.error("Erreur Login Admin:", err);
      const message = err.response?.data?.message || "Identifiants de sécurité incorrects ou erreur serveur.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <img src={logo} alt="Logo GYO" className="h-10 mx-auto mb-6 grayscale brightness-200" />
            <h2 className="text-[10px] font-black text-white tracking-[0.5em] uppercase">
              Terminal <span className="text-purple-500">Staff</span>
            </h2>
            <div className="h-[2px] w-8 bg-purple-500 mx-auto mt-4 rounded-full" />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Identifiant Staff</label>
              <input type="email" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" placeholder="admin@gyospa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Clé de sécurité</label>
              <input type="password" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all duration-500 disabled:opacity-50">
              {isLoading ? 'Vérification...' : 'Initialiser la session'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
export default AdminLogin;