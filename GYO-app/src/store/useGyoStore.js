import { create } from 'zustand';

const useGyoStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('gyo_user')) || null,
  cart: [],
  
  // Actions
  setUser: (userData) => {
    localStorage.setItem('gyo_user', JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('gyo_user');
    set({ user: null });
  },

  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  clearCart: () => set({ cart: [] }),
}));

export default useGyoStore;