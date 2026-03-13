const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true }, // Ex: GYO-XXXX-2026
  amount: { type: Number, required: true },
  senderEmail: { type: String },
  receiverEmail: { type: String },
  isUsed: { type: Boolean, default: false },
  expiryDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('GiftCard', giftCardSchema);