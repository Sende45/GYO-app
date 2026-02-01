import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, getDoc, where, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import emailjs from '@emailjs/browser';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [allGiftCards, setAllGiftCards] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [allPrices, setAllPrices] = useState([]);
  const [filter, setFilter] = useState('Réservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [newPriceData, setNewPriceData] = useState({ 
    name: '', 
    amount: '', 
    category: 'Massage Deep Tissue', 
    duration: '', 
    description: '' 
  });

  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === 'admin' || userDoc.data().role === 'agent')) {
          
          const unsubBookings = onSnapshot(query(collection(db, "bookings"), orderBy("createdAt", "desc")), (snapshot) => {
            setAllBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          const unsubCards = onSnapshot(query(collection(db, "gift_cards"), orderBy("createdAt", "desc")), (snapshot) => {
            setAllGiftCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          const unsubMembers = onSnapshot(query(collection(db, "users"), where("subscription.status", "==", "active")), (snapshot) => {
            setAllMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          const unsubPrices = onSnapshot(collection(db, "prices"), (snapshot) => {
            setAllPrices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          setIsLoading(false);
          return () => { 
            unsubBookings(); unsubCards(); unsubMembers(); unsubPrices(); 
          };
        } else { navigate('/admin'); }
      } else { navigate('/admin'); }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // --- NOUVELLE LOGIQUE DE VALIDATION ---
  const handleValidateBooking = async (id, bookingData) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "bookings", id), { status: 'Confirmé' });

      if (bookingData.isPack && bookingData.userId !== "GUEST") {
        const userRef = doc(db, "users", bookingData.userId);
        await updateDoc(userRef, {
          subscription: {
            status: "active",
            planName: bookingData.service,
            remainingSessions: Number(bookingData.sessionsInPack) || 1,
            activatedAt: serverTimestamp()
          }
        });
      }

      await emailjs.send('service_ecmwgm7', 'template_ihtmiun', {
        client_name: bookingData.clientName, 
        client_email: bookingData.email,
        service: bookingData.service, 
        date: bookingData.date, 
        time: bookingData.time,
      }, 'xX6MHYJpo5d9EY7MK');

      alert("✅ Réservation confirmée" + (bookingData.isPack ? " et Pack activé !" : " !"));
    } catch (e) { 
      console.error(e); 
      alert("Erreur lors de la validation");
    } finally { 
      setActionLoading(null); 
    }
  };

  // --- NOUVELLE LOGIQUE : DÉDUIRE UNE SÉANCE MANUELLEMENT ---
  const handleUseSession = async (memberId, currentSessions) => {
    if (currentSessions <= 0) return alert("Plus de séances disponibles !");
    if (!window.confirm("Déduire une séance pour ce membre ?")) return;
    
    try {
      const userRef = doc(db, "users", memberId);
      await updateDoc(userRef, {
        "subscription.remainingSessions": increment(-1)
      });
      alert("✅ Séance déduite avec succès");
    } catch (e) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    if (!newPriceData.name || !newPriceData.amount) return alert("Veuillez remplir tous les champs obligatoires");
    try {
      await addDoc(collection(db, "prices"), {
        name: newPriceData.name,
        amount: Number(newPriceData.amount),
        category: newPriceData.category,
        duration: Number(newPriceData.duration) || 0,
        description: newPriceData.description || "",
        updatedAt: serverTimestamp() 
      });
      setIsPriceModalOpen(false); 
      setNewPriceData({ name: '', amount: '', category: 'Massage Deep Tissue', duration: '', description: '' });
      alert("✅ Nouveau service ajouté !");
    } catch (e) { console.error(e); alert("Erreur lors de l'ajout"); }
  };

  const handleUpdatePrice = async (priceId, currentPrice) => {
    const newPrice = prompt("Entrez le nouveau tarif (en CFA) :", currentPrice);
    if (newPrice !== null && !isNaN(newPrice) && newPrice !== "") {
      try {
        await updateDoc(doc(db, "prices", priceId), { amount: Number(newPrice), updatedAt: new Date() });
        alert("✅ Tarif mis à jour");
      } catch (e) { alert("Erreur"); }
    }
  };

  const handleDelete = async (id, type) => {
    if(window.confirm("🚨 Supprimer définitivement ?")) {
      const col = type === 'booking' ? "bookings" : (type === 'member' ? "users" : (type === 'price' ? "prices" : "gift_cards"));
      await deleteDoc(doc(db, col, id));
    }
  };

  const handleLogout = async () => { await auth.signOut(); navigate('/admin'); };

  const filteredData = (data) => {
    return data.filter(item => 
      (item.clientName || item.displayName || item.recipient || item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.code || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-purple-500 font-black tracking-widest animate-pulse">
      GYO SECURE LOADING...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] py-6 px-4 md:py-12 md:px-8 relative">
      
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative overflow-y-auto max-h-[95vh]">
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Ajouter un service GYO</h3>
            <form onSubmit={handleAddPrice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Nom du service</label>
                  <input type="text" required placeholder="ex: Coupe + Barbe" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 mt-1 text-sm outline-none"
                    value={newPriceData.name} onChange={(e) => setNewPriceData({...newPriceData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Catégorie</label>
                  <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 mt-1 text-sm outline-none"
                    value={newPriceData.category} onChange={(e) => setNewPriceData({...newPriceData, category: e.target.value})}>
                    <optgroup label="MASSAGES">
                      <option>Massage Deep Tissue</option>
                      <option>Massage Californien</option>
                      <option>Massage Pierres Chaudes</option>
                      <option>Massage Sportif</option>
                      <option>Massage Signature GYO</option>
                    </optgroup>
                    <optgroup label="COIFFURE">
                      <option>Coiffure Homme</option>
                      <option>Coiffure Femme</option>
                    </optgroup>
                    <optgroup label="SOINS">
                      <option>Soins Visage</option>
                      <option>Onglerie</option>
                      <option>Abonnement</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Prix (CFA)</label>
                  <input type="number" required placeholder="0" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 mt-1 text-sm outline-none"
                    value={newPriceData.amount} onChange={(e) => setNewPriceData({...newPriceData, amount: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Nb Séances / Durée</label>
                  <input type="number" placeholder="60" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 mt-1 text-sm outline-none"
                    value={newPriceData.duration} onChange={(e) => setNewPriceData({...newPriceData, duration: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Description</label>
                <textarea placeholder="Détails du soin..." className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 mt-1 text-sm outline-none" rows="2"
                  value={newPriceData.description} onChange={(e) => setNewPriceData({...newPriceData, description: e.target.value})} />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsPriceModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-400">Annuler</button>
                <button type="submit" className="flex-2 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 shadow-lg">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="GYO SPA" className="h-10" />
            <span className="bg-black text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Console Sécurisée</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleLogout} className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500">Déconnexion →</button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex p-1.5 bg-white border border-gray-100 rounded-[2rem] shadow-sm w-full lg:w-auto overflow-x-auto no-scrollbar">
            {['Réservations', 'Membres', 'Tarifs'].map((t) => (
              <button key={t} onClick={() => {setFilter(t); setSearchTerm('');}} className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-black text-white' : 'text-gray-400'}`}>{t}</button>
            ))}
          </div>
          {filter === 'Tarifs' && (
            <button onClick={() => setIsPriceModalOpen(true)} className="bg-purple-600 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl">+ Nouveau Service</button>
          )}
          <input type="text" placeholder="Recherche..." className="w-full lg:w-96 bg-white border border-gray-100 rounded-full px-8 py-4 text-xs shadow-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          {filter === 'Réservations' && (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="p-6">Client</th>
                    <th className="p-6">Service</th>
                    <th className="p-6">Date</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData(allBookings).map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                      <td className="p-6">
                        <div className="font-black text-sm uppercase">{b.clientName}</div>
                        <div className="text-[10px] text-gray-400">{b.email}</div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm uppercase">{b.service}</span>
                          {b.isPack && <span className="bg-purple-100 text-purple-600 text-[7px] px-2 py-0.5 rounded-full font-black uppercase">PACK</span>}
                        </div>
                        <div className="text-[10px] text-purple-600 font-bold">{formatCurrency(b.price)} CFA</div>
                      </td>
                      <td className="p-6 text-xs font-bold text-gray-600">{b.date} à {b.time}</td>
                      <td className="p-6">
                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase ${b.status === 'Confirmé' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          {b.status !== 'Confirmé' && (
                            <button 
                              disabled={actionLoading === b.id}
                              onClick={() => handleValidateBooking(b.id, b)}
                              className="bg-black text-white text-[8px] px-4 py-2 rounded-xl font-black uppercase hover:bg-purple-600"
                            >
                              {actionLoading === b.id ? "..." : "Valider"}
                            </button>
                          )}
                          <button onClick={() => handleDelete(b.id, 'booking')} className="text-gray-300 hover:text-red-500">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filter === 'Membres' && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {filteredData(allMembers).map((m) => (
                <div key={m.id} className="bg-black text-white p-8 rounded-[2rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black uppercase mb-1">{m.firstName} {m.lastName}</h4>
                  <p className="text-[10px] text-gray-500 font-bold mb-6 italic">{m.email}</p>
                  
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Abonnement</span>
                      <span className="text-xs font-bold text-purple-400">{m.subscription?.planName}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Restant</span>
                      <span className="text-3xl font-black">{m.subscription?.remainingSessions} <span className="text-[10px]">SÉANCES</span></span>
                    </div>
                    <button 
                      onClick={() => handleUseSession(m.id, m.subscription?.remainingSessions)}
                      className="w-full mt-4 py-3 bg-white/10 hover:bg-purple-600 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                    >
                      Déduire une séance -1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filter === 'Tarifs' && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {filteredData(allPrices).map((p) => (
                <div key={p.id} className="group border border-gray-100 p-8 rounded-[2rem] hover:shadow-2xl transition-all duration-500 bg-white relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${p.category.includes('Coiffure') ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-600'}`}>
                          {p.category}
                        </span>
                        {p.duration > 0 && <span className="text-[8px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full font-bold">{p.duration} {p.category === 'Abonnement' ? 'SÉANCES' : 'MIN'}</span>}
                      </div>
                      <h4 className="font-black text-lg uppercase leading-tight mb-1">{p.name}</h4>
                      <p className="text-[10px] text-gray-400 line-clamp-2 italic">{p.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleUpdatePrice(p.id, p.amount)} className="bg-gray-50 text-gray-400 p-3 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm">✎</button>
                      <button onClick={() => handleDelete(p.id, 'price')} className="bg-gray-50 text-gray-300 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑</button>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-auto">
                    <p className="text-4xl font-black">{formatCurrency(p.amount)}</p>
                    <span className="text-xs font-bold text-gray-300">CFA</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;