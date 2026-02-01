import React from 'react';

const ServiceCard = ({ title, duration, price, description }) => {
  return (
    <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(147,51,234,0.15)] hover:border-purple-600/30">
      
      {/* Zone Image / Header de la carte */}
      <div className="h-56 bg-black flex items-center justify-center relative overflow-hidden">
        {/* Overlay violet qui s'intensifie au survol */}
        <div className="absolute inset-0 bg-purple-900/20 group-hover:bg-purple-600/40 transition-all duration-700"></div>
        
        {/* Logo ou Texte en arrière-plan */}
        <span className="text-white font-black text-2xl tracking-[0.3em] z-10 opacity-50 group-hover:scale-110 transition-transform duration-700">
          GYO <span className="text-purple-400">SPA</span>
        </span>
        
        {/* Badge de prix flottant */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-black font-black px-4 py-2 rounded-full text-sm z-20 shadow-xl">
          {price}
        </div>
      </div>

      {/* Contenu textuel */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-black text-xl text-black tracking-tighter leading-tight uppercase">
            {title}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm font-light leading-relaxed mb-6 h-12 overflow-hidden">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse mr-2"></span>
            {duration} minutes
          </div>
          
          <button className="text-black font-black text-xs uppercase tracking-[0.2em] group-hover:text-purple-600 transition-colors flex items-center gap-2">
            Réserver <span>→</span>
          </button>
        </div>
      </div>

      {/* Barre décorative en bas qui s'anime au survol */}
      <div className="h-1 w-0 bg-purple-600 group-hover:w-full transition-all duration-700"></div>
    </div>
  );
};

export default ServiceCard;