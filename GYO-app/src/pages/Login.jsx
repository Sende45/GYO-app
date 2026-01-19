import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // SÉCURITÉ : Si c'est un admin qui tente de se connecter ici
        if (userData.role === 'admin' || userData.role === 'agent') {
          setError("Veuillez utiliser l'interface administration pour vous connecter.");
          await auth.signOut(); // Déconnexion automatique
        } else {
          navigate('/mon-compte');
        }
      } else {
        navigate('/mon-compte');
      }
    } catch (err) {
      setError("Identifiants incorrects. Veuillez vérifier vos informations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambiance Spa Douce */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black opacity-50" />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo GYO" className="h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-white tracking-[0.2em] uppercase">
              Mon Espace <span className="text-purple-400 font-bold">Client</span>
            </h2>
          </div>

          {error && <p className="text-red-400 text-[10px] text-center mb-4 uppercase tracking-widest">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="email" 
              placeholder="Email"
              className="w-full bg-white/10 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Mot de passe"
              className="w-full bg-white/10 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-purple-500 transition-all"
            >
              {isLoading ? 'Chargement...' : 'Se Connecter'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;