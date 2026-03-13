const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Préfixe dans server.js : /api/bookings
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);

module.exports = router;