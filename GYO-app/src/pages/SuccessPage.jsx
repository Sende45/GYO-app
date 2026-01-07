import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Icône de succès animée */}
        <div className="relative mb-10 inline-block">
          <div className="absolute inset-0 bg-purple-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-black text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <svg className="w-12 h-12 text-purple-500 animate-[bounce_2s_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <span className="block text-purple-600 font-bold tracking-[0.4em] text-xs uppercase mb-4">Paiement Confirmé</span>
        
        <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-6 uppercase">
          Bienvenue au <span className="text-purple-600">Club</span>
        </h1>
        
        <p className="text-gray-500 text-lg font-light leading-relaxed mb-12">
          Votre abonnement est désormais actif. Vous faites partie de l'élite GYO SPA. 
          Un e-mail de confirmation contenant vos accès membres vous a été envoyé.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/reserver" 
            className="bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 transition-all duration-500 shadow-xl shadow-purple-500/10"
          >
            Réserver mon premier soin
          </Link>
          <Link 
            to="/" 
            className="border-2 border-gray-100 text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:border-black transition-all duration-500"
          >
            Retour à l'accueil
          </Link>
        </div>

        {/* Petit message de réassurance */}
        <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
          Besoin d'aide ? Contactez notre conciergerie VIP au +33 1 23 45 67 89
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;