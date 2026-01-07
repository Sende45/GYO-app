import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
import GiftCards from './pages/GiftCards';

// IMPORTS DES COMPOSANTS
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Surveiller l'état de connexion de l'utilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <div className="hidden md:flex space-x-8 font-bold text-[10px] uppercase tracking-[0.2em] text-black items-center">
          <Link to="/" className="hover:text-purple-600 transition-colors">Accueil</Link>
          <Link to="/reserver" className="hover:text-purple-600 transition-colors">Réservations</Link>
          <Link to="/abonnements" className="hover:text-purple-600 transition-colors">Abonnements</Link>
          <Link to="/offrir" className="hover:text-purple-600 transition-colors border-l pl-8 border-gray-200">Offrir</Link>
          <Link to="/mon-compte" className="hover:text-purple-600 transition-colors font-black text-purple-600">Mon Espace</Link>
        </div>

        {/* Côté droit */}
        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-600 transition-colors">
                Connexion
              </Link>
              <Link 
                to="/abonnements" 
                className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/10"
              >
                Devenir Membre
              </Link>
            </>
          ) : (
            <Link to="/mon-compte" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-[10px] font-black text-purple-600 uppercase italic">
                {user.email.charAt(0)}
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* Conteneur principal */}
      <div className="pt-20 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserver" element={<BookingPage />} />
          <Route path="/abonnements" element={<Subscriptions />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Route protégée : Cartes Cadeaux */}
          <Route path="/offrir" element={user ? <GiftCards /> : <Navigate to="/login" />} />
          
          {/* Route protégée : Dashboard Client */}
          <Route path="/mon-compte" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          
          {/* Admin (à protéger par un rôle plus tard) */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback : redirection si la page n'existe pas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;