import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import ServiceCard from '../components/ServiceCard';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import '../booking.css';

// FIREBASE
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const BookingPage = () => {
  // --- ÉTATS ---
  const [dbServices, setDbServices] = useState([]); 
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  
  const [userSubscription, setUserSubscription] = useState(null);
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = ["VOTRE BIEN-ÊTRE", "VOTRE BEAUTÉ", "VOTRE STYLE"];
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  // --- UTILITAIRE FORMATAGE FCFA ---
  const formatFCFA = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  // --- 1. RÉCUPÉRATION DES SERVICES ---
  useEffect(() => {
    const q = query(collection(db, "prices"), orderBy("category", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesFromDb = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbServices(servicesFromDb);
      setIsLoadingServices(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. GESTION DU TITRE ET PROFIL ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    const fetchSubscription = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserSubscription(userSnap.data().subscription || null);
          }
        } catch (error) {
          console.error("Erreur profil:", error);
        }
      }
    };
    fetchSubscription();
    return () => clearInterval(timer);
  }, []);

  const timeSlots = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"];

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
  };

  // --- 3. CONFIRMATION DE RÉSERVATION ---
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedSlot) return alert("Veuillez sélectionner une heure.");
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
      return alert("Veuillez remplir vos coordonnées.");
    }

    setIsUploading(true);
    try {
      const hasActiveSub = auth.currentUser && userSubscription && userSubscription.status === 'active' && userSubscription.remainingSessions > 0;
      
      // Détection s'il s'agit d'un achat de pack (basé sur la catégorie)
      const isPackPurchase = selectedService.category === "Abonnement";

      const bookingData = {
        userId: auth.currentUser?.uid || "GUEST",
        service: selectedService.name,
        category: selectedService.category,
        date: date.toLocaleDateString('fr-FR'),
        time: selectedSlot,
        price: Number(selectedService.amount),
        clientName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone,
        createdAt: serverTimestamp(),
        // CHAMPS POUR L'ADMINISTRATION
        isPack: isPackPurchase,
        sessionsInPack: isPackPurchase ? (Number(selectedService.duration) || 1) : 0,
        paymentMethod: hasActiveSub ? "Abonnement (Session déduite)" : "Paiement au Salon",
        status: hasActiveSub ? "Confirmé" : "En attente"
      };

      // Si le client utilise une séance de son pack existant
      if (hasActiveSub) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const isVIP = userSubscription.planName === "Privilège VIP" || userSubscription.remainingSessions === 99;
        await updateDoc(userRef, {
          "subscription.remainingSessions": isVIP ? 99 : userSubscription.remainingSessions - 1
        });
      }

      await addDoc(collection(db, "bookings"), bookingData);
      navigate('/success');
    } catch (error) {
      alert(`Erreur : ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* STATUT MEMBRE */}
        {auth.currentUser && userSubscription && userSubscription.status === 'active' && (
          <div className="mb-8 flex justify-center md:justify-start">
            <div className="bg-black px-6 py-2 rounded-full border border-gray-800 animate-pulse">
              <span className="text-[10px] font-black uppercase text-white tracking-widest">
                MEMBRE CLUB GYO • {userSubscription.remainingSessions === 99 ? "SÉANCES ILLIMITÉES" : `${userSubscription.remainingSessions} SÉANCES RESTANTES`}
              </span>
            </div>
          </div>
        )}

        <header className="mb-16 text-center md:text-left">
          <span className="text-purple-600 font-bold tracking-[0.4em] text-[10px] uppercase">Expérience GYO</span>
          <div className="mt-4 h-[120px] md:h-[150px] overflow-hidden">
            <h2 className="text-6xl md:text-7xl font-black text-black tracking-tighter uppercase leading-[0.9]">
              RÉSERVEZ <br />
              <div className="relative h-[60px] md:h-[75px] mt-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titles[titleIndex]}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-purple-600 absolute left-0 w-full"
                  >
                    {titles[titleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h2>
          </div>
        </header>

        {/* --- GRILLE DES SERVICES --- */}
        {isLoadingServices ? (
          <div className="text-center py-20 text-gray-300 font-black uppercase tracking-widest animate-pulse">
            Chargement des services GYO...
          </div>
        ) : (
          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbServices.map(service => (
              <div key={service.id} onClick={() => handleSelectService(service)} className="cursor-pointer group">
                <div className="transition-all duration-500 group-hover:-translate-y-2">
                  <ServiceCard 
                    title={service.name} 
                    price={formatFCFA(service.amount)} 
                    duration={service.category === "Abonnement" ? `${service.duration} SÉANCES` : `${service.duration} MIN`} 
                    description={service.category} 
                  />
                </div>
              </div>
            ))}
          </main>
        )}

        {/* --- MODAL DE RÉSERVATION --- */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-scaleUp">
              
              <div className="p-12 bg-gray-50/50 md:w-5/12 border-r border-gray-100 flex flex-col">
                <button 
                  disabled={isUploading}
                  onClick={() => setSelectedService(null)} 
                  className="text-gray-400 hover:text-black mb-8 text-[10px] font-black uppercase tracking-widest text-left"
                >
                  ← Retour
                </button>
                <span className="text-[10px] font-black text-purple-600 uppercase mb-2 tracking-widest">{selectedService.category}</span>
                <h2 className="text-4xl font-black text-black leading-tight uppercase mb-2">{selectedService.name}</h2>
                <p className="text-gray-900 font-bold text-sm mb-10">
                  {selectedService.category === "Abonnement" ? `${selectedService.duration} SÉANCES` : `${selectedService.duration} MIN`} — {formatFCFA(selectedService.amount)}
                </p>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 scale-90 origin-left">
                  <Calendar onChange={setDate} value={date} className="border-none text-sm" />
                </div>
              </div>

              <div className="p-12 flex-1 overflow-y-auto bg-white">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 border-l-4 border-purple-600 pl-4">1. Vos Coordonnées</h3>
                <div className="space-y-4 mb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" placeholder="Prénom" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm outline-none" />
                    <input name="lastName" placeholder="Nom" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm outline-none" />
                  </div>
                  <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm outline-none" />
                  <input name="phone" type="tel" placeholder="Téléphone" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm outline-none" />
                </div>

                <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 border-l-4 border-purple-600 pl-4">2. Créneau horaire</h3>
                <div className="grid grid-cols-3 gap-3 mb-10">
                  {timeSlots.map(slot => (
                    <button 
                      key={slot} 
                      onClick={() => setSelectedSlot(slot)} 
                      className={`py-3.5 rounded-2xl text-[10px] font-black transition-all border-2 ${selectedSlot === slot ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-gray-50 text-gray-400 hover:border-purple-200'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={isUploading}
                  onClick={handleConfirmBooking}
                  className={`w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all ${isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-purple-600 shadow-xl'}`}
                >
                  {isUploading ? 'Traitement...' : (
                    auth.currentUser && userSubscription && userSubscription.status === 'active' && userSubscription.remainingSessions > 0
                    ? 'Confirmer avec mon abonnement'
                    : `Réserver (${formatFCFA(selectedService.amount)})`
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;