import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const SuccessPage = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [planName, setPlanName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Vérifier si l'utilisateur est connecté
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // 2. Écouter les changements sur le profil pour confirmer l'activation
        const unsubProfile = onSnapshot(doc(db, "users", user.uid), (doc) => {
          if (doc.exists() && doc.data().subscription?.status === 'active') {
            setPlanName(doc.data().subscription.planName);
            setIsVerifying(false); // L'abonnement est bien activé !
          }
        });
        return () => unsubProfile();
      } else {
        // Si pas de user, redirection après 5s
        setTimeout(() => navigate('/login'), 5000);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* Icône de succès ou Chargement */}
        <div className="relative mb-10 inline-block">
          {isVerifying ? (
             <div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          ) : (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative bg-purple-600 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(147,51,234,0.4)]"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </div>

        <span className="block text-purple-500 font-black tracking-[0.5em] text-[10px] uppercase mb-4">
          {isVerifying ? "Validation du paiement..." : "Paiement Confirmé"}
        </span>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
          {isVerifying ? "Presque" : "Bienvenue"} <br />
          <span className="text-purple-600 italic">{isVerifying ? "Prêt" : "Au Club"}</span>
        </h1>
        
        <div className="h-24"> {/* Hauteur fixe pour éviter le saut de texte */}
          {isVerifying ? (
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">
              Nous finalisons l'activation de votre accès Privilège...
            </p>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-lg font-medium leading-relaxed mb-12"
            >
              Votre forfait <span className="text-white font-black italic">{planName}</span> est désormais actif. 
              Vous faites partie de l'élite GYO Excellence.
            </motion.p>
          )}
        </div>

        {!isVerifying && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link 
              to="/mon-compte" 
              className="bg-purple-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-purple-500/20"
            >
              Accéder à mon espace
            </Link>
            <Link 
              to="/reserver" 
              className="bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 hover:text-white transition-all duration-500"
            >
              Réserver mon soin
            </Link>
          </motion.div>
        )}

        {/* Support Client GYO */}
        <p className="mt-16 text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">
          Besoin d'aide ? Conciergerie GYO : <span className="text-gray-400">+225 00 00 00 00 00</span>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
