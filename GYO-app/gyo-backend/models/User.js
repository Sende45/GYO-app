const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ✅ MODIF : On rend le userId optionnel ou on utilise l'email comme clé unique
  // pour ne pas bloquer les comptes créés sans Firebase.
  userId: { type: String, unique: true, sparse: true }, 

  // ✅ AJOUT : Indispensable pour la connexion 100% MongoDB
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  
  name: { type: String },
  role: { type: String, default: 'client' }, // 'client', 'admin', ou 'agent'

  subscription: {
    planName: { type: String, default: "Aucun" },
    status: { type: String, default: "inactive" },
    expiryDate: { type: Date },
    remainingSessions: { type: Number, default: 0 }
  },
  lastPurchaseDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);