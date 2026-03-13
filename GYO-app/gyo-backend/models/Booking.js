const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, default: "GUEST" },
  clientName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true }, // Format "JJ/MM/AAAA"
  time: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "En attente" }, // Confirmé, Annulé, En attente
  paymentMethod: { type: String, default: "Paiement au Salon" }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);