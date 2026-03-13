const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAdmin } = require('../middleware/auth'); 

// --- ROUTES PUBLIQUES ---

/**
 * CONNEXION : Route cruciale pour s'authentifier avec MongoDB + Bcrypt
 * Utilisée pour accéder au dashboard avec Yohane#6002
 */
router.post('/login', userController.login);

/**
 * PROFIL : Récupérer les infos d'un membre par son email
 */
router.get('/profile/:email', userController.getUserProfile);


// --- ROUTES SÉCURISÉES (ADMIN UNIQUEMENT) ---

/**
 * LISTE DES MEMBRES : Seul le rôle "admin" peut passer via verifyAdmin
 */
router.get('/all', verifyAdmin, userController.getAllUsers);

module.exports = router;