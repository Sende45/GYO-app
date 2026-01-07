import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Vérifie bien que ce chemin est correct vers ton fichier firebase.js
import { auth, db } from '../firebase'; 
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // 1. Gérer l'état de l'utilisateur (Indispensable pour éviter la page blanche)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // 2. Charger les réservations une fois l'utilisateur détecté
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "bookings"),
      where("email", "==", currentUser.email)
    );

    const unsubscribeBookings = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribeBookings();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Annuler cette séance ?")) {
      await deleteDoc(doc(db, "bookings", id));
    }
  };

  // Ecran de chargement stylé pour éviter le blanc
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-black tracking-[0.5em] uppercase text-[10px] animate-pulse">
          Chargement GYO SPA...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 pt-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-purple-600 font-bold tracking-widest text-[10px] uppercase">Espace Privé</span>
            <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Mon <span className="text-gray-300">Activité</span></h1>
          </div>
          <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-red-500 border-b border-red-500 pb-1">
            Déconnexion
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-10 rounded-[3rem] bg-black text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/30 blur-3xl"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Crédits Soins</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black">{Math.max(0, 2 - bookings.length)}</span>
              <span className="text-xl font-bold text-purple-600">/ 2</span>
            </div>
          </div>
          <div className="p-10 rounded-[3rem] bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Compte Client</p>
            <h3 className="text-xl font-black truncate uppercase">{currentUser?.email.split('@')[0]}</h3>
            <p className="text-[10px] font-bold text-purple-600 mt-2 uppercase tracking-widest italic">Membre Privilège</p>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-[3rem] border border-gray-100 p-10">
          <h2 className="text-2xl font-black text-black mb-8 uppercase tracking-tighter">Mes réservations</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aucun rendez-vous planifié</p>
              <Link to="/reserver" className="text-purple-600 font-black text-[10px] uppercase tracking-widest mt-4 block underline">Réserver maintenant</Link>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {bookings.map((b) => (
                  <motion.div 
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center p-6 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    <div>
                      <h4 className="font-black text-black uppercase text-sm">{b.service}</h4>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">{b.date} • {b.time}</p>
                    </div>
                    <button onClick={() => deleteBooking(b.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;