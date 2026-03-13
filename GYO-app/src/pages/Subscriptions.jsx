import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import axios from 'axios'; // On passe sur axios pour plus de propreté

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const navigate = useNavigate();

  // 1. CHARGEMENT DYNAMIQUE DEPUIS MONGODB
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('https://gyo-backend.onrender.com/api/prices');
        // On filtre uniquement les abonnements configurés dans ta collection
        const subs = response.data.filter(p => p.category === 'Abonnement');
        setPlans(subs);
      } catch (err) {
        console.error("Erreur chargement plans:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = async (plan) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Veuillez vous connecter pour rejoindre le Club GYO.");
      navigate('/login');
      return;
    }

    setLoadingPlan(plan.name);

    try {
      // 2. APPEL À TON SERVEUR RENDER (PaymentController)
      // On envoie les infos nécessaires pour que MongoDB et Stripe s'accordent
      const response = await axios.post('https://gyo-backend.onrender.com/api/payments/create-checkout-session', {
        priceId: plan.stripePriceId, // Utilise le champ de ta collection MongoDB
        userId: currentUser.uid,
        email: currentUser.email,
        planName: plan.name,
        sessionsCount: plan.duration, // Dans ton modèle MongoDB, duration = nb de séances pour un pack
        isSubscription: true,        // Force le mode 'subscription' sur Stripe
        category: 'Abonnement'       // Pour que le Webhook sache quoi faire
      });

      // 3. REDIRECTION SÉCURISÉE
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("URL de paiement manquante.");
      }

    } catch (error) {
      console.error("Erreur initialisation paiement :", error);
      alert("Erreur de connexion au service de paiement GYO.");
      setLoadingPlan(null);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
        <span className="text-purple-500 font-black tracking-[0.4em] text-[10px] uppercase">Abonnements Privilèges</span>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mt-4 uppercase">
          REJOIGNEZ LE <span className="text-purple-600 italic">CLUB GYO</span>
        </h2>
        <p className="text-gray-400 mt-6 max-w-2xl mx-auto font-medium leading-relaxed uppercase text-[10px] tracking-widest">
          Choisissez un forfait mensuel et profitez de soins exclusifs en toute liberté. Sans engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {plans.map((plan, index) => (
          <div key={index} className="relative group transition-all duration-500 hover:translate-y-[-10px]">
            <div className={`relative h-full p-10 rounded-[3rem] backdrop-blur-xl flex flex-col z-10 border transition-all duration-500 ${
              plan.name.includes("Luxe") // On peut baser le style populaire sur le nom
              ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_40px_rgba(147,51,234,0.1)]' 
              : 'bg-white/5 border-white/10'
            }`}>
              
              {plan.name.includes("Luxe") && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full">
                  Recommandé
                </span>
              )}

              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-white tracking-tighter">
                    {new Intl.NumberFormat('fr-FR').format(plan.amount)}
                </span>
                <span className="text-purple-500 ml-2 font-black uppercase text-xs tracking-widest">CFA / mois</span>
              </div>
              
              <p className="text-gray-400 text-[11px] mb-8 font-bold uppercase tracking-wide leading-relaxed h-12">
                {plan.category} — {plan.duration} Séances Incluses
              </p>

              <button 
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan !== null}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${
                  plan.name.includes("Luxe")
                  ? 'bg-purple-600 text-white hover:bg-white hover:text-black' 
                  : 'bg-white text-black hover:bg-purple-600 hover:text-white'
                } ${loadingPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingPlan === plan.name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Sécurisation...
                    </div>
                ) : "Devenir Membre"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;