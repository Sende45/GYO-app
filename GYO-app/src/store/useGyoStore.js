import { create } from 'zustand'; // <== C'est ici qu'on le met

const useGyoStore = create((set) => ({
  // Tes données (ex: le panier ou l'utilisateur)
  user: null,
  cart: [],
  
  // Tes actions pour modifier les données
  setUser: (userData) => set({ user: userData }),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  clearCart: () => set({ cart: [] }),
}));

export default useGyoStore;