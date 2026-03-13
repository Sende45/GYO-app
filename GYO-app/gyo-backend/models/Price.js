const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // 'Service', 'Abonnement', 'GiftCard'
  type: { type: String }, // 'Solo', 'Luxe Illimité', 'Privilège VIP'
  sessionsCount: { type: Number, default: 1 }, // 1 pour service, X pour abonnement
  stripePriceId: { type: String, required: true }, // ID créé sur ton dashboard Stripe
  isSubscription: { type: Boolean, default: false } // true pour les packs mensuels
}, { timestamps: true });

module.exports = mongoose.model('Price', priceSchema);