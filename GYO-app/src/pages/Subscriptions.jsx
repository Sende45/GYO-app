import React, { useState } from 'react';

const Subscriptions = () => {
  // État pour simuler le chargement d'un plan spécifique
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      name: "Sérénité Solo",
      price: "49",
      description: "Parfait pour une pause mensuelle essentielle.",
      features: ["1 Soin Signature / mois", "Accès Hammam 1h", "Tisane détox offerte"],
      isPopular: false
    },
    {
      name: "Luxe Illimité",
      price: "99",
      description: "Le choix favori de nos membres réguliers.",
      features: ["2 Soins au choix / mois", "Accès Spa illimité", "Remise de 15% sur les produits", "Accès prioritaire"],
      isPopular: true
    },
    {
      name: "Privilège VIP",
      price: "199",
      description: "L'expérience GYO ultime et personnalisée.",
      features: ["Soins illimités", "Conciergerie dédiée", "Privatisation du Spa (1h/mois)", "Invitations aux soirées privées"],
      isPopular: false
    }
  ];

  const handleSelectPlan = (planName) => {
    setLoadingPlan(planName);
    
    // Simulation d'une redirection vers Stripe ou une page de checkout
    setTimeout(() => {
      setLoadingPlan(null);
      alert(`Redirection vers le paiement sécurisé pour le forfait : ${planName}`);
      // window.location.href = "/checkout?plan=" + planName; // Exemple de redirection réelle
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <span className="text-purple-600 font-bold tracking-[0.3em] text-xs uppercase">Abonnements SaaS</span>
        <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter mt-4">
          REJOIGNEZ LE <span className="text-purple-600">CLUB</span>
        </h2>
        <p className="text-gray-500 mt-6 max-w-2xl mx-auto font-light leading-relaxed">
          Choisissez un forfait mensuel et profitez de soins exclusifs en toute liberté. Sans engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className="relative group p-[2px] rounded-[3.2rem] transition-all duration-500 hover:scale-[1.02]">
            
            {/* L'effet de bordure qui "tourne" au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 blur-sm rounded-[3.2rem] transition-opacity duration-500 animate-pulse"></div>
            
            {/* LA CARTE RÉELLE */}
            <div className={`relative h-full p-10 rounded-[3rem] bg-white flex flex-col z-10 ${
              plan.isPopular ? 'border-2 border-purple-600 shadow-2xl shadow-purple-500/10' : 'border border-gray-100'
            }`}>
              
              {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-lg">
                  Le plus prisé
                </span>
              )}

              <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-black text-black tracking-tighter">{plan.price}€</span>
                <span className="text-gray-400 ml-2 font-medium uppercase text-xs tracking-widest">/ mois</span>
              </div>
              
              <p className="text-gray-500 text-sm mb-8 font-light leading-relaxed h-12">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-black font-semibold gap-3">
                    <svg className="w-4 h-4 text-purple-600 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* BOUTON AVEC LOGIQUE DE CLIC */}
              <button 
                onClick={() => handleSelectPlan(plan.name)}
                disabled={loadingPlan !== null}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${
                  plan.isPopular 
                  ? 'bg-purple-600 text-white hover:bg-black shadow-xl shadow-purple-200' 
                  : 'bg-black text-white hover:bg-purple-600'
                } ${loadingPlan === plan.name ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loadingPlan === plan.name ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </>
                ) : (
                  "Sélectionner ce plan"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;