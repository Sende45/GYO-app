import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import api from '../api/axios'; 

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const navigate = useNavigate();

  // --- RÉCUPÉRATION DES PLANS DEPUIS LE BACKEND ---
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // L'instance Axios utilise déjà la baseURL de ton backend Render
        const response = await api.get('/prices');
        // On filtre pour n'avoir que les abonnements (Club GYO)
        const subs = response.data.filter(p => 
          p.category === 'Abonnement' || 
          p.name.toLowerCase().includes('club')
        );
        setPlans(subs);
      } catch (err) {
        console.error("❌ Erreur chargement plans:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // --- LOGIQUE DE PAIEMENT STRIPE ---
  const handleSelectPlan = async (plan) => {
    const currentUser = auth.currentUser;

    // 1. Vérification de l'authentification
    if (!currentUser) {
      alert("Veuillez vous connecter pour rejoindre le Club GYO.");
      navigate('/login');
      return;
    }

    setLoadingPlan(plan.name);

    try {
      // 2. Appel au backend pour créer la session Stripe
      // Note : On envoie les données attendues par ton routeur backend
      const response = await api.post('/payments/create-checkout-session', {
        priceId: plan.stripePriceId, 
        userId: currentUser.uid,
        email: currentUser.email,
        planName: plan.name,
        sessionsCount: plan.duration // Nombre de séances incluses
      });

      // 3. Redirection vers Stripe si l'URL est présente
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("Réponse backend incomplète:", response.data);
        throw new Error("Impossible de générer le lien de paiement.");
      }

    } catch (error) {
      console.error("❌ Erreur lors de l'initiation du paiement:", error);
      const errorMsg = error.response?.data?.error || "Une erreur est survenue lors de la connexion à Stripe.";
      alert(errorMsg);
      setLoadingPlan(null);
    }
  };

  // --- ÉCRAN DE CHARGEMENT ---
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gyo-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gyo-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Initialisation du Club GYO...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gyo-black py-24 px-6 overflow-hidden relative font-sans">
      {/* Effet visuel de fond */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
        <span className="text-gyo-purple font-black tracking-[0.4em] text-[10px] uppercase italic">Expérience Exclusive</span>
        <h2 className="text-5xl md:text-7xl font-black text-gyo-white tracking-tighter mt-4 uppercase italic">
          REJOIGNEZ LE <span className="text-gyo-purple italic">CLUB GYO</span>
        </h2>
        <p className="text-gray-400 mt-6 max-w-2xl mx-auto font-medium leading-relaxed uppercase text-[10px] tracking-widest">
          Une immersion totale dans le bien-être avec nos forfaits mensuels sans engagement.
        </p>
      </div>

      {/* GRILLE DES FORFAITS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {plans.map((plan, index) => (
          <div key={index} className="relative group transition-all duration-500 hover:translate-y-[-10px]">
            <div className={`relative h-full p-10 rounded-[3rem] backdrop-blur-xl flex flex-col z-10 border transition-all duration-500 ${
              plan.name.toLowerCase().includes("luxe") 
              ? 'bg-purple-600/10 border-gyo-purple shadow-[0_0_40px_rgba(124,58,237,0.1)]' 
              : 'bg-white/5 border-white/10'
            }`}>
              
              {plan.name.toLowerCase().includes("luxe") && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gyo-purple text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full">
                  Le plus prisé
                </span>
              )}

              <h3 className="text-2xl font-black text-gyo-white mb-2 uppercase tracking-tighter italic">{plan.name}</h3>
              
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-gyo-white tracking-tighter">
                  {new Intl.NumberFormat('fr-FR').format(plan.amount)}
                </span>
                <span className="text-gyo-purple ml-2 font-black uppercase text-[10px] tracking-widest">CFA / mois</span>
              </div>
              
              <div className="flex items-center gap-2 mb-8">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
                  {plan.duration} {plan.duration > 1 ? 'Séances' : 'Séance'} / mois
                </p>
                <div className="h-[1px] flex-1 bg-white/10"></div>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest gap-3">
                  <div className="w-1.5 h-1.5 bg-gyo-purple rounded-full" />
                  Accès Privilège Spa
                </li>
                <li className="flex items-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest gap-3">
                  <div className="w-1.5 h-1.5 bg-gyo-purple rounded-full" />
                  Tisane Détox Offerte
                </li>
                {plan.amount >= 65000 && (
                  <li className="flex items-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest gap-3">
                    <div className="w-1.5 h-1.5 bg-gyo-purple rounded-full" />
                    Accès prioritaire
                  </li>
                )}
              </ul>

              <button 
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan !== null}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${
                  plan.name.toLowerCase().includes("luxe")
                  ? 'bg-gyo-purple text-gyo-white hover:bg-gyo-white hover:text-gyo-black' 
                  : 'bg-gyo-white text-gyo-black hover:bg-gyo-purple hover:text-gyo-white'
                } ${loadingPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingPlan === plan.name ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
                    Sécurisation...
                  </div>
                ) : "Choisir ce forfait"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;