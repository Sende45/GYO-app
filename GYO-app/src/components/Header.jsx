import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Header = () => {
  /**
   * getActiveStyle : Cette fonction vérifie si le lien est actif.
   * Si oui, elle applique le violet pro et un léger fond.
   * Si non, elle garde le texte noir élégant.
   */
  const getActiveStyle = ({ isActive }) => {
    return `px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-[0.2em] font-black text-[10px] flex items-center gap-2 ${
      isActive 
        ? 'text-purple-600 bg-purple-50/50' // Style quand tu es sur la page
        : 'text-black hover:text-purple-600' // Style par défaut
    }`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex justify-between items-center">
      
      {/* LOGO & NOM DU SPA */}
      <Link to="/" className="flex items-center gap-3 group">
        <img src={logo} alt="GYO Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
        <span className="text-xl font-black text-black tracking-tighter uppercase">
          GYO <span className="text-purple-600">Spa</span>
        </span>
      </Link>
      
      {/* NAVIGATION DYNAMIQUE */}
      <div className="hidden md:flex items-center space-x-2">
        <NavLink to="/" className={getActiveStyle}>
          Accueil
        </NavLink>
        
        {/* Vérifie bien que "to" correspond au "path" dans ton App.js */}
        <NavLink to="/booking" className={getActiveStyle}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          Réservations
        </NavLink>
        
        <NavLink to="/abonnements" className={getActiveStyle}>
          Abonnements
        </NavLink>
        
        {/* Séparateur visuel */}
        <div className="h-4 w-[1px] bg-gray-200 mx-4"></div>
        
        <NavLink to="/admin" className={getActiveStyle}>
          Mon Espace
        </NavLink>
      </div>

      {/* BOUTON D'APPEL À L'ACTION */}
      <div className="flex items-center gap-4">
        <Link 
          to="/abonnements" 
          className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-purple-100"
        >
          Devenir Membre
        </Link>
      </div>
    </nav>
  );
};

export default Header;