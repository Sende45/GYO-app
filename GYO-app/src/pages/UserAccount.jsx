import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Ajouté pour la redirection

const UserAccount = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [myGiftCards, setMyGiftCards] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const unsubProfile = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          if (doc.exists()) setUserProfile(doc.data());
          setLoading(false);
        });

        const qBookings = query(
          collection(db, "bookings"), 
          where("userId", "==", currentUser.uid)
        );
        const unsubBookings = onSnapshot(qBookings, (snapshot) => {
          setMyBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qCards = query(
          collection(db, "gift_cards"), 
          where("userId", "==", currentUser.uid)
        );
        const unsubCards = onSnapshot(qCards, (snapshot) => {
          setMyGiftCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
          unsubProfile();
          unsubBookings();
          unsubCards();
        };
      } else {
        navigate('/'); // Rediriger vers l'accueil si déconnecté
      }
    });
    return unsubscribeAuth;
  }, [navigate]);

  // Fonction pour copier le code de la carte cadeau
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
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-between items-end"
        >
          <div>
            <p className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Espace Privé</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Bienvenue, <span className="text-purple-500 italic">{userProfile?.displayName || userProfile?.email?.split('@')[0] || 'Membre GYO'}</span>
            </h1>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-[10px] text-gray-500 uppercase font-bold">ID Membre</p>
             <p className="text-[10px] font-mono text-gray-400">{user?.uid.substring(0,8)}...</p>
          </div>
        </motion.div>

        {/* SECTION ABONNEMENT */}
        {userProfile?.subscription?.status === 'active' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-900 shadow-2xl shadow-purple-500/20 border border-white/10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Abonnement Actif</p>
                <h3 className="text-3xl font-black uppercase italic">{userProfile.subscription.planName}</h3>
              </div>
              <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-tighter">
                  Expire le : {userProfile.subscription.expiryDate ? userProfile.subscription.expiryDate.toDate().toLocaleDateString() : "Non définie"}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
                <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Séances Restantes</p>
                <p className="text-3xl font-black tracking-tighter">{userProfile.subscription.remainingSessions}</p>
              </div>
              <div className="bg-white/10 p-5 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
                <p className="text-[9px] uppercase font-bold opacity-60 mb-2">Avantage Membre</p>
                <p className="text-[10px] font-black uppercase text-purple-200">Accès Prioritaire & -15%</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mb-10 p-6 rounded-3xl border border-dashed border-white/10 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Aucun abonnement actif</p>
          </div>
        )}

        {/* AJOUT : ACTIONS RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => navigate('/reserver')}
            className="group bg-white text-black p-6 rounded-3xl flex items-center justify-between hover:bg-purple-600 hover:text-white transition-all duration-500 shadow-xl shadow-white/5"
          >
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">Prêt pour votre séance ?</p>
              <p className="text-xl font-black uppercase italic">Réserver un créneau</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button 
            onClick={() => navigate('/abonnements')}
            className="group bg-[#111] border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:border-purple-500 transition-all duration-500"
          >
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-purple-500">Besoin de plus ?</p>
              <p className="text-xl font-black uppercase italic">Recharger mes séances</p>
            </div>
            <span className="text-2xl opacity-30 group-hover:opacity-100 group-hover:text-purple-500 group-hover:rotate-90 transition-all">+</span>
          </button>
        </div>

        {/* AJOUT : HISTORIQUE DES TRANSACTIONS */}
        <section className="mb-10">
          <details className="group bg-white/5 border border-white/5 rounded-[1.5rem] overflow-hidden">
            <summary className="list-none p-6 cursor-pointer flex justify-between items-center group-hover:bg-white/[0.02] transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Historique des transactions</span>
              <span className="text-xs group-open:rotate-180 transition-transform opacity-30">↓</span>
            </summary>
            <div className="p-6 border-t border-white/5 space-y-4">
              {userProfile?.subscription?.planName ? (
                <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter">Abonnement {userProfile.subscription.planName}</p>
                    <p className="text-[8px] text-gray-500 uppercase">Paiement via Stripe</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-green-400">SUCCESS</span>
                </div>
              ) : (
                <p className="text-[9px] text-gray-500 uppercase text-center italic">Aucune transaction enregistrée</p>
              )}
            </div>
          </details>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* MES RÉSERVATIONS */}
          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl h-fit">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              Mes Rendez-vous
            </h2>
            
            {myBookings.length === 0 ? (
              <p className="text-gray-500 italic text-xs uppercase tracking-widest font-bold py-4">Aucun rendez-vous prévu</p>
            ) : (
              <div className="space-y-4">
                {myBookings.sort((a,b) => b.createdAt - a.createdAt).map((booking) => (
                  <div key={booking.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-purple-500/50 transition-all">
                    <p className="font-black text-xs uppercase tracking-tighter mb-1 group-hover:text-purple-400 transition-colors">{booking.service}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{booking.date} • {booking.time}</p>
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        booking.status === 'Confirmé' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* MES CARTES CADEAUX */}
          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Mes Cartes Cadeaux</h2>
            
            {myGiftCards.length === 0 ? (
              <p className="text-gray-500 italic text-xs uppercase tracking-widest font-bold py-4">Aucune carte achetée</p>
            ) : (
              <div className="space-y-4">
                {myGiftCards.map((card) => (
                  <div key={card.id} className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-600/10 blur-2xl group-hover:bg-purple-600/30 transition-all" />
                    <p className="text-[9px] uppercase font-bold text-gray-500 mb-2">Code (cliquer pour copier)</p>
                    <button 
                      onClick={() => copyToClipboard(card.code)}
                      className="font-mono text-lg font-black tracking-widest text-white mb-4 hover:text-purple-400 transition-colors text-left w-full"
                    >
                      {card.code}
                    </button>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-black">{card.amount}€</p>
                      <p className={`text-[8px] font-black uppercase ${card.isUsed ? 'text-red-500' : 'text-green-500'}`}>
                        {card.isUsed ? 'Utilisée' : 'Disponible'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        <button 
          onClick={() => auth.signOut()}
          className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-red-500 transition-all w-full text-center border-t border-white/5 pt-8"
        >
          Déconnexion sécurisée
        </button>
      </div>
    </div>
  );
};

export default UserAccount;