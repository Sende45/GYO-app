import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { auth } from '../firebase'; 
import axios from 'axios';

const GiftCards = () => {
  const [amount, setAmount] = useState(30000); // Montant par défaut en FCFA
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Configuration des montants prédéfinis (Plus adaptés au SPA à Abidjan)
  const quickAmounts = [30000, 50000, 100000];

  const handlePurchase = async () => {
    if (!recipient) return alert("Veuillez saisir le nom du bénéficiaire");
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Veuillez vous connecter pour offrir une carte cadeau.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Appel à ton backend pour créer une session Stripe spéciale GiftCard
      const response = await axios.post('https://gyo-backend.onrender.com/api/payments/create-checkout-session', {
        userId: currentUser.uid,
        email: currentUser.email,
        planName: `Carte Cadeau pour ${recipient}`,
        amount: amount, // Le montant choisi
        category: 'GiftCard', // Crucial pour la logique Webhook
        isSubscription: false // Paiement unique
      });

      // 2. Redirection vers le paiement Stripe
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("Impossible de joindre le service de paiement.");
      }
    } catch (error) {
      console.error("Erreur achat carte cadeau:", error);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-purple-600 font-black tracking-[0.4em] text-[10px] uppercase italic"
        >
          L'Élégance en Partage
        </motion.span>
        <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mt-4 mb-20 uppercase italic">
          Cartes <span className="text-gray-200">Privilèges</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Visualisation Dynamique de la Carte */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
            className="bg-[#0a0a0a] aspect-[1.6/1] rounded-[2.5rem] p-12 text-left relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] group"
          >
            {/* Effet de brillance holographique */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-white/5 opacity-50"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <h2 className="text-white font-black italic text-2xl tracking-tighter">GYO SPA</h2>
              <div className="w-12 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-600/40 rounded-md border border-yellow-500/20 shadow-inner" />
            </div>

            <div className="mt-16 relative z-10">
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Valeur du Soin</p>
              <p className="text-5xl font-black text-white tracking-tighter">
                {new Intl.NumberFormat('fr-FR').format(amount)} <span className="text-xs text-purple-600">FCFA</span>
              </p>
            </div>

            <div className="absolute bottom-12 left-12 z-10">
                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.4em]">
                    Bénéficiaire : <span className="text-white ml-2">{recipient || "••••••••••••"}</span>
                </p>
            </div>
          </motion.div>

          {/* Formulaire Elite */}
          <div className="text-left space-y-10 py-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-6">Montant du cadeau</label>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((val) => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`py-5 rounded-2xl font-black text-xs transition-all duration-500 ${amount === val ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20 scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    {val / 1000}K
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Pour qui ?</label>
                <input 
                  type="text"
                  placeholder="Nom complet du bénéficiaire"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-8 py-5 text-sm font-bold outline-none focus:border-purple-600/20 focus:bg-white transition-all"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <button 
                onClick={handlePurchase}
                disabled={isProcessing}
                className={`w-full py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-700 shadow-2xl ${
                  isProcessing 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-purple-600 hover:shadow-purple-600/40'
                }`}
              >
                {isProcessing ? 'Sécurisation...' : 'Offrir maintenant'}
              </button>
            </div>

            <p className="text-[9px] text-gray-400 font-medium leading-relaxed text-center uppercase tracking-widest">
              * La carte cadeau sera envoyée par email après confirmation du paiement. <br /> Valable 12 mois dans notre établissement d'Abidjan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;