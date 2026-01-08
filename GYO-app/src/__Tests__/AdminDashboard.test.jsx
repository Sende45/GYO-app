import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mocks indispensables
vi.mock('../firebase', () => ({ db: {}, auth: { currentUser: null } }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn(),
  orderBy: vi.fn(),
}));
vi.mock('../assets/logo.png', () => ({ default: 'logo-mock' }));

import AdminDashboard from '../pages/AdminDashboard';

describe('AdminDashboard', () => {
  it('doit charger le composant sans erreur', () => {
    render(<AdminDashboard />);
    
    // On cherche un bouton ou un titre de manière très souple
    const element = screen.getByRole('button') || screen.getByText(/Accès/i);
    expect(element).toBeInTheDocument();
  });
});