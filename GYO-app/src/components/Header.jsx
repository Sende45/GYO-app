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
    return `px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-[0.2em] font-black text-[10px] flex items-center gap-2 ${
      isActive 
        ? 'text-purple-600 bg-purple-50/50' 
        : 'text-black hover:text-purple-600'
    }`;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center h-16 md:h-20">
        
        {/* LOGO & NOM */}
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 z-[110]">
          <img src={logo} alt="GYO Logo" className="h-8 md:h-10 w-auto object-contain" />
          <span className="text-lg md:text-xl font-black text-black tracking-tighter uppercase">
            GYO <span className="text-purple-600">Spa</span>
          </span>
        </Link>
        
        {/* NAVIGATION DESKTOP */}
        <div className="hidden md:flex items-center space-x-2">
          <NavLink to="/" className={getActiveStyle}>Accueil</NavLink>
          <NavLink to="/booking" className={getActiveStyle}>Réservations</NavLink>
          <NavLink to="/abonnements" className={getActiveStyle}>Abonnements</NavLink>
          <div className="h-4 w-[1px] bg-gray-200 mx-4"></div>
          <NavLink to="/admin" className={getActiveStyle}>Mon Espace</NavLink>
        </div>

        {/* ACTIONS & HAMBURGER */}
        <div className="flex items-center gap-4 z-[110]">
          <Link 
            to="/abonnements" 
            className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg"
          >
            Devenir Membre
          </Link>

          {/* BOUTON BURGER AMÉLIORÉ */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* MENU MOBILE OVERLAY - LUXURY STYLE */}
      <div className={`fixed inset-0 bg-white z-[90] flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8">
          {[
            { to: "/", label: "Accueil" },
            { to: "/booking", label: "Réservations" },
            { to: "/abonnements", label: "Abonnements" },
            { to: "/admin", label: "Mon Espace", special: true }
          ].map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              onClick={() => setIsMenuOpen(false)}
              className={({isActive}) => `text-2xl font-black uppercase tracking-[0.2em] transition-colors ${isActive || link.special ? 'text-purple-600' : 'text-black'}`}
            >
              {link.label}
            </NavLink>
          ))}
          
          <Link 
            to="/abonnements" 
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-transform"
          >
            Devenir Membre
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;