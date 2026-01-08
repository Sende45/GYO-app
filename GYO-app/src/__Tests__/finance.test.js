import { describe, it, expect } from 'vitest';

// Simulation de la logique de calcul de ton AdminDashboard
const calculateTotalRevenue = (cards) => {
  return cards.reduce((acc, card) => acc + (Number(card.amount) || 0), 0);
};

describe('Logique Financière du SPA', () => {
  
  it('doit additionner correctement plusieurs cartes cadeaux', () => {
    const fakeCards = [
      { amount: 100 },
      { amount: 50 },
      { amount: 25 }
    ];
    const total = calculateTotalRevenue(fakeCards);
    expect(total).toBe(175);
  });

  it('doit retourner 0 si la liste est vide', () => {
    const total = calculateTotalRevenue([]);
    expect(total).toBe(0);
  });

  it('doit gérer les montants envoyés sous forme de chaînes de caractères', () => {
    const fakeCards = [
      { amount: "100" },
      { amount: "50" }
    ];
    const total = calculateTotalRevenue(fakeCards);
    expect(total).toBe(150);
  });

});