import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import ServiceCard from '../components/ServiceCard';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import '../booking.css';

// FIREBASE
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const BookingPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // --- DYNAMISME DU TEXTE (SLIDE UP) ---
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = ["VOTRE BIEN-ÊTRE", "VOTRE BEAUTÉ", "VOTRE STYLE"];

  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000); // Change de mot toutes les 3 secondes
    return () => clearInterval(timer);
  }, []);

  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const navigate = useNavigate();

  // --- LISTE DE SERVICES COMPLÈTE ---
  const services = [
    { id: 1, title: "Massage Deep Tissue", duration: 60, price: 85, description: "Détente musculaire profonde." },
    { id: 2, title: "Soin Visage Éclat", duration: 45, price: 60, description: "Nettoyage et luminosité." },
    { id: 3, title: "Manucure Russe", duration: 50, price: 45, description: "Soin complet et cuticules." },
    { id: 4, title: "Pédicure Spa", duration: 60, price: 55, description: "Beauté des pieds et relaxation." },
    { id: 5, title: "Pose de Gel / Résine", duration: 90, price: 70, description: "Onglerie d'art et extensions." },
    { id: 6, title: "Coupe Homme Premium", duration: 30, price: 35, description: "Dégradé et soin barbe." },
    { id: 7, title: "Brushing Femme Pro", duration: 45, price: 40, description: "Shampoing et coiffage expert." },
    { id: 8, title: "Coloration Experte", duration: 120, price: 110, description: "Technique de couleur sur mesure." }
  ];

  const timeSlots = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"];

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedSlot) return alert("Veuillez sélectionner un service et une heure.");
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
      return alert("Veuillez remplir toutes vos coordonnées.");
    }

    setIsUploading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        service: selectedService.title,
        date: date.toLocaleDateString('fr-FR'),
        time: selectedSlot,
        price: selectedService.price,
        clientName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone,
        status: "En attente",
        createdAt: serverTimestamp()
      });
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
        
        {/* HEADER DYNAMIQUE AVEC ANIMATION BAS-HAUT */}
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
          <p className="mt-2 text-gray-400 font-medium text-sm max-w-lg leading-relaxed">
            Plongez dans l'univers GYO : Soins corps, Onglerie de précision et Salon de coiffure haute couture.
          </p>
        </header>

        {/* GRILLE DE SERVICES */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(service => (
            <div 
              key={service.id} 
              onClick={() => setSelectedService(service)}
              className="cursor-pointer group"
            >
              <div className="transition-all duration-500 group-hover:-translate-y-2">
                <ServiceCard {...service} />
              </div>
            </div>
          ))}
        </main>

        {/* MODAL DE RÉSERVATION */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
              
              <div className="p-12 bg-gray-50/50 md:w-5/12 border-r border-gray-100 flex flex-col">
                <button 
                  disabled={isUploading}
                  onClick={() => setSelectedService(null)} 
                  className="text-gray-400 hover:text-black mb-8 text-[10px] font-black uppercase tracking-widest text-left"
                >
                  ← Retour
                </button>
                <h2 className="text-4xl font-black text-black leading-tight uppercase mb-2">{selectedService.title}</h2>
                <p className="text-purple-600 font-bold text-sm mb-10">{selectedService.duration} MIN — {selectedService.price}€</p>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 scale-90 origin-left">
                  <Calendar onChange={setDate} value={date} className="border-none text-sm" />
                </div>
              </div>

              <div className="p-12 flex-1 overflow-y-auto bg-white">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 border-l-4 border-purple-600 pl-4">1. Vos Coordonnées</h3>
                <div className="space-y-4 mb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" placeholder="Prénom" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 ring-purple-600/20 outline-none" />
                    <input name="lastName" placeholder="Nom" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 ring-purple-600/20 outline-none" />
                  </div>
                  <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 ring-purple-600/20 outline-none" />
                  <input name="phone" type="tel" placeholder="Téléphone" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 ring-purple-600/20 outline-none" />
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
                  className={`w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all ${isUploading ? 'bg-gray-200 text-gray-400' : 'bg-black text-white hover:bg-purple-600'}`}
                >
                  {isUploading ? 'Traitement...' : 'Confirmer le rendez-vous'}
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