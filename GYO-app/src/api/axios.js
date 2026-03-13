import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gyo-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- 1. INTERCEPTEUR DE REQUÊTE ---
// Injecte automatiquement l'email pour le middleware verifyAdmin
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('gyo_user');
  
  if (userData) {
    try {
      const { email } = JSON.parse(userData);
      if (email) {
        config.headers['x-user-email'] = email.toLowerCase();
      }
    } catch (e) {
      console.error("Erreur parsing session:", e);
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- 2. INTERCEPTEUR DE RÉPONSE (LA MODIF) ---
// Gère automatiquement les erreurs d'autorisation (401/403)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Si le serveur répond que l'utilisateur n'est pas autorisé ou n'est plus admin
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("🔒 Accès révoqué ou session expirée. Déconnexion...");
      
      // Nettoyage local pour éviter de boucler sur des erreurs
      localStorage.removeItem('gyo_user');
      
      // Optionnel : Rediriger vers l'accueil ou le login si on est côté client
      // if (window.location.pathname.includes('/admin')) window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default api;