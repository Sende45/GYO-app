const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAdmin } = require('../middleware/auth'); // Import du videur

// Route publique (pour que le membre voit son propre profil)
router.get('/:userId', userController.getUserProfile);

// ROUTE SÉCURISÉE : Seul un admin peut lister tous les utilisateurs
router.get('/all', verifyAdmin, userController.getAllUsers);

module.exports = router;