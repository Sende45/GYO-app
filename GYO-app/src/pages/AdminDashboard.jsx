import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, getDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// Importations pour les graphiques et EmailJS
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import emailjs from '@emailjs/browser';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [allGiftCards, setAllGiftCards] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [filter, setFilter] = useState('Réservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === 'admin' || userDoc.data().role === 'agent')) {
          
          const qBookings = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
          const unsubBookings = onSnapshot(qBookings, (snapshot) => {
            setAllBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          const qCards = query(collection(db, "gift_cards"), orderBy("createdAt", "desc"));
          const unsubCards = onSnapshot(qCards, (snapshot) => {
            setAllGiftCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          const qMembers = query(collection(db, "users"), where("subscription.status", "==", "active"));
          const unsubMembers = onSnapshot(qMembers, (snapshot) => {
            setAllMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          setIsLoading(false);
          return () => { unsubBookings(); unsubCards(); unsubMembers(); };
        } else {
          navigate('/admin');
        }
      } else {
        navigate('/admin');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // --- LOGIQUE ANALYTICS ---
  const totalRevenue = allGiftCards.reduce((acc, card) => acc + (Number(card.amount) || 0), 0);
  const averageTicket = allGiftCards.length > 0 ? (totalRevenue / allGiftCards.length).toFixed(0) : 0;
  
  const chartData = [
    { name: 'Lun', rev: 45000 },
    { name: 'Mar', rev: 52000 },
    { name: 'Mer', rev: totalRevenue * 0.2 },
    { name: 'Jeu', rev: 48000 },
    { name: 'Ven', rev: 61000 },
    { name: 'Sam', rev: 95000 },
    { name: 'Dim', rev: 25000 },
  ];

  const exportToCSV = () => {
    const data = filter === 'Réservations' ? allBookings : (filter === 'Membres' ? allMembers : allGiftCards);
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0] || {}).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GYO_${filter}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // --- LOGIQUE DE MISE À JOUR + EMAIL AUTOMATIQUE ---
  const updateStatus = async (id, newStatus, bookingData) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });

      if (newStatus === 'Confirmé' && bookingData) {
        const templateParams = {
          client_name: bookingData.clientName,
          client_email: bookingData.email,
          service: bookingData.service,
          date: bookingData.date,
          time: bookingData.time,
        };

        emailjs.send(
          'service_ecmwgm7',
          'template_ihtmiun',
          templateParams,
          'xX6MHYJpo5d9EY7MK'
        )
        .then(() => {
          alert("✅ Statut mis à jour et email envoyé !");
        })
        .catch((err) => {
          console.error("Erreur EmailJS:", err);
          alert("Statut mis à jour, mais l'email n'a pas pu être envoyé.");
        });
      } else {
        alert(`Statut mis à jour : ${newStatus}`);
      }
    } catch (e) { 
      alert("Erreur mise à jour"); 
    }
  };

  const redeemCard = async (id) => {
    if(window.confirm("Marquer cette carte comme utilisée au salon ?")) {
      try {
        await updateDoc(doc(db, "gift_cards", id), { isUsed: true });
      } catch (e) { alert("Erreur validation"); }
    }
  };

  const adjustSessions = async (userId, currentSessions) => {
    const amount = prompt("Ajouter ou retirer des séances (ex: +1 ou -1) :", "+1");
    if (amount) {
      const newValue = currentSessions + parseInt(amount);
      await updateDoc(doc(db, "users", userId), { "subscription.remainingSessions": newValue });
    }
  };

  const handleDelete = async (id, type) => {
    if(window.confirm("Supprimer définitivement cet élément ?")) {
      const collectionName = type === 'booking' ? "bookings" : (type === 'member' ? "users" : "gift_cards");
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin');
  };

  const filteredData = (data) => {
    return data.filter(item => 
      item.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-purple-500 font-black tracking-[0.3em] text-[10px] uppercase">GYO SECURE SYSTEM</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] py-6 px-4 md:py-12 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 animate-fadeIn">
          <div className="flex items-center gap-4">
            <img src={logo} alt="GYO SPA" className="h-10 transition-transform hover:scale-110 duration-500" />
            <span className="bg-black text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Console Sécurisée</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={exportToCSV} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-all">
              Exporter CSV <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
            <button onClick={handleLogout} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-all">
              Déconnexion <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all duration-500 group">
            <div className="flex justify-between items-center mb-8">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Volume d'activité</p>
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold bg-green-50 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                LIVE
              </div>
            </div>
            <div className="h-[250px] w-full group-hover:scale-[1.01] transition-transform duration-700">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.08)'}} />
                  <Area type="monotone" dataKey="rev" stroke="#9333ea" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg hover:translate-y-[-5px] transition-all duration-300">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Panier Moyen</p>
              <p className="text-4xl font-black mt-3 text-gray-900">{averageTicket} <span className="text-sm font-medium opacity-30">CFA</span></p>
            </div>
            <div className="bg-black p-8 rounded-[2rem] shadow-2xl shadow-purple-900/20 hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-white font-black text-6xl">%</div>
              <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Fidélité Club</p>
              <p className="text-4xl font-black mt-3 text-white">{allMembers.length > 0 ? '72%' : '0%'}</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="bg-purple-500 h-full w-[72%] rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
              </div>
            </div>
          </div>
        </div>

        {/* QUICK STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">En attente</p>
                <p className="text-3xl font-black text-orange-500 mt-1">{allBookings.filter(b => b.status === 'En attente').length}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Membres Actifs</p>
                <p className="text-3xl font-black text-purple-600 mt-1">{allMembers.length}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Cadeaux Circulants</p>
                <p className="text-3xl font-black text-green-500 mt-1">{allGiftCards.filter(c => !c.isUsed).length}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">CA Global</p>
                <p className="text-3xl font-black text-black mt-1">{totalRevenue.toLocaleString()}</p>
            </div>
        </div>

        {/* FILTRES & RECHERCHE */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex p-1.5 bg-white border border-gray-100 rounded-[2rem] shadow-sm w-full lg:w-auto overflow-x-auto no-scrollbar">
            {['Réservations', 'Membres', 'Cartes Cadeaux'].map((t) => (
              <button 
                key={t} 
                onClick={() => {setFilter(t); setSearchTerm('');}} 
                className={`flex-1 lg:flex-none px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${filter === t ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96 group">
            <input 
              type="text" 
              placeholder={`Recherche intelligente ${filter.toLowerCase()}...`} 
              className="w-full bg-white border border-gray-100 rounded-full px-8 py-4 text-xs focus:outline-none focus:ring-4 focus:ring-purple-500/10 shadow-sm transition-all duration-300 group-hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 font-black text-[10px]">SEARCH</div>
          </div>
        </div>

        {/* TABLEAU AVEC ANIMATION DE LIGNE */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {filter === 'Réservations' && (
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                    <th className="p-8">Client</th>
                    <th className="p-8">Prestation</th>
                    <th className="p-8">Date & Heure</th>
                    <th className="p-8">Paiement</th>
                    <th className="p-8">Statut</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData(allBookings).map((b, idx) => (
                    <tr key={b.id} className="group hover:bg-gray-50/80 transition-all duration-300 animate-slideUp" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="p-8">
                        <p className="font-black text-black uppercase text-sm tracking-tight group-hover:text-purple-600 transition-colors">{b.clientName || 'Inconnu'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{b.email}</p>
                        <p className="text-[9px] text-purple-500 font-bold">{b.phone}</p>
                      </td>
                      <td className="p-8 text-sm font-medium text-gray-600 italic">{b.service}</td>
                      <td className="p-8 text-sm font-black">{b.date} • {b.time}</td>
                      <td className="p-8">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${b.paymentMethod === 'Abonnement' ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-500'}`}>
                          {b.paymentMethod || 'Non spécifié'}
                        </span>
                      </td>
                      <td className="p-8">
                        <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${b.status?.includes('Confirmé') ? 'bg-green-50 text-green-600 border border-green-100' : b.status === 'Refusé' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-8 text-right space-x-3">
                        <button onClick={() => updateStatus(b.id, 'Confirmé', b)} className="bg-white border border-gray-100 text-green-500 w-11 h-11 rounded-2xl hover:bg-green-500 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm">✓</button>
                        <button onClick={() => updateStatus(b.id, 'Refusé', b)} className="bg-white border border-gray-100 text-red-500 w-11 h-11 rounded-2xl hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm">✕</button>
                        <button onClick={() => handleDelete(b.id, 'booking')} className="bg-white border border-gray-100 text-gray-300 w-11 h-11 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filter === 'Membres' && (
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                    <th className="p-8">Membre</th>
                    <th className="p-8">Pack</th>
                    <th className="p-8">Séances</th>
                    <th className="p-8">Expiration</th>
                    <th className="p-8 text-right">Gestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData(allMembers).map((m, idx) => (
                    <tr key={m.id} className="group hover:bg-gray-50/80 transition-all duration-300 animate-slideUp" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="p-8">
                        <p className="font-black text-black uppercase text-sm tracking-tight">{m.displayName || 'Sans Nom'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{m.email}</p>
                      </td>
                      <td className="p-8">
                        <span className="bg-purple-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-purple-500/20">
                          {m.subscription?.planName}
                        </span>
                      </td>
                      <td className="p-8 font-black text-purple-600">
                        {m.subscription?.remainingSessions === 99 ? '∞ ILLIMITÉ' : `${m.subscription?.remainingSessions} SÉANCES`}
                      </td>
                      <td className="p-8 text-xs text-gray-400 font-medium">
                        {m.subscription?.expiryDate?.toDate().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}
                      </td>
                      <td className="p-8 text-right">
                        <button onClick={() => adjustSessions(m.id, m.subscription.remainingSessions)} className="text-[10px] font-black bg-black text-white px-6 py-3 rounded-2xl hover:bg-purple-600 uppercase transition-all shadow-lg active:scale-95">
                          Ajuster Forfait
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filter === 'Cartes Cadeaux' && (
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                    <th className="p-8">Code</th>
                    <th className="p-8">Bénéficiaire</th>
                    <th className="p-8">Valeur</th>
                    <th className="p-8">Statut</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData(allGiftCards).map((c, idx) => (
                    <tr key={c.id} className="group hover:bg-gray-50/80 transition-all duration-300 animate-slideUp" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="p-8 font-mono font-bold text-purple-600 text-lg tracking-tighter">{c.code}</td>
                      <td className="p-8 font-black uppercase text-sm">{c.recipient}</td>
                      <td className="p-8 font-black text-xl">{c.amount.toLocaleString()} CFA</td>
                      <td className="p-8">
                        <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest transition-all ${c.isUsed ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700 animate-pulse'}`}>
                          {c.isUsed ? 'Encaissée' : 'Disponible'}
                        </span>
                      </td>
                      <td className="p-8 text-right space-x-3">
                        {!c.isUsed && <button onClick={() => redeemCard(c.id)} className="bg-black text-white text-[10px] font-black uppercase px-6 py-3 rounded-2xl hover:bg-green-600 transition-all active:scale-95">Valider</button>}
                        <button onClick={() => handleDelete(c.id, 'gift')} className="text-gray-300 hover:text-red-500 p-2 text-[10px] font-black uppercase transition-colors">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-8 text-center pb-12">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">Système de gestion certifié GYO SPA v2.1 — Console Sécurisée</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;