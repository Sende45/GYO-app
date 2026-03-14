import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Authenticator = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Utilisation de la route /login (plus logique pour un accès à l'espace)
      // Note : Assure-toi que l'URL correspond bien à ton backend Render
      const response = await fetch('https://gyo-backend.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Capture les messages d'erreur du backend (ex: "Mot de passe incorrect")
        throw new Error(data.message || "Erreur d'authentification");
      }

      // --- LES MODIFS ICI ---
      
      // 1. On stocke l'objet utilisateur (qui contient maintenant email et role à plat)
      localStorage.setItem('user', JSON.stringify(data));
      
      // 2. On stocke le token si ton backend en génère un (optionnel pour l'instant)
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // 3. Redirection intelligente basée sur le rôle retourné par Mongoose
      if (data.role === 'admin' || data.role === 'agent') {
        navigate('/admin-dashboard');
      } else {
        navigate('/mon-compte');
      }

    } catch (err) {
      setError(err.message || "Impossible de se connecter au serveur.");
      console.error("Erreur Auth:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <img src={logo} alt="GYO" className="h-12 mx-auto mb-8" />
          
          <form onSubmit={handleAuth} className="space-y-5">
            <input 
              type="email" 
              className="w-full bg-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              className="w-full bg-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-purple-500 transition-all disabled:opacity-50"
            >
              {isLoading ? "Vérification..." : "Accéder à mon espace"}
            </button>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-400 text-[10px] text-center uppercase mt-4 tracking-tighter"
              >
                {error}
              </motion.p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Authenticator;