import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios'; // Vérifie que ton instance axios pointe vers https://gyo-backend.onrender.com/api
import logo from '../assets/logo.png'; 

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Formatage des données avant envoi
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      const endpoint = isRegistering ? '/users/register' : '/users/login';
      const payload = isRegistering 
        ? { firstName: displayName, email: cleanEmail, password } 
        : { email: cleanEmail, password };

      const response = await api.post(endpoint, payload);
      
      // Avec ton nouveau contrôleur, les données utilisateur sont soit dans response.data, 
      // soit dans response.data.user selon comment tu as finalisé le backend.
      // On teste les deux pour être robuste :
      const userData = response.data.user || response.data;

      if (userData && userData.email) {
        // IMPORTANT: Utilise la même clé que dans ton Dashboard ('user')
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Stockage du token si présent
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }

        // Redirection intelligente selon le rôle
        if (userData.role === 'admin' || userData.role === 'agent') {
          navigate('/admin-dashboard');
        } else {
          navigate('/mon-compte');
        }
      } else {
        throw new Error("Format de réponse invalide");
      }

    } catch (err) {
      console.error("Erreur Auth:", err);
      setError(err.response?.data?.message || "Identifiants incorrects ou erreur serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo GYO" className="h-12 mx-auto mb-4" />
            <h2 className="text-xl font-light text-white tracking-[0.3em] uppercase">
              {isRegistering ? 'Créer un' : 'Mon Espace'} <span className="text-purple-500 font-black">{isRegistering ? 'Compte' : 'Client'}</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="text-red-400 text-[10px] text-center mb-6 uppercase font-bold bg-red-500/10 py-2 rounded-lg tracking-widest"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <input 
                type="text" 
                placeholder="Nom complet"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            )}
            
            <input 
              type="email" 
              placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Mot de passe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-500 transition-colors"
              >
                <span className="text-[10px] font-black uppercase">
                  {showPassword ? "Masquer" : "Afficher"}
                </span>
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-500 mt-4 disabled:opacity-50"
            >
              {isLoading ? 'Traitement...' : isRegistering ? 'S\'inscrire' : 'Connexion'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-purple-500 transition-colors"
            >
              {isRegistering ? 'Déjà membre ? Se connecter' : 'Pas encore de compte ? S\'inscrire'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;