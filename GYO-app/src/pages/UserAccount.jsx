import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // On utilise ton instance Axios
import { auth } from '../firebase'; // Gardé uniquement pour le signOut

const UserAccount = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [myGiftCards, setMyGiftCards] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const mongoUser = localStorage.getItem('gyo_user');
      
      if (!mongoUser) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const storedUser = JSON.parse(mongoUser);
        
        // ✅ 1. Récupération du profil complet depuis MongoDB
        const profileRes = await api.get(`/users/profile/${storedUser.email}`);
        setUserProfile(profileRes.data);

        // ✅ 2. Récupération des réservations (Tu devras créer cette route si elle n'existe pas)
        // Sinon, on peut filtrer les bookings généraux par email
        const bookingsRes = await api.get('/bookings');
        const userBookings = bookingsRes.data.filter(b => b.email === storedUser.email);
        setMyBookings(userBookings);

        // ✅ 3. Cartes Cadeaux (à adapter selon ton backend)
        setMyGiftCards([]); 

      } catch (err) {
        console.error("Erreur chargement données MongoDB:", err);
        // Si erreur 401/403, on déconnecte
        if (err.response?.status === 401) handleFullLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFullLogout = async () => {
    try {
      await auth.signOut(); // Déconnexion Firebase par sécurité
      localStorage.removeItem('gyo_user'); // Suppression session MongoDB
      navigate('/', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Erreur logout:", error);
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
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex justify-between items-end">
          <div>
            <p className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Espace Privé</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Bienvenue, <span className="text-purple-500 italic">{userProfile?.name || userProfile?.email?.split('@')[0] || 'Membre GYO'}</span>
            </h1>
          </div>
        </motion.div>

        {/* SECTION ABONNEMENT (MongoDB) */}
        {userProfile?.subscription?.status === 'active' ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-900 shadow-2xl border border-white/10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Abonnement Actif</p>
                <h3 className="text-3xl font-black uppercase italic">{userProfile.subscription.planName}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
                <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Séances Restantes</p>
                <p className="text-3xl font-black tracking-tighter">{userProfile.subscription.remainingSessions}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mb-10 p-6 rounded-3xl border border-dashed border-white/10 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Aucun abonnement actif</p>
          </div>
        )}

        {/* ... (Garder tes boutons de réservation et cartes cadeaux ici) ... */}

        <button 
          onClick={handleFullLogout}
          className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-red-500 transition-all w-full text-center border-t border-white/5 pt-8"
        >
          Déconnexion sécurisée
        </button>
      </div>
    </div>
  );
};

export default UserAccount;