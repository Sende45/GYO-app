import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';

const UserAccount = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // RÉCUPÉRATION UNIQUEMENT DES RÉSERVATIONS DE CE CLIENT
        const q = query(
          collection(db, "bookings"), 
          where("userId", "==", currentUser.uid)
        );
        
        const unsub = onSnapshot(q, (snapshot) => {
          setMyBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return unsub;
      }
    });
    return unsubscribeAuth;
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto pt-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black uppercase tracking-tighter mb-8"
        >
          Bienvenue, <span className="text-purple-500">{user?.displayName || 'Cher Membre'}</span>
        </motion.h1>

        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Mes Rendez-vous</h2>
          
          {myBookings.length === 0 ? (
            <p className="text-gray-500 italic text-sm">Vous n'avez pas encore de réservation.</p>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div>
                    <p className="font-bold text-lg">{booking.service}</p>
                    <p className="text-sm text-gray-400">{booking.date} à {booking.time}</p>
                  </div>
                  <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase ${
                    booking.status === 'Confirmé' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <button 
          onClick={() => auth.signOut()}
          className="mt-10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default UserAccount;