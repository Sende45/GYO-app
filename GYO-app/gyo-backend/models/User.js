const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // ID venant de Firebase Auth
  email: { type: String, required: true },
  subscription: {
    planName: { type: String, default: "Aucun" },
    status: { type: String, default: "inactive" },
    expiryDate: { type: Date },
    remainingSessions: { type: Number, default: 0 }
  },
  lastPurchaseDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);