import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Une expérience sensorielle unique où le temps s'arrête.";
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Barre de progression fluide
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
    { title: "SPA & MASSAGES", desc: "Soins signatures et rituels détente.", price: "Dès 30000FCFA", delay: 0.1, img: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "ONGLERIE LUXE", desc: "Manucure Russe et pose de gel expert.", price: "Dès 26000FCFA", delay: 0.2, img: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "SALON DE COIFFURE", desc: "Coupe Homme & Femme haute couture.", price: "Dès 20000FCFA", delay: 0.3, img: "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
  ];

  return (
    <div ref={containerRef} className="bg-white selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      
      {/* Barre de progression discrète */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-purple-600 z-[100] origin-left" style={{ scaleX }} />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
        
        {/* Effet de grain cinématique */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Cercles de lumières (Ambient Light) */}
        <div className="absolute inset-0 z-0">
            <motion.div 
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full"
            />
            <motion.div 
                animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full"
            />
        </div>

        <div className="relative z-10 text-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
                <span className="inline-block text-purple-500 font-black text-[9px] md:text-[11px] uppercase tracking-[0.8em] mb-8">
                   SENSE_OF_PURITY
                </span>
            </motion.div>

            <h1 className="flex flex-col text-7xl md:text-[13rem] font-black text-white leading-[0.85] tracking-tighter mb-12">
                <motion.span initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                    GYO
                </motion.span>
                <motion.span 
                    initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-900"
                >
                    SPA
                </motion.span>
            </h1>

            <div className="min-h-[40px] mb-12">
                <p className="text-gray-400 text-base md:text-xl font-light italic max-w-xl mx-auto leading-relaxed">
                    {displayText}
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full ml-2" />
                </p>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <Link 
                    to="/reserver" 
                    className="group relative inline-flex items-center justify-center px-10 md:px-14 py-5 md:py-6 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-full overflow-hidden transition-all duration-500"
                >
                    <span className="relative z-20 group-hover:text-white transition-colors duration-500">Réserver l'expérience</span>
                    <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10" />
                </Link>
            </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
            <div className="w-[1px] h-10 bg-white" />
            <span className="text-[7px] text-white uppercase tracking-widest font-bold">Scroll</span>
        </div>
      </section>

      {/* Section Univers - Design "Couture" */}
      <section className="py-32 md:py-56 px-6 bg-white max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 md:mb-40 border-b border-gray-100 pb-12">
                <h2 className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-none text-black">
                    Nos <br /> <span className="text-purple-600 italic">Univers.</span>
                </h2>
                <p className="max-w-xs text-gray-400 font-medium text-lg mt-8 md:mt-0 italic">
                    "L'art du soin poussé à son paroxysme."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                {univers.map((item, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="group"
                    >
                        <div className="relative h-[500px] md:h-[650px] w-full overflow-hidden rounded-[2.5rem] mb-10 shadow-2xl">
                            <motion.img 
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                src={item.img} 
                                alt={item.title} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            
                            <div className="absolute bottom-12 left-10">
                                <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">/ 0{index+1}</span>
                                <h3 className="text-white text-3xl font-black uppercase leading-[0.9]">
                                    {item.title.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}
                                </h3>
                            </div>
                        </div>

                        <div className="px-2">
                            <p className="text-gray-500 mb-6 font-medium text-lg leading-relaxed">{item.desc}</p>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                <span className="text-black font-black text-xs uppercase tracking-widest">{item.price}</span>
                                <div className="w-8 h-[1px] bg-purple-600 group-hover:w-16 transition-all duration-500" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
      </section>

      {/* CTA Final - Épuré et Luxueux */}
      <section className="bg-black py-40 md:py-60 px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
         
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10"
         >
            <h2 className="text-white text-5xl md:text-[10rem] font-black uppercase tracking-tighter mb-16 leading-none italic">
                Ready to <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-800">Elevate?</span>
            </h2>
            
            <Link 
                to="/contact"
                className="inline-block border-b-2 border-purple-600 text-white px-4 py-4 font-black text-[12px] uppercase tracking-[0.6em] hover:text-purple-400 hover:tracking-[0.8em] transition-all duration-500"
            >
                Devenir membre privilégié
            </Link>
         </motion.div>
      </section>
    </div>
  );
};

export default Home;