const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController'); // On importe la logique

// Route : Récupérer tous les services
// URL finale : GET /api/prices/
router.get('/', priceController.getAllPrices);

module.exports = router;