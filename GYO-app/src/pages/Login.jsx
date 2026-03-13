import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios'; // Ton instance Axios vers MongoDB
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
    
    try {
      if (isRegistering) {
        // --- INSCRIPTION MONGODB ---
        const response = await api.post('/users/register', { 
          name: displayName, 
          email, 
          password 
        });
        
        if (response.data.user) {
          localStorage.setItem('gyo_user', JSON.stringify(response.data.user));
          navigate('/mon-compte');
        }
      } else {
        // --- CONNEXION MONGODB + BCRYPT ---
        const response = await api.post('/users/login', { email, password });
        
        if (response.data.user) {
          // On stocke l'utilisateur pour l'intercepteur Axios et verifyAdmin
          localStorage.setItem('gyo_user', JSON.stringify(response.data.user));
          
          // Redirection intelligente selon le rôle
          if (response.data.user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/mon-compte');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants incorrects ou erreur serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gyo-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo GYO" className="h-12 mx-auto mb-4" />
            <h2 className="text-xl font-light text-gyo-white tracking-[0.3em] uppercase">
              {isRegistering ? 'Créer un' : 'Mon Espace'} <span className="text-gyo-purple font-black">{isRegistering ? 'Compte' : 'Client'}</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] text-center mb-6 uppercase font-bold bg-red-500/10 py-2 rounded-lg tracking-widest">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <input 
                type="text" 
                placeholder="Nom complet"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-gyo-white focus:ring-1 focus:ring-gyo-purple outline-none transition-all"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            )}
            
            <input 
              type="email" 
              placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-gyo-white focus:ring-1 focus:ring-gyo-purple outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Mot de passe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-gyo-white focus:ring-1 focus:ring-gyo-purple outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gyo-purple transition-colors"
              >
                <span className="text-[10px] font-black uppercase">
                  {showPassword ? "Masquer" : "Afficher"}
                </span>
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gyo-purple text-gyo-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gyo-white hover:text-gyo-black transition-all duration-500 mt-4"
            >
              {isLoading ? 'Traitement...' : isRegistering ? 'S\'inscrire' : 'Connexion'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gyo-purple transition-colors"
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