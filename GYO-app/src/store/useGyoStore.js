import { create } from 'zustand';

// Fonction de secours pour parser le localStorage sans crasher
const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem('user'); // On utilise 'user' pour la cohérence
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Erreur lors du parsing initial de l'utilisateur:", error);
    return null;
  }
};

const useGyoStore = create((set) => ({
  // Utilisation de la fonction sécurisée au démarrage
  user: getInitialUser(),
  cart: [],
  
  // Actions
  setUser: (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // On nettoie aussi le token si présent
    set({ user: null, cart: [] }); // On vide aussi le panier à la déconnexion
  },

  addToCart: (item) => set((state) => ({ 
    cart: [...state.cart, item] 
  })),

  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((i) => i.id !== itemId)
  })),

  clearCart: () => set({ cart: [] }),
}));

export default useGyoStore;