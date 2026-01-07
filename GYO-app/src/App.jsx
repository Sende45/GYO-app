import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// IMPORT DU LOGO DEPUIS ASSETS
import logo from './assets/logo.png'; 

// IMPORTS DES PAGES
import Home from './pages/Home';
import BookingPage from './pages/BookingPages';
import Subscriptions from './pages/Subscriptions'; 
import SuccessPage from './pages/SuccessPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// IMPORTS DES COMPOSANTS
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      {/* Barre de navigation Moderne */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-50 px-8 py-5 flex justify-between items-center">
        
        {/* LOGO ET NOM DE MARQUE */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="GYO Logo" className="h-10 w-auto object-contain" />
          <span className="text-2xl font-black text-black tracking-tighter">
            GYO <span className="text-purple-600">SPA</span>
          </span>
        </Link>
        
        {/* Liens centraux */}
        <div className="hidden md:flex space-x-8 font-bold text-[10px] uppercase tracking-[0.2em] text-black">
          <Link to="/" className="hover:text-purple-600 transition-colors">Accueil</Link>
          <Link to="/reserver" className="hover:text-purple-600 transition-colors">Réservations</Link>
          <Link to="/abonnements" className="hover:text-purple-600 transition-colors">Abonnements</Link>
          <Link to="/mon-compte" className="hover:text-purple-600 transition-colors border-l pl-8 border-gray-200">Mon Espace</Link>
        </div>

        {/* Côté droit */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-600 transition-colors">
            Connexion
          </Link>
          <Link 
            to="/abonnements" 
            className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/10"
          >
            Devenir Membre
          </Link>
        </div>
      </nav>

      {/* Conteneur principal */}
      <div className="pt-20 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserver" element={<BookingPage />} />
          <Route path="/abonnements" element={<Subscriptions />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/mon-compte" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin accessible uniquement via l'URL /admin */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;