import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// FIREBASE AUTH & FIRESTORE
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import logo from '../assets/logo.png'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Connexion via Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Vérification stricte du rôle
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Autoriser uniquement Admin ou Agent
        if (userData.role === 'admin' || userData.role === 'agent') {
          navigate('/admin-dashboard'); 
        } else {
          // Si c'est un client, on le déconnecte immédiatement et on affiche une erreur
          setError("Accès refusé. Cette interface est réservée à l'administration.");
          await signOut(auth);
        }
      } else {
        setError("Profil non trouvé dans la base de données.");
        await signOut(auth);
      }

    } catch (err) {
      setError("Identifiants admin invalides.");
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative">
      {/* Design plus technique / sobre pour l'admin */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-[#0f0f0f] border-t-4 border-purple-600 p-10 rounded-xl shadow-2xl shadow-purple-900/20">
          
          <div className="text-center mb-10">
            <img src={logo} alt="Logo GYO" className="h-12 mx-auto mb-4 grayscale contrast-125" />
            <h2 className="text-xl font-mono text-white tracking-widest uppercase">
              Terminal <span className="text-purple-500 font-bold">Admin</span>
            </h2>
            <div className="h-[1px] w-20 bg-purple-600 mx-auto mt-2" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded mb-6">
              <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-tighter">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Identifiant Admin</label>
              <input 
                type="email" 
                required
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all mt-1"
                placeholder="admin@gyospa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Clé d'accès</label>
              <input 
                type="password" 
                required
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all mt-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                isLoading 
                ? 'bg-gray-800 text-gray-500' 
                : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98]'
              }`}
            >
              {isLoading ? 'Vérification...' : 'Accéder au Dashboard'}
            </button>
          </form>

          <p className="text-center mt-8 text-[9px] text-gray-600 uppercase tracking-[0.3em]">
            GYO Excellence Management v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;