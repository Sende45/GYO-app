import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios'; 

const SuccessPage = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [planName, setPlanName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Récupérer l'utilisateur (Utilisation de la clé 'user' cohérente)
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // Si pas de session, redirection rapide
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }

    const currentUser = JSON.parse(userData);
    let intervalId;

    // 2. Vérification du statut sur MongoDB (attente du Webhook Stripe)
    const verifySubscription = async () => {
      try {
        const response = await api.get(`/users/profile/${currentUser.email}`);
        const profile = response.data;

        // On vérifie soit le statut d'abonnement, soit si des séances ont été ajoutées
        if (profile.subscription?.status === 'active' || profile.remainingSessions > 0) {
          setPlanName(profile.subscription?.planName || "Pack de Séances");
          setIsVerifying(false);
          
          // ✅ SYNC : Mise à jour du localStorage pour refléter les nouveaux crédits
          localStorage.setItem('user', JSON.stringify(profile));
          
          if (intervalId) clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Vérification en cours...", err.message);
      }
    };

    // 3. Boucle de vérification (le temps que Stripe parle à ton Backend)
    verifySubscription();
    intervalId = setInterval(verifySubscription, 4000); // Toutes les 4 secondes

    // Timeout de sécurité (45s)
    const safetyTimeout = setTimeout(() => {
        clearInterval(intervalId);
        // Si après 45s c'est toujours isVerifying, on affiche un message d'aide
    }, 45000);

    return () => {
      if (intervalId) clearInterval(intervalId);
      clearTimeout(safetyTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        
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
        
        <div className="h-24">
          {isVerifying ? (
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">
              Nous finalisons l'activation de votre accès Privilège...
            </p>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-lg font-medium leading-relaxed"
            >
              Votre forfait <span className="text-white font-black italic">{planName}</span> est désormais actif. 
              Préparez-vous pour l'excellence.
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
              className="bg-purple-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-500"
            >
              Mon Tableau de bord
            </Link>
            <Link 
              to="/reserver" 
              className="bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 hover:text-white transition-all duration-500"
            >
              Réserver mon soin
            </Link>
          </motion.div>
        )}

        {isVerifying && (
            <p className="mt-12 text-[9px] text-gray-700 uppercase tracking-widest">
                Ne fermez pas cette page, nous traitons votre commande.
            </p>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;