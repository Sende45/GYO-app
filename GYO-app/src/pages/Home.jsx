import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Une expérience sensorielle unique où le temps s'arrête.";
  const containerRef = useRef(null);
  
  // Mouvement de souris pour l'interactivité
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

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
    { title: "SPA & MASSAGES", desc: "Soins signatures et rituels détente.", img: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "ONGLERIE LUXE", desc: "Manucure Russe et pose de gel expert.", img: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "SALON DE COIFFURE", desc: "Coupe Homme & Femme haute couture.", img: "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
  ];

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="bg-white selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden"
    >
      
      {/* PROGRESS BAR */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-purple-600 z-[100] origin-left shadow-[0_0_15px_rgba(147,51,234,0.5)]" style={{ scaleX }} />

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
        
        <motion.div 
          style={{ x: useTransform(mouseX, [0, window.innerWidth], [-20, 20]), y: useTransform(mouseY, [0, window.innerHeight], [-20, 20]) }}
          className="absolute inset-0 z-0 opacity-40"
        >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/20 blur-[120px] rounded-full" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
            <motion.span 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.8em" }}
              transition={{ duration: 1.5 }}
              className="inline-block text-purple-500 font-black text-[10px] uppercase mb-12"
            >
                SENSE_OF_PURITY
            </motion.span>

            <h1 className="flex flex-col text-7xl md:text-[14vw] font-black text-white leading-[0.8] tracking-tighter mb-16">
                <motion.span 
                    initial={{ y: 100, rotateX: -90, opacity: 0 }}
                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    GYO
                </motion.span>
                <motion.span 
                    initial={{ y: 100, rotateX: -90, opacity: 0 }}
                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 via-purple-600 to-purple-900"
                >
                    SPA
                </motion.span>
            </h1>

            <div className="min-h-[60px] mb-12 text-center flex justify-center">
                <p className="text-gray-400 text-lg md:text-xl font-light italic max-w-xl leading-relaxed">
                    {displayText}
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block w-2 h-2 bg-purple-600 rounded-full ml-3" />
                </p>
            </div>

            {/* LIEN VERS BOOKING PAGE */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                    to="/reserver" 
                    className="group relative inline-flex items-center justify-center px-16 py-7 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-purple-600/40"
                >
                    <span className="relative z-20 group-hover:text-white transition-colors duration-500">Réserver l'expérience</span>
                    <div className="absolute inset-0 bg-purple-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-600 ease-[0.16, 1, 0.3, 1] z-10" />
                </Link>
            </motion.div>
        </div>
      </section>

      {/* SECTION UNIVERS (PRIX SUPPRIMÉS POUR PLUS DE CLASSE) */}
      <section className="py-32 md:py-56 px-6 bg-white max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-40 border-b border-gray-100 pb-12">
                <h2 className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-none text-black italic">
                    Pure <br /> <span className="text-purple-600 not-italic">Essence.</span>
                </h2>
                <p className="max-w-xs text-gray-400 font-medium text-lg mt-8 md:mt-0">
                    L'excellence du soin. <br /> Cliquez pour réserver votre rituel.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                {univers.map((item, index) => (
                    <Link to="/reserver" key={index}> {/* Chaque carte mène à la réservation */}
                      <motion.div 
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -20 }}
                          className="group cursor-pointer"
                      >
                          <div className="relative h-[550px] md:h-[700px] w-full overflow-hidden rounded-[3rem] mb-10 shadow-2xl transition-all duration-700 group-hover:shadow-purple-600/20">
                              <motion.img 
                                  whileHover={{ scale: 1.15 }}
                                  transition={{ duration: 1.2 }}
                                  src={item.img} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
                              
                              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                  <span className="text-purple-500 font-black text-xs mb-4 block translate-y-8 group-hover:translate-y-0 transition-transform duration-500">0{index+1} /</span>
                                  <h3 className="text-white text-4xl font-black uppercase leading-[0.85] mb-6">
                                      {item.title}
                                  </h3>
                                  <p className="text-white/0 group-hover:text-white/100 transition-all duration-500 text-sm italic mb-8">
                                      {item.desc}
                                  </p>
                                  <motion.div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                                    <ArrowUpRight size={20} className="text-purple-600" />
                                  </motion.div>
                              </div>
                          </div>
                      </motion.div>
                    </Link>
                ))}
            </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#050505] py-40 md:py-64 px-6 text-center relative overflow-hidden">
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 bg-purple-600 blur-[200px] rounded-full"
         />
         
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="relative z-10">
            <h2 className="text-white text-6xl md:text-[12vw] font-black uppercase tracking-tighter mb-20 leading-[0.75]">
                Ready for <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-800">Metamorphosis?</span>
            </h2>
            
            <Link 
                to="/reserver"
                className="group relative inline-flex items-center gap-8 text-white px-12 py-6 rounded-full border border-white/20 hover:border-purple-600 transition-all duration-700 overflow-hidden"
            >
                <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.5em]">Lancer la réservation</span>
                <div className="absolute inset-0 bg-purple-600 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-700 ease-out" />
            </Link>
         </motion.div>
      </section>
    </div>
  );
};

const ArrowUpRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default Home;