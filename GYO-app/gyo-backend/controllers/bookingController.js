const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    
    // Si l'utilisateur utilise un pack (Logique simplifiée)
    if (req.body.useSubscription && req.body.userId !== "GUEST") {
      await User.findOneAndUpdate(
        { userId: req.body.userId },
        { $inc: { "subscription.remainingSessions": -1 } }
      );
    }

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};