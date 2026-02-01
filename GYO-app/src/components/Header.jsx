import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const getActiveStyle = ({ isActive }) => {
    return `px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-[0.2em] font-black text-[10px] flex items-center gap-2 whitespace-nowrap ${
      isActive 
        ? 'text-purple-600 bg-purple-50/50' 
        : 'text-black hover:text-purple-600'
    }`;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center h-16 md:h-20 transition-all duration-300">
        
        {/* LOGO & NOM - shrink-0 empêche le logo de s'écraser */}
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 z-[110] shrink-0">
          <img src={logo} alt="GYO Logo" className="h-7 md:h-10 w-auto object-contain" />
          <span className="text-base md:text-xl font-black text-black tracking-tighter uppercase whitespace-nowrap">
            GYO <span className="text-purple-600 italic">Spa</span>
          </span>
        </Link>
        
        {/* NAVIGATION DESKTOP */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <NavLink to="/" className={getActiveStyle}>Accueil</NavLink>
          <NavLink to="/booking" className={getActiveStyle}>Réservations</NavLink>
          <NavLink to="/abonnements" className={getActiveStyle}>Abonnements</NavLink>
          <div className="h-4 w-[1px] bg-gray-200 mx-2 lg:mx-4"></div>
          <NavLink to="/admin" className={getActiveStyle}>Mon Espace</NavLink>
        </div>

        {/* ACTIONS & HAMBURGER */}
        <div className="flex items-center gap-2 md:gap-4 z-[110]">
          <Link 
            to="/abonnements" 
            className="hidden sm:block bg-black text-white px-5 lg:px-6 py-2.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg active:scale-95"
          >
            Devenir Membre
          </Link>

          {/* BOUTON BURGER AMÉLIORÉ - Zone de clic agrandie */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none bg-gray-50/50 rounded-full transition-colors active:bg-gray-100"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* MENU MOBILE OVERLAY - LUXURY STYLE AVEC ANIMATION FLUIDE */}
      <div className={`fixed inset-0 bg-white/98 backdrop-blur-2xl z-[90] flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full invisible pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="mb-4">
             <img src={logo} alt="GYO" className="h-12 w-auto opacity-20" />
          </div>

          {[
            { to: "/", label: "Accueil" },
            { to: "/booking", label: "Réservations" },
            { to: "/abonnements", label: "Abonnements" },
            { to: "/admin", label: "Mon Espace", special: true }
          ].map((link, index) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              onClick={() => setIsMenuOpen(false)}
              className={({isActive}) => `text-2xl font-black uppercase tracking-[0.25em] transition-all duration-300 ${isActive || link.special ? 'text-purple-600 scale-110' : 'text-black active:text-purple-600'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.label}
            </NavLink>
          ))}
          
          <div className="w-12 h-[1px] bg-gray-200 my-4"></div>

          <Link 
            to="/abonnements" 
            onClick={() => setIsMenuOpen(false)}
            className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all active:bg-purple-600"
          >
            Devenir Membre
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;