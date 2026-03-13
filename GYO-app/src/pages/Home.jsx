import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Une expérience sensorielle unique où le temps s'arrête.";
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Barre de progression de lecture fluide
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    let currentIdx = 0;
    const typingInterval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDisplayText(fullText.substring(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  const univers = [
    { title: "SPA & MASSAGES", desc: "Soins signatures et rituels détente.", price: "Dès 30000FCFA", delay: 0.1, img: "https://images.unsplash.com/photo-1544161515-4ae6ce6fe858?q=80&w=2070" },
    { title: "ONGLERIE LUXE", desc: "Manucure Russe et pose de gel expert.", price: "Dès 26000FCFA", delay: 0.2, img: "https://images.unsplash.com/photo-1604654894610-df4906bc192f?q=80&w=2000" },
    { title: "SALON DE COIFFURE", desc: "Coupe Homme & Femme haute couture.", price: "Dès 20000FCFA", delay: 0.3, img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000" }
  ];

  return (
    <div ref={containerRef} className="bg-white selection:bg-purple-200 selection:text-purple-900">
      
      {/* Barre de progression discrète en haut */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-purple-600 z-[100] origin-left" style={{ scaleX }} />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
        
        {/* Effet de grain pour le côté luxe */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Cercles de lumières mouvants (Ambient Light) */}
        <div className="absolute inset-0 z-0">
            <motion.div 
                animate={{ 
                    x: [0, 100, 0], 
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1] 
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"
            />
            <motion.div 
                animate={{ 
                    x: [0, -100, 0], 
                    y: [0, 50, 0],
                    scale: [1.2, 1, 1.2] 
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[150px] rounded-full"
            />
        </div>

        <div className="relative z-10 text-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <span className="inline-block text-purple-500 font-black text-[10px] uppercase tracking-[0.6em] mb-12 border-b border-purple-500/30 pb-2">
                    L'excellence du bien-être
                </span>
            </motion.div>

            <h1 className="flex flex-col text-7xl md:text-[14rem] font-black text-white leading-[0.8] tracking-tighter mb-12">
                <motion.span 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    GYO
                </motion.span>
                <motion.span 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-800"
                >
                    SPA
                </motion.span>
            </h1>

            <div className="min-h-[40px] mb-16">
                <p className="text-gray-400 text-lg md:text-xl font-light italic max-w-xl mx-auto leading-relaxed">
                    {displayText}
                    <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-2 bg-purple-600 rounded-full ml-2" 
                    />
                </p>
            </div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Link 
                    to="/reserver" 
                    className="group relative inline-flex items-center justify-center px-12 py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-full overflow-hidden transition-all duration-500"
                >
                    <span className="relative z-20">Réserver l'expérience</span>
                    <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10" />
                    <span className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-white transition-opacity duration-500">Réserver l'expérience</span>
                </Link>
            </motion.div>
        </div>

        {/* Scroll mouse icon */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
            <div className="w-[1px] h-12 bg-gradient-to-b from-purple-600 to-transparent" />
            <span className="text-[8px] text-white uppercase tracking-widest font-bold">Scroll</span>
        </div>
      </section>

      {/* Section Univers - Cartes Interactives */}
      <section className="py-32 md:py-56 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-32 border-b border-gray-100 pb-12">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none text-black">
                    Nos <br /> <span className="text-purple-600 italic">Univers.</span>
                </h2>
                <p className="max-w-sm text-gray-400 font-medium text-lg mt-8 md:mt-0">
                    Chaque soin est une signature. <br /> Chaque instant est un rituel.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {univers.map((item, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="group relative"
                    >
                        <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden rounded-[2rem] mb-8 bg-gray-100">
                            <motion.img 
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                src={item.img} 
                                alt={item.title} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            
                            <div className="absolute bottom-10 left-10">
                                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">/ 0{index+1}</span>
                                <h3 className="text-white text-3xl font-black uppercase leading-tight">
                                    {item.title}
                                </h3>
                            </div>
                        </div>

                        <div className="px-4">
                            <p className="text-gray-500 mb-6 font-medium text-lg italic">"{item.desc}"</p>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                <span className="text-black font-black text-sm uppercase tracking-widest">{item.price}</span>
                                <button className="text-purple-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-2 transition-transform duration-300">
                                    Découvrir →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Newsletter / CTA Final Style "Couture" */}
      <section className="bg-[#0a0a0a] py-40 px-6 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20" />
         
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10"
         >
            <h2 className="text-white text-5xl md:text-9xl font-black uppercase tracking-tighter mb-16 leading-none">
                Élevez votre <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-900 italic">Bien-être.</span>
            </h2>
            
            <Link 
                to="/contact"
                className="inline-block border border-white/20 text-white px-12 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all duration-500"
            >
                Devenir membre privilégié
            </Link>
         </motion.div>
      </section>
    </div>
  );
};

export default Home;