import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Grille principale : 1 colonne sur mobile, 2 sur tablette, 4 sur desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          
          {/* Colonne 1: Branding */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="text-2xl font-black tracking-tighter text-black uppercase">
              GYO <span className="text-purple-600 italic">SPA</span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-[250px]">
              L'excellence du bien-être et du soin sensoriel au cœur de votre ville.
            </p>
          </div>

          {/* Colonne 2: Navigation */}
          <div>
            <h4 className="text-black font-bold uppercase tracking-widest text-[10px] mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-gray-600 font-medium">
              <li><Link to="/" className="hover:text-purple-600 transition-colors">Accueil</Link></li>
              <li><Link to="/reserver" className="hover:text-purple-600 transition-colors">Réservations</Link></li>
              <li><Link to="/abonnements" className="hover:text-purple-600 transition-colors">Abonnements</Link></li>
            </ul>
          </div>

          {/* Colonne 3: Contact */}
          <div>
            <h4 className="text-black font-bold uppercase tracking-widest text-[10px] mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="hover:text-black transition-colors">Cocody, Riviera 3 Abidjan</li>
              <li className="hover:text-black transition-colors">+225 00 00 00 00 00</li>
              <li className="hover:text-black transition-colors italic">contact@gyospa.com</li>
            </ul>
          </div>

          {/* Colonne 4: Horaires */}
          <div>
            <h4 className="text-black font-bold uppercase tracking-widest text-[10px] mb-6">Horaires</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-center md:justify-start gap-2">
                <span className="font-bold text-black text-[10px] uppercase w-8">Lun</span> 10h - 20h
              </li>
              <li className="flex justify-center md:justify-start gap-2">
                <span className="font-bold text-black text-[10px] uppercase w-8">Sam</span> 09h - 19h
              </li>
              <li className="flex justify-center md:justify-start gap-2 text-purple-600">
                <span className="font-bold text-[10px] uppercase w-8">Dim</span> Fermé
              </li>
            </ul>
          </div>
        </div>

        {/* Barre du bas : Responsive flex */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.3em] text-center">
            © 2026 GYO SPA — Le Luxe est une émotion
          </p>
          
          <div className="flex items-center space-x-8">
            <a href="#" className="group flex items-center gap-2">
               <span className="text-gray-400 group-hover:text-purple-600 transition-colors text-[10px] uppercase font-black tracking-widest">Instagram</span>
            </a>
            <a href="#" className="group flex items-center gap-2">
               <span className="text-gray-400 group-hover:text-purple-600 transition-colors text-[10px] uppercase font-black tracking-widest">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;