import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserAccount = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [myGiftCards, setMyGiftCards] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      // On vérifie aussi s'il y a un utilisateur MongoDB
      const mongoUser = localStorage.getItem('gyo_user');
      
      if (currentUser || mongoUser) {
        // Si c'est un admin (MongoDB), on simule l'objet user pour l'affichage
        const finalUser = currentUser || JSON.parse(mongoUser);
        setUser(finalUser);

        // Récupération du profil (On garde Firebase pour les clients, mais on check MongoDB aussi)
        const unsubProfile = onSnapshot(doc(db, "users", finalUser.uid || finalUser._id), (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data());
          } else if (mongoUser) {
            setUserProfile(JSON.parse(mongoUser));
          }
          setLoading(false);
        });

        // ... (tes queries Bookings et Cards restent identiques)

        return () => unsubProfile();
      } else {
        navigate('/login', { replace: true });
      }
    });
    return unsubscribeAuth;
  }, [navigate]);

  // ✅ LA FONCTION DE DÉCONNEXION CORRIGÉE
  const handleFullLogout = async () => {
    try {
      // 1. Déconnexion Firebase
      await auth.signOut();
      
      // 2. Nettoyage MongoDB (LocalStorage)
      localStorage.removeItem('gyo_user');
      
      // 3. Redirection forcée vers l'accueil
      navigate('/', { replace: true });
      
      // 4. Petit refresh pour réinitialiser l'état global de App.js
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copié !");
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-4xl mx-auto pt-10">
        
        {/* Header Profil */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex justify-between items-end">
          <div>
            <p className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Espace Privé</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Bienvenue, <span className="text-purple-500 italic">{userProfile?.displayName || userProfile?.email?.split('@')[0] || 'Membre GYO'}</span>
            </h1>
          </div>
        </motion.div>

        {/* ... Reste de ton JSX (Abonnements, Actions Rapides, etc.) ... */}

        {/* ✅ BOUTON DE DÉCONNEXION MIS À JOUR */}
        <button 
          onClick={handleFullLogout}
          className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-red-500 transition-all w-full text-center border-t border-white/5 pt-8"
        >
          Déconnexion sécurisée (Clear Session)
        </button>
      </div>
    </div>
  );
};

export default UserAccount;