import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail // Ajout pour le reset
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import logo from '../assets/logo.png'; 

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // État pour masquer/afficher
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Pour le succès du reset
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction de réinitialisation du mot de passe
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Veuillez entrer votre email pour réinitialiser le mot de passe.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Lien de réinitialisation envoyé ! Vérifiez vos e-mails.");
      setError('');
    } catch (err) {
      setError("Erreur : impossible d'envoyer l'e-mail.");
    }
  };

  const createFirestoreUser = async (user, name) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: name || user.email.split('@')[0],
      email: user.email,
      role: 'client',
      createdAt: serverTimestamp(),
      subscription: {
        status: "inactive",
        planName: "Aucun",
        remainingSessions: 0
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createFirestoreUser(userCredential.user, displayName);
        navigate('/mon-compte');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'admin' || userData.role === 'agent') {
            setError("Veuillez utiliser l'interface administration.");
            await signOut(auth);
          } else {
            navigate('/mon-compte');
          }
        } else {
          await createFirestoreUser(user);
          navigate('/mon-compte');
        }
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError("Email déjà utilisé.");
      else if (err.code === 'auth/wrong-password') setError("Mot de passe incorrect.");
      else if (err.code === 'auth/user-not-found') setError("Compte introuvable.");
      else setError("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo GYO" className="h-12 mx-auto mb-4" />
            <h2 className="text-xl font-light text-white tracking-[0.3em] uppercase">
              {isRegistering ? 'Créer un' : 'Mon Espace'} <span className="text-purple-400 font-black">{isRegistering ? 'Compte' : 'Client'}</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] text-center mb-6 uppercase font-bold bg-red-500/10 py-2 rounded-lg tracking-widest">
                {error}
              </motion.p>
            )}
            {message && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-[10px] text-center mb-6 uppercase font-bold bg-green-500/10 py-2 rounded-lg tracking-widest">
                {message}
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
              {/* BOUTON MASQUER/AFFICHER */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
              >
                {showPassword ? (
                  <span className="text-[10px] font-black uppercase">Masquer</span>
                ) : (
                  <span className="text-[10px] font-black uppercase">Afficher</span>
                )}
              </button>
            </div>

            {!isRegistering && (
              <div className="text-right px-2">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-purple-400 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-500 mt-4"
            >
              {isLoading ? 'Traitement...' : isRegistering ? 'S\'inscrire' : 'Connexion'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); setMessage(''); }}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-purple-400 transition-colors"
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