import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Une expérience sensorielle unique où le temps s'arrête.";
  
  useEffect(() => {
    let currentIdx = 0;
    const typingInterval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDisplayText(fullText.substring(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, []);

  const univers = [
    { title: "SPA & MASSAGES", desc: "Soins signatures et rituels détente.", price: "Dès 45€" },
    { title: "ONGLERIE LUXE", desc: "Manucure Russe et pose de gel expert.", price: "Dès 40€" },
    { title: "SALON DE COIFFURE", desc: "Coupe Homme & Femme haute couture.", price: "Dès 30€" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="h-[90vh] flex flex-col items-center justify-center text-center px-4 bg-black text-white relative overflow-hidden">
        
        {/* Glow effect animé */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[120px] z-0" 
        />
        
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-purple-500 font-bold tracking-[0.5em] text-[10px] uppercase mb-4 z-10"
        >
          Bienvenue chez GYO
        </motion.span>

        {/* TITRE GYO SPA */}
        <div className="relative z-10 mb-6 cursor-default select-none">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: [1, 1.03, 1]
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ 
              y: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 1 },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none"
          >
            GYO <span className="text-purple-600 drop-shadow-[0_0_35px_rgba(147,51,234,0.4)]">SPA</span>
          </motion.h1>
        </div>

        <div className="h-12 z-10">
          <p className="max-w-2xl text-gray-400 text-lg md:text-xl font-light italic">
            {displayText}
            <span className="inline-block w-[2px] h-5 bg-purple-600 ml-1 animate-pulse"></span>
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-12 z-10"
        >
          {/* CORRECTION DU LIEN : /booking -> /reserver */}
          <Link 
            to="/reserver" 
            className="group relative bg-purple-600 text-white px-12 py-5 rounded-full font-black transition-all duration-500 uppercase tracking-[0.2em] text-[10px] overflow-hidden inline-block shadow-lg shadow-purple-500/20"
          >
            <span className="relative z-20 group-hover:text-black transition-colors duration-500">Réserver maintenant</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10" />
          </Link>
        </motion.div>
      </section>

      {/* Univers Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {univers.map((item, index) => (
          <motion.div 
            key={index} 
            whileHover={{ y: -10 }}
            className="group border-l border-gray-100 pl-8 hover:border-purple-600 transition-all duration-500 cursor-default"
          >
            <span className="text-purple-600 font-black text-xs block mb-4">0{index + 1}</span>
            <h3 className="text-3xl font-black mb-4 uppercase text-black group-hover:text-purple-600 transition-colors">{item.title}</h3>
            <p className="text-gray-500 mb-6 font-medium leading-relaxed">{item.desc}</p>
            <span className="text-black font-black text-sm uppercase tracking-widest">{item.price}</span>
          </motion.div>
        ))}
      </section>

      {/* Citation Section */}
      <section className="bg-black py-32 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-white text-3xl md:text-5xl font-black italic px-6 mb-4">
            "Le luxe est une émotion."
          </h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto rounded-full" />
        </motion.div>
      </section>
    </div>
  );
};

export default Home;