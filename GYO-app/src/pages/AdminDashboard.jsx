import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
// 1. IMPORT DES OUTILS FIREBASE
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [filter, setFilter] = useState('Tous');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passkey, setPasskey] = useState('');

  // 2. RÉCUPÉRATION TEMPS RÉEL DEPUIS FIREBASE
  useEffect(() => {
    // On trie par date de création (createdAt) pour voir les nouveaux en haut
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllBookings(data);
    }, (error) => {
      console.error("Erreur Firebase:", error);
    });

    return () => unsubscribe();
  }, []);

  const pendingCount = allBookings.filter(b => b.status === 'En attente').length;

  const updateStatus = async (id, newStatus) => {
    try {
      const bookingRef = doc(db, "bookings", id);
      await updateDoc(bookingRef, { status: newStatus });
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Supprimer définitivement cette réservation ?")) {
      try {
        await deleteDoc(doc(db, "bookings", id));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (passkey === 'GYO2026') {
      setIsAdmin(true);
    } else {
      alert('Code incorrect');
    }
  };

  const filteredBookings = filter === 'Tous' 
    ? allBookings 
    : allBookings.filter(b => b.status === filter);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
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
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />
            <div className="h-10 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
            <div>
              <h1 className="text-4xl font-black text-black tracking-tighter uppercase leading-none">
                Panel <span className="text-purple-600">Réception</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                Flux de Réservations GYO
              </p>
            </div>
          </div>
          
          {/* Filtres Rapides */}
          <div className="flex bg-white p-1.5 rounded-full border border-gray-200 shadow-sm relative">
            {['Tous', 'Confirmé', 'En attente', 'Refusé'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative ${
                  filter === f ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'
                }`}
              >
                {f}
                {f === 'En attente' && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-600 text-[8px] items-center justify-center text-white">
                      {pendingCount}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table des demandes */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-[10px] uppercase tracking-[0.2em]">
                <th className="p-8">Client</th>
                <th className="p-8">Prestation</th>
                <th className="p-8">Contact</th>
                <th className="p-8">Date & Heure</th>
                <th className="p-8">Statut</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-32 text-center text-gray-300 font-black uppercase text-xs tracking-[0.3em]">
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-8">
                      <p className="font-black text-black uppercase text-sm group-hover:text-purple-600 transition-colors">
                        {b.clientName || 'Inconnu'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">ID: #{b.id.slice(-5)}</p>
                    </td>
                    <td className="p-8 text-sm font-medium text-gray-600">
                      {b.service}
                    </td>
                    <td className="p-8">
                      <p className="text-[11px] font-bold text-black">{b.email}</p>
                      <p className="text-[10px] text-purple-600 font-black tracking-tighter">{b.phone}</p>
                    </td>
                    <td className="p-8 text-sm font-medium text-gray-600">
                      {b.date} <span className="text-purple-600 mx-2">•</span> {b.time}
                    </td>
                    <td className="p-8">
                      <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                        b.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 
                        b.status === 'Refusé' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-8 text-right space-x-2">
                      <button 
                        onClick={() => updateStatus(b.id, 'Confirmé')}
                        className="bg-green-500 text-white p-2.5 rounded-xl hover:bg-green-600 shadow-lg shadow-green-100"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => updateStatus(b.id, 'Refusé')}
                        className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-100"
                      >
                        ✕
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="bg-gray-100 text-gray-400 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;