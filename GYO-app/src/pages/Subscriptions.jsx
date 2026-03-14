import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. RÉCUPÉRATION DES PLANS DEPUIS MONGODB ---
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/prices');
        
        // On filtre pour ne garder que les abonnements
        let subs = response.data.filter(p => {
          const category = p.category?.toLowerCase() || "";
          return category === 'abonnement';
        });

        // SI LA DB EST VIDE : On définit tes 3 packs manuellement pour l'affichage
        if (subs.length === 0) {
          subs = [
            { name: "Pack Solo", amount: 35000, duration: 4, stripePriceId: "price_solo", category: "abonnement" },
            { name: "Luxe Illimité", amount: 65000, duration: 12, stripePriceId: "price_luxe", category: "abonnement" },
            { name: "Privilège VIP", amount: 130000, duration: 30, stripePriceId: "price_vip", category: "abonnement" }
          ];
        }

        // Tri par prix pour garantir l'ordre : Solo -> Luxe -> VIP
        const sortedSubs = subs.sort((a, b) => a.amount - b.amount);
        setPlans(sortedSubs);
      } catch (err) {
        console.error("❌ Erreur chargement plans:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // --- 2. LOGIQUE DE PAIEMENT STRIPE ---
  const handleSelectPlan = async (plan) => {
    // MODIF : Utilisation de 'gyo_user' pour la cohérence globale
    const userData = localStorage.getItem('gyo_user');

    if (!userData) {
      alert("Veuillez vous connecter pour rejoindre le Club GYO.");
      navigate('/admin'); // Ou ta page de login client
      return;
    }

    const currentUser = JSON.parse(userData);
    setLoadingPlan(plan.name);

    try {
      // Appel au backend pour créer la session Stripe
      const response = await api.post('/payments/create-checkout-session', {
        priceId: plan.stripePriceId, 
        userId: currentUser._id,
        email: currentUser.email,
        planName: plan.name,
        sessionsCount: plan.duration 
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("Lien de paiement introuvable.");
      }

    } catch (error) {
      console.error("❌ Erreur Stripe:", error);
      const errorMsg = error.response?.data?.error || "Erreur de connexion à Stripe.";
      alert(errorMsg);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Initialisation du Club GYO...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 px-6 overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
        <span className="text-purple-500 font-black tracking-[0.4em] text-[10px] uppercase italic">Expérience Exclusive</span>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mt-4 uppercase italic">
          REJOIGNEZ LE <span className="text-purple-500">CLUB GYO</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {plans.map((plan, index) => {
          const nameLower = plan.name.toLowerCase();
          const isLuxe = nameLower.includes("luxe");
          const isVIP = nameLower.includes("privilège") || nameLower.includes("vip");
          const isPremium = isLuxe || isVIP;
          
          return (
            <div key={index} className="relative group transition-all duration-500 hover:translate-y-[-10px]">
              <div className={`relative h-full p-10 rounded-[3rem] backdrop-blur-xl flex flex-col z-10 border transition-all duration-500 ${
                isPremium 
                ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_40px_rgba(124,58,237,0.1)]' 
                : 'bg-white/5 border-white/10'
              }`}>
                
                {isPremium && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full">
                    {isVIP ? "Prestige" : "Le plus prisé"}
                  </span>
                )}

                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">{plan.name}</h3>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {new Intl.NumberFormat('fr-FR').format(plan.amount)}
                  </span>
                  <span className="text-purple-500 ml-2 font-black uppercase text-[10px] tracking-widest">CFA / mois</span>
                </div>
                
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
                    {isLuxe || isVIP ? 'Accès Illimité' : `${plan.duration || 0} Séances / mois`}
                  </p>
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>

                <ul className="space-y-4 mb-12 flex-1">
                  <li className="flex items-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Accès Privilège Spa
                  </li>
                  <li className="flex items-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    {isVIP ? "Service Valet & Champagne" : "Tisane Détox Offerte"}
                  </li>
                  {isPremium && (
                    <li className="flex items-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Priorité sur les Réservations
                    </li>
                  )}
                </ul>

                <button 
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan !== null}
                  className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${
                    isPremium
                    ? 'bg-purple-600 text-white hover:bg-white hover:text-black' 
                    : 'bg-white text-black hover:bg-purple-600 hover:text-white'
                  } ${loadingPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loadingPlan === plan.name ? "Sécurisation..." : "Choisir ce forfait"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscriptions;