import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getActiveStyle = ({ isActive }) => {
    return `px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-[0.2em] font-black text-[10px] flex items-center gap-2 ${
      isActive 
        ? 'text-purple-600 bg-purple-50/50' 
        : 'text-black hover:text-purple-600'
    }`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center">
      
      {/* LOGO & NOM DU SPA - Taille adaptée sur mobile */}
      <Link to="/" className="flex items-center gap-2 md:gap-3 group z-[60]">
        <img src={logo} alt="GYO Logo" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
        <span className="text-lg md:text-xl font-black text-black tracking-tighter uppercase">
          GYO <span className="text-purple-600">Spa</span>
        </span>
      </Link>
      
      {/* NAVIGATION DYNAMIQUE - Hidden on mobile, visible on md+ */}
      <div className="hidden md:flex items-center space-x-2">
        <NavLink to="/" className={getActiveStyle}>
          Accueil
        </NavLink>
        
        <NavLink to="/booking" className={getActiveStyle}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          Réservations
        </NavLink>
        
        <NavLink to="/abonnements" className={getActiveStyle}>
          Abonnements
        </NavLink>
        
        <div className="h-4 w-[1px] bg-gray-200 mx-4"></div>
        
        <NavLink to="/admin" className={getActiveStyle}>
          Mon Espace
        </NavLink>
      </div>

      {/* BOUTON D'APPEL À L'ACTION & BURGER */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link 
          to="/abonnements" 
          className="hidden sm:block bg-black text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-purple-100"
        >
          Devenir Membre
        </Link>

        {/* BOUTON MENU MOBILE (Burger) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-black z-[60]"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`h-0.5 w-full bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-0.5 w-full bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* MENU OVERLAY MOBILE - S'ouvre quand isMenuOpen est vrai */}
      <div className={`fixed inset-0 bg-white transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col items-center justify-center gap-8 z-[55]`}>
        <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-widest text-black">Accueil</NavLink>
        <NavLink to="/booking" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-widest text-black">Réservations</NavLink>
        <NavLink to="/abonnements" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-widest text-black">Abonnements</NavLink>
        <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-widest text-purple-600">Mon Espace</NavLink>
        
        <Link 
          to="/abonnements" 
          onClick={() => setIsMenuOpen(false)}
          className="bg-black text-white px-8 py-4 rounded-full text-[12px] font-black uppercase tracking-widest"
        >
          Devenir Membre
        </Link>
      </div>
    </nav>
  );
};

export default Header;