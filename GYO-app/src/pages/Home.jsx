import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Une expérience sensorielle unique où le temps s'arrête.";
  const { scrollY } = useScroll();
  
  // Effet de parallaxe sur le titre au scroll
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityTitle = useTransform(scrollY, [0, 300], [1, 0]);

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
    { title: "SPA & MASSAGES", desc: "Soins signatures et rituels détente.", price: "Dès 45€", delay: 0.1 },
    { title: "ONGLERIE LUXE", desc: "Manucure Russe et pose de gel expert.", price: "Dès 40€", delay: 0.2 },
    { title: "SALON DE COIFFURE", desc: "Coupe Homme & Femme haute couture.", price: "Dès 30€", delay: 0.3 }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-purple-200 selection:text-purple-900">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4 bg-black text-white relative overflow-hidden">
        
        {/* Glow effect animé plus complexe */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-900 to-purple-600 rounded-full blur-[150px] z-0" 
        />
        
        <motion.span 
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.5 }}
          className="text-purple-500 font-bold text-[10px] uppercase mb-8 z-10"
        >
          Bienvenue chez GYO
        </motion.span>

        {/* TITRE GYO SPA avec Parallaxe */}
        <motion.div 
          style={{ y: titleY, opacity: opacityTitle }}
          className="relative z-10 mb-8 cursor-default select-none"
        >
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: [1, 1.02, 1]
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ 
              y: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 1 },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-7xl md:text-[12rem] font-black tracking-tighter leading-none"
          >
            GYO <span className="text-purple-600 drop-shadow-[0_0_50px_rgba(147,51,234,0.6)]">SPA</span>
          </motion.h1>
        </motion.div>

        <div className="h-16 z-10">
          <p className="max-w-2xl text-gray-300 text-lg md:text-2xl font-light italic tracking-tight px-4">
            {displayText}
            <span className="inline-block w-[3px] h-6 bg-purple-600 ml-2 animate-pulse"></span>
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-16 z-10"
        >
          <Link 
            to="/reserver" 
            className="group relative bg-purple-600 text-white px-16 py-6 rounded-full font-black transition-all duration-700 uppercase tracking-[0.3em] text-[11px] overflow-hidden inline-block shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60"
          >
            <span className="relative z-20 group-hover:text-black transition-colors duration-500">Réserver maintenant</span>
            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] z-10" />
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-[9px] font-black tracking-widest uppercase"
        >
          Scroll
        </motion.div>
      </section>

      {/* Univers Section */}
      <section className="py-40 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {univers.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: item.delay }}
              whileHover={{ y: -15 }}
              className="group border-l-2 border-gray-50 pl-10 hover:border-purple-600 transition-all duration-500 cursor-pointer"
            >
              <span className="text-purple-600 font-black text-sm block mb-6 transform group-hover:translate-x-2 transition-transform duration-500">
                / 0{index + 1}
              </span>
              <h3 className="text-4xl font-black mb-6 uppercase text-black leading-none group-hover:text-purple-600 transition-colors">
                {item.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h3>
              <p className="text-gray-400 mb-8 font-medium leading-relaxed text-lg group-hover:text-gray-600 transition-colors">
                {item.desc}
              </p>
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-black font-black text-sm uppercase tracking-[0.2em] group-hover:translate-x-0 transition-transform duration-500">
                  {item.price}
                </span>
                <div className="h-[1px] w-0 bg-purple-600 group-hover:w-12 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Citation Section avec fond dynamique */}
      <section className="relative bg-black py-48 text-center overflow-hidden">
        {/* Grain effect overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative z-10"
        >
          <span className="text-purple-600 text-[10px] font-black uppercase tracking-[0.8em] mb-12 block">Manifesto</span>
          <h2 className="text-white text-4xl md:text-7xl font-black italic px-6 mb-12 leading-tight tracking-tighter">
            "Le luxe est une <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-800">émotion.</span>"
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-purple-600 to-transparent mx-auto" />
          
          <Link to="/abonnements" className="mt-16 inline-block text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
             Découvrir nos rituels →
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;