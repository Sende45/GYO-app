import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gyo-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// INTERCEPTEUR : Ajoute automatiquement l'email de l'utilisateur connecté
api.interceptors.request.use((config) => {
  // On récupère l'utilisateur stocké localement après le login
  const userData = localStorage.getItem('gyo_user');
  
  if (userData) {
    const { email } = JSON.parse(userData);
    // On injecte le header que ton middleware verifyAdmin attend
    config.headers['x-user-email'] = email;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;