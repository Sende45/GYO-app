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
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3 md:py-4 flex justify-between items-center transition-all duration-300">
        
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 z-[110] shrink-0">
          <img src={logo} alt="GYO Logo" className="h-7 md:h-10 w-auto object-contain" />
          <span className="text-lg md:text-2xl font-black text-black tracking-tighter whitespace-nowrap uppercase">
            GYO <span className="text-purple-600 italic">SPA</span>
          </span>
        </Link>
        
        {/* Menu Desktop */}
        <div className="hidden lg:flex space-x-8 font-bold text-[10px] uppercase tracking-[0.2em] text-black items-center">
          <Link to="/" className="hover:text-purple-600 transition-colors">Accueil</Link>
          <Link to="/reserver" className="hover:text-purple-600 transition-colors">Réservations</Link>
          <Link to="/abonnements" className="hover:text-purple-600 transition-colors">Abonnements</Link>
          <Link to="/offrir" className="hover:text-purple-600 transition-colors border-l pl-8 border-gray-200">Offrir</Link>
          <Link to="/mon-compte" className="text-purple-600 font-black px-4 py-2 border-2 border-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all">Mon Espace</Link>
        </div>

        {/* Auth & Burger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            {!user ? (
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Connexion</Link>
            ) : (
              <Link to="/mon-compte" className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center text-[10px] font-black text-purple-600 uppercase border border-purple-200 shadow-sm">
                {user.email?.charAt(0)}
              </Link>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative z-[110] w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Menu Mobile simple - Optimisé avec flou d'arrière-plan */}
        <div className={`fixed inset-0 bg-white/98 backdrop-blur-xl z-[100] flex flex-col items-center justify-center space-y-6 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex flex-col items-center space-y-8">
             <Link to="/" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:text-purple-600 transition-all">Accueil</Link>
             <Link to="/reserver" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:text-purple-600 transition-all">Réservations</Link>
             <Link to="/abonnements" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:text-purple-600 transition-all">Abonnements</Link>
             <Link to="/offrir" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:text-purple-600 transition-all">Offrir</Link>
             <hr className="w-12 border-purple-600 border-2" />
             <Link to="/mon-compte" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter text-purple-600">Mon Espace</Link>
             {!user && (
               <Link to="/login" onClick={closeMenu} className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Se connecter</Link>
             )}
          </div>
        </div>
      </nav>

      {/* Conteneur principal avec marges adaptatives */}
      <main className="pt-20 md:pt-24 min-h-screen w-full overflow-x-hidden">
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
      </main>

      <Footer />
    </Router>
  );
}

export default App;