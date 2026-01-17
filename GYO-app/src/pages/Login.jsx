import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// FIREBASE AUTH & FIRESTORE
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
// IMPORT DU LOGO
import logo from '../assets/logo.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Authentification sécurisée
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Récupération du profil utilisateur dans Firestore
      // Indispensable pour distinguer les agents GATES des clients
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // 3. Redirection basée sur le rôle (Admin/Agent vs Client)
        if (userData.role === 'admin' || userData.role === 'agent') {
          // Accès au tableau de bord de gestion (Commandes, Poids, Logistique)
          navigate('/admin-dashboard'); 
        } else {
          // Accès à l'espace client standard
          navigate('/mon-compte');
        }
      } else {
        // Fallback si le document n'existe pas encore (nouveau client)
        navigate('/mon-compte');
      }

    } catch (err) {
      setError("Identifiants invalides. Veuillez réessayer.");
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Effets de lumière violette animés */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* SECTION LOGO GATES */}
          <div className="text-center mb-10">
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              src={logo} 
              alt="Logo GATES" 
              className="h-20 w-auto mx-auto mb-6 object-contain drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
            />
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              GATES <span className="text-purple-500">SERVICE</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                Accès Portail Sécurisé
            </p>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-400 text-[10px] font-bold uppercase text-center mb-6 tracking-widest"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-4">Adresse E-mail</label>
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white text-sm focus:outline-none focus:border-purple-600 transition-all placeholder:text-gray-600"
                placeholder="agent@gates.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-4">Mot de passe</label>
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white text-sm focus:outline-none focus:border-purple-600 transition-all placeholder:text-gray-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-500 mt-4 shadow-lg ${
                isLoading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-purple-600 hover:text-white shadow-purple-500/10'
              }`}
            >
              {isLoading ? 'Vérification...' : 'Se Connecter'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">
              GATES Centrafrique - Logistique & Transit [cite: 37]
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;