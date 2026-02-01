import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
      let user;
      try {
        // 1. Tentative de connexion
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } catch (authError) {
        // 2. Création automatique si l'utilisateur est nouveau
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
          const newCredential = await createUserWithEmailAndPassword(auth, email, password);
          user = newCredential.user;
          await createFirestoreUser(user, 'client');
        } else {
          throw authError;
        }
      }

      // 3. Vérification du rôle et redirection
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin' || userData.role === 'agent') {
          navigate('/admin-dashboard');
        } else {
          navigate('/mon-compte'); // Ton URL client actuelle
        }
      } else {
        await createFirestoreUser(user, 'client');
        navigate('/mon-compte');
      }

    } catch (err) {
      setError("Identifiants incorrects ou erreur réseau.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createFirestoreUser = async (user, role) => {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role,
      createdAt: serverTimestamp(),
      subscription: {
        status: "active", // On peut l'activer par défaut pour le test
        planName: "Découverte",
        remainingSessions: 1
      }
    });
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
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              className="w-full bg-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mot de passe" 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-purple-500 transition-all"
            >
              {isLoading ? "Vérification..." : "Accéder à mon espace"}
            </button>
            {error && <p className="text-red-400 text-[10px] text-center uppercase mt-4">{error}</p>}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Authenticator;