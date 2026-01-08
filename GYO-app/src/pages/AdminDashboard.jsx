import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
// 1. IMPORT DES OUTILS FIREBASE
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [allGiftCards, setAllGiftCards] = useState([]); // État pour les cadeaux
  const [filter, setFilter] = useState('Réservations');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passkey, setPasskey] = useState('');

  // 2. RÉCUPÉRATION TEMPS RÉEL
  useEffect(() => {
    if (!isAdmin) return;

    // Écoute des Réservations (triées par date de création)
    const qBookings = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      setAllBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Écoute des Cartes Cadeaux
    const qCards = query(collection(db, "gift_cards"), orderBy("createdAt", "desc"));
    const unsubCards = onSnapshot(qCards, (snapshot) => {
      setAllGiftCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubBookings(); unsubCards(); };
  }, [isAdmin]);

  // Calcul des statistiques
  const pendingCount = allBookings.filter(b => b.status === 'En attente').length;
  const totalRevenue = allGiftCards.reduce((acc, card) => acc + (Number(card.amount) || 0), 0);

  // FONCTIONS DE GESTION
  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
    } catch (e) { alert("Erreur mise à jour"); }
  };

  const redeemCard = async (id) => {
    if(window.confirm("Marquer cette carte comme utilisée au salon ?")) {
      try {
        await updateDoc(doc(db, "gift_cards", id), { isUsed: true });
      } catch (e) { alert("Erreur validation"); }
    }
  };

  const handleDelete = async (id, type) => {
    if(window.confirm("Supprimer définitivement cet élément ?")) {
      const collectionName = type === 'booking' ? "bookings" : "gift_cards";
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (passkey === 'GYO2026') setIsAdmin(true);
    else alert('Code incorrect');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full">
          <img src={logo} alt="Logo" className="h-20 mx-auto mb-10 opacity-80" />
          <form onSubmit={handleAuth} className="space-y-4">
            <h2 className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-6">Accès Administration</h2>
            <input 
              type="password" 
              placeholder="Entrez le code"
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white text-center focus:outline-none focus:border-purple-600 transition-all"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">En attente de validation</p>
            <p className="text-4xl font-black mt-2 text-orange-500">{pendingCount}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cadeaux Actifs</p>
            <p className="text-4xl font-black mt-2 text-purple-600">{allGiftCards.filter(c => !c.isUsed).length}</p>
          </div>
          <div className="bg-black p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-3xl"></div>
            <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Total Chiffre d'Affaires (Cadeaux)</p>
            <p className="text-4xl font-black mt-2 text-white">{totalRevenue}€</p>
          </div>
        </div>

        {/* ONGLETS NAVIGATION */}
        <div className="flex gap-4 mb-8">
          {['Réservations', 'Cartes Cadeaux'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === t ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200 hover:text-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TABLEAUX DE DONNÉES */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          {filter === 'Réservations' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                  <th className="p-8">Client</th>
                  <th className="p-8">Prestation</th>
                  <th className="p-8">Date & Heure</th>
                  <th className="p-8">Statut</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-8">
                      <p className="font-black text-black uppercase text-sm">{b.clientName || 'Inconnu'}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{b.email}</p>
                    </td>
                    <td className="p-8 text-sm font-medium text-gray-600 italic">{b.service}</td>
                    <td className="p-8 text-sm font-black">{b.date} • {b.time}</td>
                    <td className="p-8">
                      <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                        b.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 
                        b.status === 'Refusé' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-8 text-right space-x-2">
                      <button onClick={() => updateStatus(b.id, 'Confirmé')} className="bg-green-500 text-white p-2.5 rounded-xl hover:scale-110 transition-transform">✓</button>
                      <button onClick={() => updateStatus(b.id, 'Refusé')} className="bg-red-500 text-white p-2.5 rounded-xl hover:scale-110 transition-transform">✕</button>
                      <button onClick={() => handleDelete(b.id, 'booking')} className="bg-gray-100 text-gray-300 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                  <th className="p-8">Code Cadeau</th>
                  <th className="p-8">Destinataire</th>
                  <th className="p-8">Montant</th>
                  <th className="p-8">Statut</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allGiftCards.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-8 font-mono font-bold text-purple-600 text-lg tracking-tighter">{c.code}</td>
                    <td className="p-8 font-black uppercase text-sm">{c.recipient}</td>
                    <td className="p-8 font-black text-xl">{c.amount}€</td>
                    <td className="p-8">
                      <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                        c.isUsed ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700 animate-pulse'
                      }`}>
                        {c.isUsed ? 'Utilisée' : 'Valide'}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      {!c.isUsed ? (
                        <button 
                          onClick={() => redeemCard(c.id)}
                          className="bg-black text-white text-[10px] font-black uppercase px-6 py-3 rounded-full hover:bg-purple-600 transition-colors"
                        >
                          Encaisser le soin
                        </button>
                      ) : (
                        <button onClick={() => handleDelete(c.id, 'gift')} className="text-gray-300 hover:text-red-500 p-2 text-xs font-bold uppercase">Supprimer</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;