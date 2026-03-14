import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

const UserAccount = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // MODIF : Utilisation de la clé 'user' cohérente avec Login.jsx
      const storedData = localStorage.getItem('user');
      
      if (!storedData) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const storedUser = JSON.parse(storedData);
        
        // 1. Récupération du profil complet depuis MongoDB
        // On utilise l'email stocké pour récupérer les données à jour (crédits, sessions, etc.)
        const profileRes = await api.get(`/users/profile/${storedUser.email}`);
        setUserProfile(profileRes.data);

        // 2. Récupération des réservations
        // On filtre par email pour n'afficher que celles de l'utilisateur
        const bookingsRes = await api.get('/bookings');
        const userBookings = bookingsRes.data.filter(b => b.email === storedUser.email);
        setMyBookings(userBookings);

      } catch (err) {
        console.error("Erreur chargement données MongoDB:", err);
        // Si le profil n'est pas trouvé ou erreur d'auth, on déconnecte
        if (err.response?.status === 401 || err.response?.status === 404) {
          handleFullLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFullLogout = () => {
    // Nettoyage complet des traces locales
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    navigate('/', { replace: true });
    // Optionnel : reload pour réinitialiser tous les états de l'app
    window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-4xl mx-auto pt-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 flex justify-between items-end"
        >
          <div>
            <p className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Espace Privé</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Bienvenue, <span className="text-purple-500 italic">
                {userProfile?.firstName || userProfile?.name || userProfile?.email?.split('@')[0]}
              </span>
            </h1>
          </div>
        </motion.div>

        {/* SECTION ABONNEMENT (Données MongoDB dynamiques) */}
        {userProfile?.subscription?.status === 'active' || userProfile?.remainingSessions > 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mb-10 p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-900 shadow-2xl border border-white/10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Statut du Compte</p>
                <h3 className="text-3xl font-black uppercase italic">
                  {userProfile?.subscription?.planName || "Membre Actif"}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
                <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Séances Restantes</p>
                <p className="text-3xl font-black tracking-tighter">
                  {userProfile?.remainingSessions ?? userProfile?.subscription?.remainingSessions ?? 0}
                </p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
                <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Rôle</p>
                <p className="text-xl font-black tracking-tighter uppercase text-purple-300">
                  {userProfile?.role}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mb-10 p-10 rounded-[2.5rem] border border-dashed border-white/10 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Aucun abonnement ou crédit actif</p>
            <button 
              onClick={() => navigate('/abonnements')}
              className="text-purple-500 font-black text-[10px] uppercase tracking-widest border border-purple-500/30 px-6 py-3 rounded-full hover:bg-purple-500 hover:text-white transition-all"
            >
              Découvrir les offres
            </button>
          </div>
        )}

        {/* SECTION RÉSERVATIONS */}
        <div className="mt-12">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6">Mes Réservations</h2>
            {myBookings.length > 0 ? (
                <div className="space-y-4">
                    {myBookings.map((booking, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold uppercase">{booking.service}</p>
                                <p className="text-[10px] text-gray-400">{booking.date} à {booking.time}</p>
                            </div>
                            <span className="text-[9px] font-black px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full uppercase">Confirmé</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-[10px] uppercase font-bold">Aucune réservation en cours.</p>
            )}
        </div>

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