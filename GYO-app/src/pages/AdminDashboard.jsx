import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import api from '../api/axios'; 
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  FiUsers, FiCalendar, FiDollarSign, FiZap, 
  FiTrash2, FiPlus, FiLogOut, FiActivity 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [data, setData] = useState({ bookings: [], members: [], prices: [], stats: [] });
  const [filter, setFilter] = useState('Réservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [newPriceData, setNewPriceData] = useState({ 
    name: '', amount: '', category: 'Massage Signature GYO', duration: '', description: '', stripePriceId: '' 
  });

  const navigate = useNavigate();

  const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR').format(amount);

  // --- 1. CHARGEMENT GLOBAL DES DONNÉES ---
  const fetchAllData = async () => {
    try {
      // Les headers (x-user-email) sont gérés automatiquement par l'intercepteur Axios
      const [bookings, prices, users] = await Promise.all([
        api.get('/bookings'),
        api.get('/prices'),
        api.get('/users/all')
      ]);

      setData({
        bookings: bookings.data,
        prices: prices.data,
        members: users.data.filter(u => u.subscription?.status === 'active'),
        stats: [
          { name: 'Lun', total: 45000 }, { name: 'Mar', total: 52000 },
          { name: 'Mer', total: 38000 }, { name: 'Jeu', total: 85000 },
          { name: 'Ven', total: 120000 }, { name: 'Sam', total: 150000 },
          { name: 'Dim', total: 95000 },
        ]
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur Dashboard Sync:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin', { replace: true });
      }
    }
  };

  // --- 2. SÉCURITÉ AU CHARGEMENT ---
  useEffect(() => {
    const userData = localStorage.getItem('gyo_user');
    if (!userData) {
      navigate('/admin', { replace: true });
    } else {
      fetchAllData();
    }
  }, [navigate]);

  // --- 3. ACTIONS CRUD (TES FONCTIONNALITÉS) ---
  const handleValidateBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/confirm`, {});
      alert("✅ Réservation confirmée");
      fetchAllData();
    } catch (e) { alert("Erreur validation : " + e.message); }
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/prices', newPriceData);
      setIsPriceModalOpen(false);
      setNewPriceData({ name: '', amount: '', category: 'Massage Signature GYO', duration: '', description: '', stripePriceId: '' });
      fetchAllData();
      alert("✅ Service ajouté");
    } catch (e) { alert("Erreur ajout : " + e.message); }
  };

  const handleDelete = async (id, type) => {
    if(!window.confirm("🚨 Action irréversible. Confirmer ?")) return;
    try {
      const route = type === 'bookings' ? 'bookings' : 'prices';
      await api.delete(`/${route}/${id}`);
      fetchAllData();
    } catch (e) { alert("Erreur suppression : " + e.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem('gyo_user');
    navigate('/admin', { replace: true });
  };

  const filteredData = (list) => {
    return list.filter(item => 
      (item.clientName || item.name || item.firstName || item.lastName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (isLoading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-purple-500 font-black tracking-[0.4em] text-[10px] animate-pulse uppercase italic">Chargement du Terminal GYO...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-zinc-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-zinc-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <img src={logo} alt="GYO" className="h-8" />
          <div className="h-6 w-[1px] bg-zinc-200" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Admin_System_v2</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-xs font-black uppercase tracking-tight">Manager_GYO</span>
             <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1 italic">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> MongoDB_Live
             </span>
          </div>
          <button onClick={handleLogout} className="p-3 bg-zinc-100 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-2xl transition-all">
            <FiLogOut size={18} />
          </button>
        </div>
      </nav>

      {/* --- RESTE DU JSX (INCHANGÉ POUR TES FONCTIONNALITÉS) --- */}
      {/* Modal, KPI, Charts, Filtres, Tableaux... Tout est là ! */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight italic">Nouveau Service</h3>
            <form onSubmit={handleAddPrice} className="space-y-4">
                <input type="text" required placeholder="Nom du service" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm"
                  value={newPriceData.name} onChange={(e) => setNewPriceData({...newPriceData, name: e.target.value})} />
                
                <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm"
                  value={newPriceData.category} onChange={(e) => setNewPriceData({...newPriceData, category: e.target.value})}>
                  <option>Massage Signature GYO</option>
                  <option>Coiffure Homme</option>
                  <option>Onglerie</option>
                  <option>Abonnement</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input type="number" required placeholder="Prix (CFA)" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm"
                    value={newPriceData.amount} onChange={(e) => setNewPriceData({...newPriceData, amount: e.target.value})} />
                  <input type="number" placeholder="Durée/Séances" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm"
                    value={newPriceData.duration} onChange={(e) => setNewPriceData({...newPriceData, duration: e.target.value})} />
                </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsPriceModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-400">Annuler</button>
                <button type="submit" className="flex-2 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Réservations', val: data.bookings.length, icon: <FiCalendar />, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Membres', val: data.members.length, icon: <FiUsers />, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Services', val: data.prices.length, icon: <FiZap />, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Status', val: 'Online', icon: <FiActivity />, color: 'text-green-500', bg: 'bg-green-50' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-100 flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color} text-xl`}>{kpi.icon}</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">{kpi.label}</p>
                  <p className="text-2xl font-black">{kpi.val}</p>
                </div>
            </div>
          ))}
        </div>

        {/* Graphique */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100">
           <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-8 italic">Flux d'activité</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.stats}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="total" stroke="#9333ea" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Filtres & Recherche */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex p-1.5 bg-white border border-zinc-200 rounded-[2rem] shadow-sm">
            {['Réservations', 'Membres', 'Tarifs'].map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-black text-white shadow-lg' : 'text-zinc-400 hover:text-black'}`}>{t}</button>
            ))}
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <input type="text" placeholder="Rechercher..." className="flex-1 lg:w-80 bg-white border border-zinc-200 rounded-full px-8 py-4 text-xs shadow-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {filter === 'Tarifs' && (
              <button onClick={() => setIsPriceModalOpen(true)} className="bg-purple-600 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-black">
                <FiPlus size={14}/> Ajouter
              </button>
            )}
          </div>
        </div>

        {/* Tableaux (Données filtrées) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-zinc-100 overflow-hidden">
          {filter === 'Réservations' && (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-50">
                    <th className="p-8">Client</th>
                    <th className="p-8">Prestation</th>
                    <th className="p-8">Timing</th>
                    <th className="p-8">Status</th>
                    <th className="p-8">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredData(data.bookings).map((b) => (
                    <tr key={b._id} className="hover:bg-zinc-50/50 transition-all">
                      <td className="p-8">
                        <div className="font-black text-sm uppercase italic">{b.clientName}</div>
                        <div className="text-[10px] text-zinc-400 font-bold">{b.phone}</div>
                      </td>
                      <td className="p-8">
                        <div className="font-bold text-sm uppercase flex items-center gap-2">
                           {b.service}
                           {b.paymentMethod?.includes('Stripe') && <FiZap className="text-yellow-500" />}
                        </div>
                        <div className="text-[10px] text-purple-600 font-black tracking-widest uppercase">{formatCurrency(b.price)} CFA</div>
                      </td>
                      <td className="p-8 text-xs font-bold text-zinc-600">{b.date} <br/> <span className="text-zinc-300">à {b.time}</span></td>
                      <td className="p-8">
                        <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${b.status === 'Confirmé' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex gap-4">
                          {b.status !== 'Confirmé' && (
                            <button onClick={() => handleValidateBooking(b._id)} className="bg-black text-white text-[9px] px-6 py-2.5 rounded-xl font-black uppercase hover:bg-purple-600">Valider</button>
                          )}
                          <button onClick={() => handleDelete(b._id, 'bookings')} className="text-zinc-300 hover:text-red-500"><FiTrash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filter === 'Membres' && (
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData(data.members).map((m) => (
                <div key={m._id} className="bg-[#0a0a0a] text-white p-10 rounded-[3rem] relative group border border-white/5 shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[50px]" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-1 italic">{m.firstName} {m.lastName}</h4>
                  <p className="text-[10px] text-zinc-500 font-black mb-10 tracking-widest uppercase italic">{m.subscription?.planName}</p>
                  <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Séances Restantes</span>
                    <span className="text-5xl font-black tracking-tighter text-purple-500 italic">{m.subscription?.remainingSessions}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filter === 'Tarifs' && (
             <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredData(data.prices).map((p) => (
                  <div key={p._id} className="border border-zinc-100 p-8 rounded-[2.5rem] bg-white hover:border-purple-600 transition-all shadow-sm">
                     <div className="flex justify-between items-start mb-6">
                        <span className="text-[8px] font-black px-3 py-1 bg-zinc-100 rounded-full uppercase tracking-widest">{p.category}</span>
                        <button onClick={() => handleDelete(p._id, 'prices')} className="text-zinc-300 hover:text-red-500"><FiTrash2 size={14}/></button>
                     </div>
                     <h4 className="font-black text-lg uppercase mb-2 italic">{p.name}</h4>
                     <p className="text-3xl font-black tracking-tighter italic">{formatCurrency(p.amount)} <span className="text-xs text-zinc-300">CFA</span></p>
                  </div>
                ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;