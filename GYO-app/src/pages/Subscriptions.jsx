import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const Subscriptions = () => {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const navigate = useNavigate();

  const plans = [
    {
      name: "Sérénité Solo",
      price: "35000",
      displayPrice: "35.000",
      description: "L'essentiel du bien-être pour une pause mensuelle.",
      features: ["1 Soin Signature / mois", "Accès Hammam 1h", "Tisane détox offerte"],
      isPopular: false,
      sessions: 1
    },
    {
      name: "Luxe Illimité",
      price: "65000",
      displayPrice: "65.000",
      description: "Le choix favori de nos membres réguliers.",
      features: ["2 Soins au choix / mois", "Accès Spa illimité", "Remise de 15% sur les produits", "Accès prioritaire"],
      isPopular: true,
      sessions: 2
    },
    {
      name: "Privilège VIP",
      price: "150000",
      displayPrice: "150.000",
      description: "L'expérience GYO ultime et personnalisée.",
      features: ["Soins illimités", "Conciergerie dédiée", "Privatisation du Spa (1h/mois)", "Invitations aux soirées privées"],
      isPopular: false,
      sessions: 99
    }
  ];

  const handleSelectPlan = async (plan) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Veuillez vous connecter pour souscrire à un abonnement.");
      navigate('/login');
      return;
    }

    setLoadingPlan(plan.name);

    // --- MODE SIMULATION (En attendant CinetPay) ---
    // On simule un délai de traitement de 2 secondes
    setTimeout(async () => {
      try {
        // 1. Calcul de la date d'expiration (+30 jours)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        // 2. Mise à jour du profil utilisateur dans Firestore
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          subscription: {
            planName: plan.name,
            status: "active",
            startDate: serverTimestamp(),
            expiryDate: Timestamp.fromDate(expiryDate),
            remainingSessions: plan.sessions,
            pricePaid: plan.price
          }
        });

        console.log(`Simulation réussie : Pack ${plan.name} activé pour ${currentUser.email}`);
        setLoadingPlan(null);
        
        // 3. Redirection vers la page de succès
        navigate('/success');

      } catch (error) {
        console.error("Erreur lors de la simulation :", error);
        alert("Une erreur est survenue lors de l'activation.");
        setLoadingPlan(null);
      }
    }, 2000);
  };

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
              plan.isPopular 
              ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_40px_rgba(147,51,234,0.1)]' 
              : 'bg-white/5 border-white/10'
            }`}>
              
              {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full">
                  Recommandé
                </span>
              )}

              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-white tracking-tighter">{plan.displayPrice}</span>
                <span className="text-purple-500 ml-2 font-black uppercase text-xs tracking-widest">CFA / mois</span>
              </div>
              
              <p className="text-gray-400 text-[11px] mb-8 font-bold uppercase tracking-wide leading-relaxed h-12">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-[10px] text-white font-black uppercase tracking-widest gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan !== null}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${
                  plan.isPopular 
                  ? 'bg-purple-600 text-white hover:bg-white hover:text-black' 
                  : 'bg-white text-black hover:bg-purple-600 hover:text-white'
                } ${loadingPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingPlan === plan.name ? (
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin" />
                     Vérification...
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