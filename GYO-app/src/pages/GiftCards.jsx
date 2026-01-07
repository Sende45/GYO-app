import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const GiftCards = () => {
  const [amount, setAmount] = useState(50);
  const [recipient, setRecipient] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const generateGiftCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'GYO-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handlePurchase = async () => {
    const newCode = generateGiftCode();
    try {
      await addDoc(collection(db, "gift_cards"), {
        code: newCode,
        amount: amount,
        recipient: recipient,
        senderEmail: auth.currentUser?.email || 'Anonyme',
        isUsed: false,
        createdAt: serverTimestamp()
      });
      setGeneratedCode(newCode);
      setIsGenerated(true);
    } catch (error) {
      console.error("Erreur lors de la création de la carte:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-purple-600 font-black tracking-[0.3em] text-[10px] uppercase italic"
        >
          Offrez l'exceptionnel
        </motion.span>
        <h1 className="text-5xl font-black text-black tracking-tighter mt-4 mb-16 uppercase italic">
          Cartes <span className="text-gray-300">Cadeaux</span>
        </h1>

        {!isGenerated ? (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visualisation de la carte */}
            <motion.div 
              whileHover={{ rotateY: 10, rotateX: 10 }}
              className="bg-black aspect-[1.6/1] rounded-[2.5rem] p-10 text-left relative overflow-hidden shadow-2xl shadow-purple-500/20"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/30 blur-[80px]"></div>
              <h2 className="text-white font-black italic text-2xl tracking-tighter">GYO SPA</h2>
              <div className="mt-12">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Valeur du soin</p>
                <p className="text-5xl font-black text-white mt-2">{amount}€</p>
              </div>
              <p className="absolute bottom-10 left-10 text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em]">Code Privilège Unique</p>
            </motion.div>

            {/* Formulaire */}
            <div className="text-left space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Sélectionner un montant</label>
                <div className="flex gap-4">
                  {[50, 100, 150].map((val) => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`flex-1 py-4 rounded-2xl font-black transition-all ${amount === val ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                    >
                      {val}€
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Nom du bénéficiaire</label>
                <input 
                  type="text"
                  placeholder="Ex: Sarah Martin"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-purple-600/20"
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <button 
                onClick={handlePurchase}
                className="w-full bg-black text-white py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 transition-all duration-500 shadow-xl"
              >
                Générer la carte cadeau
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Félicitations !</h2>
            <p className="text-gray-500 mt-2 font-medium italic mb-10">Votre carte de {amount}€ pour {recipient} est prête.</p>
            
            <div className="bg-white border-2 border-dashed border-purple-200 p-8 rounded-3xl inline-block">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Voici le code unique :</p>
              <p className="text-4xl font-black text-purple-600 tracking-[0.2em]">{generatedCode}</p>
            </div>
            
            <div className="mt-12 flex flex-col gap-4 max-w-xs mx-auto">
              <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 underline hover:text-black transition-colors" onClick={() => setIsGenerated(false)}>Offrir une autre carte</button>
              <Link to="/dashboard" className="bg-black text-white py-4 rounded-full font-black uppercase text-[10px] tracking-widest">Retour à mon espace</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GiftCards;