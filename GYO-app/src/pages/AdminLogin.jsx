import React, { useState, useEffect } from 'react'; // Ajout de useEffect
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; // Ajout de onAuthStateChanged
import { doc, getDoc } from 'firebase/firestore'; 
import logo from '../assets/logo.png'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // AJOUT : Vérification au chargement
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === 'admin' || userDoc.data().role === 'agent')) {
          navigate('/admin-dashboard'); // Si déjà admin, on skip le login
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Authentification Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Récupération du rôle dans Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Vérification du grade (Admin ou Agent uniquement)
        if (userData.role === 'admin' || userData.role === 'agent') {
          console.log("Accès autorisé : " + userData.role);
          navigate('/admin-dashboard'); 
        } else {
          // Si c'est un rôle "client", on refuse l'accès
          setError("Accès refusé. Cette interface est réservée au staff GYO.");
          await signOut(auth); // Sécurité
        }
      } else {
        setError("Profil administrateur non configuré.");
        await signOut(auth);
      }

    } catch (err) {
      console.error("Erreur Login Admin:", err.code);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Identifiants de sécurité incorrects.");
      } else {
        setError("Erreur système : " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Technique */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-[#0f0f0f] border border-white/5 p-10 rounded-2xl shadow-2xl">
          
          <div className="text-center mb-10">
            <img src={logo} alt="Logo GYO" className="h-10 mx-auto mb-6 grayscale brightness-200" />
            <h2 className="text-sm font-black text-white tracking-[0.4em] uppercase">
              Terminal <span className="text-purple-500">Staff</span>
            </h2>
            <div className="h-1 w-12 bg-purple-600 mx-auto mt-4 rounded-full" />
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
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Identifiant</label>
              <input 
                type="email" 
                className="w-full bg-[#151515] border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-600 transition-all"
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
                className="w-full bg-[#151515] border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-600 transition-all"
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
              {isLoading ? 'Vérification en cours...' : 'Initialiser la session'}
            </button>
          </form>

          <div className="mt-10 flex justify-between items-center opacity-30">
            <span className="text-[8px] text-white uppercase font-bold tracking-tighter">GYO System v1.0</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] text-green-500 uppercase font-bold">Secure Connection</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;