import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Une expérience sensorielle unique où le temps s'arrête.";
  const { scrollY } = useScroll();
  
  // Désactiver ou réduire le parallaxe sur mobile pour éviter les lags
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const titleY = useTransform(scrollY, [0, 500], [0, isMobile ? 50 : 150]);
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
    <div className="min-h-screen bg-white selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 bg-black text-white relative overflow-hidden">
        
        {/* Glow effect - Redimensionné pour mobile */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-gradient-to-tr from-purple-900 to-purple-600 rounded-full blur-[80px] md:blur-[150px] z-0" 
        />
        
        <motion.span 
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: isMobile ? "0.3em" : "0.5em" }}
          transition={{ duration: 1.5 }}
          className="text-purple-500 font-bold text-[9px] md:text-[10px] uppercase mb-6 md:mb-8 z-10"
        >
          Bienvenue chez GYO
        </motion.span>

        {/* TITRE GYO SPA - Responsive font size */}
        <motion.div 
          style={{ y: titleY, opacity: opacityTitle }}
          className="relative z-10 mb-6 md:mb-8 cursor-default select-none w-full"
        >
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: [1, 1.01, 1]
            }}
            transition={{ 
              y: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.8 },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-6xl md:text-[12rem] font-black tracking-tighter leading-none"
          >
            GYO <span className="text-purple-600 drop-shadow-[0_0_30px_rgba(147,51,234,0.4)]">SPA</span>
          </motion.h1>
        </motion.div>

        {/* Zone de texte avec hauteur fixe pour éviter les sauts de mise en page */}
        <div className="h-20 md:h-16 z-10 flex items-start justify-center">
          <p className="max-w-2xl text-gray-300 text-base md:text-2xl font-light italic tracking-tight px-2 leading-relaxed">
            {displayText}
            <span className="inline-block w-[2px] h-5 bg-purple-600 ml-2 animate-pulse align-middle"></span>
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12 md:mt-16 z-10 w-full px-4"
        >
          <Link 
            to="/reserver" 
            className="group relative bg-purple-600 text-white w-full md:w-auto px-10 md:px-16 py-5 md:py-6 rounded-full font-black transition-all duration-700 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px] overflow-hidden inline-block shadow-2xl shadow-purple-500/40"
          >
            <span className="relative z-20 group-hover:text-black transition-colors duration-500">Réserver maintenant</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] z-10" />
          </Link>
        </motion.div>

        {/* Scroll Indicator - Caché sur petit mobile pour gagner de la place */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-[8px] font-black tracking-widest uppercase hidden sm:block"
        >
          Scroll
        </motion.div>
      </section>

      {/* Univers Section - Adaptée au mobile */}
      <section className="py-24 md:py-40 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {univers.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: isMobile ? 0 : item.delay }}
              className="group border-l-2 border-gray-100 pl-6 md:pl-10 hover:border-purple-600 transition-all duration-500 cursor-pointer"
            >
              <span className="text-purple-600 font-black text-xs block mb-4 md:mb-6">
                / 0{index + 1}
              </span>
              <h3 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 uppercase text-black leading-[0.9] group-hover:text-purple-600 transition-colors">
                {item.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h3>
              <p className="text-gray-400 mb-6 md:mb-8 font-medium leading-relaxed text-sm md:text-lg group-hover:text-gray-600 transition-colors">
                {item.desc}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-black font-black text-[10px] md:text-sm uppercase tracking-[0.2em]">
                  {item.price}
                </span>
                <div className="h-[1px] w-8 md:w-0 md:group-hover:w-12 bg-purple-600 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Citation Section */}
      <section className="relative bg-black py-32 md:py-48 text-center overflow-hidden px-6">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <span className="text-purple-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] mb-8 md:mb-12 block">Manifesto</span>
          <h2 className="text-white text-3xl md:text-7xl font-black italic mb-8 md:mb-12 leading-tight tracking-tighter">
            "Le luxe est une <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-800">émotion.</span>"
          </h2>
          <div className="h-[2px] w-20 md:w-32 bg-gradient-to-r from-transparent via-purple-600 to-transparent mx-auto" />
          
          <Link to="/abonnements" className="mt-12 md:mt-16 inline-block text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Découvrir nos rituels →
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;