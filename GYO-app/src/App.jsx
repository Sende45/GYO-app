import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// IMPORT DU LOGO
import logo from './assets/logo.png'; 

// IMPORTS DES PAGES
import Home from './pages/Home';
import BookingPage from './pages/BookingPages';
import Subscriptions from './pages/Subscriptions'; 
import SuccessPage from './pages/SuccessPage';
import GiftCards from './pages/GiftCards';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import UserAccount from './pages/UserAccount';
import Login from './pages/Login'; 

// IMPORTS DES COMPOSANTS
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // Empêche le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* Barre de navigation simplifiée et propre */}
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center">
        
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 z-[110]">
          <img src={logo} alt="GYO Logo" className="h-8 md:h-10 w-auto object-contain" />
          <span className="text-xl md:text-2xl font-black text-black tracking-tighter">
            GYO <span className="text-purple-600">SPA</span>
          </span>
        </Link>
        
        {/* Menu Desktop */}
        <div className="hidden lg:flex space-x-8 font-bold text-[10px] uppercase tracking-[0.2em] text-black items-center">
          <Link to="/" className="hover:text-purple-600 transition-colors">Accueil</Link>
          <Link to="/reserver" className="hover:text-purple-600 transition-colors">Réservations</Link>
          <Link to="/abonnements" className="hover:text-purple-600 transition-colors">Abonnements</Link>
          <Link to="/offrir" className="hover:text-purple-600 transition-colors border-l pl-8 border-gray-200">Offrir</Link>
          <Link to="/mon-compte" className="text-purple-600 font-black">Mon Espace</Link>
        </div>

        {/* Auth & Burger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            {!user ? (
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Connexion</Link>
            ) : (
              <Link to="/mon-compte" className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-[10px] font-black text-purple-600 uppercase">
                {user.email?.charAt(0)}
              </Link>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative z-[110] w-6 h-6 flex flex-col justify-between items-center"
          >
            <span className={`block w-full h-0.5 bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-3' : ''}`}></span>
          </button>
        </div>

        {/* Menu Mobile simple */}
        <div className={`fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
          <Link to="/" onClick={closeMenu} className="text-2xl font-black uppercase">Accueil</Link>
          <Link to="/reserver" onClick={closeMenu} className="text-2xl font-black uppercase">Réservations</Link>
          <Link to="/abonnements" onClick={closeMenu} className="text-2xl font-black uppercase">Abonnements</Link>
          <Link to="/mon-compte" onClick={closeMenu} className="text-2xl font-black uppercase text-purple-600">Mon Espace</Link>
        </div>
      </nav>

      {/* Routes */}
      <div className="pt-20 md:pt-24 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserver" element={<BookingPage />} />
          <Route path="/abonnements" element={<Subscriptions />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/offrir" element={user ? <GiftCards /> : <Navigate to="/login" />} />
          <Route path="/mon-compte" element={user ? <UserAccount /> : <Navigate to="/login" />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;