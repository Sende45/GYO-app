import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Colonne 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter text-black">
              GYO <span className="text-purple-600">SPA</span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              L'excellence du bien-être et du soin sensoriel au cœur de votre ville.
            </p>
          </div>

          {/* Colonne 2: Navigation */}
          <div>
            <h4 className="text-black font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-purple-600 transition-colors">Accueil</Link></li>
              <li><Link to="/reserver" className="hover:text-purple-600 transition-colors">Réservations</Link></li>
              <li><Link to="/services" className="hover:text-purple-600 transition-colors">Nos Soins</Link></li>
            </ul>
          </div>

          {/* Colonne 3: Contact */}
          <div>
            <h4 className="text-black font-bold uppercase tracking-widest text-xs mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-600 font-light">
              <li>Cocody, Riviera 3 Abidjan</li>
              <li>+33 1 23 45 67 89</li>
              <li>contact@gyospa.com</li>
            </ul>
          </div>

          {/* Colonne 4: Horaires */}
          <div>
            <h4 className="text-black font-bold uppercase tracking-widest text-xs mb-6">Horaires</h4>
            <ul className="space-y-4 text-sm text-gray-600 font-light">
              <li>Lun - Ven: 10h - 20h</li>
              <li>Samedi: 09h - 19h</li>
              <li>Dimanche: Fermé</li>
            </ul>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">
            © 2026 GYO SPA — Le Luxe est une émotion
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors text-xs uppercase font-bold tracking-widest">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors text-xs uppercase font-bold tracking-widest">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;