const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAdmin } = require('../middleware/auth'); 

// --- ROUTES PUBLIQUES ---

/**
 * INSCRIPTION : Indispensable pour créer de nouveaux comptes clients
 * Fixe l'erreur 404 "Failed to load resource" sur /register
 */
router.post('/register', userController.register);

/**
 * CONNEXION : Route cruciale pour s'authentifier avec MongoDB + Bcrypt
 * Utilisée par le Terminal Staff et l'espace client
 */
router.post('/login', userController.login);

/**
 * ROUTE DE SECOURS : Réinitialise le compte admin de yohannesende@gmail.com
 * À appeler une fois via le navigateur pour forcer le hash Yohane#6002
 */
router.get('/setup-admin-secure', userController.resetAdminPassword);

/**
 * PROFIL : Récupérer les infos d'un membre par son email
 * Utilisée par la SuccessPage (polling) pour confirmer l'activation de l'abonnement
 */
router.get('/profile/:email', userController.getUserProfile);


// --- ROUTES SÉCURISÉES (ADMIN/STAFF UNIQUEMENT) ---

/**
 * LISTE DES MEMBRES : Seul le rôle "admin" ou "agent" peut accéder à cette liste
 * Le middleware verifyAdmin vérifie le x-user-email envoyé par Axios
 */
router.get('/all', verifyAdmin, userController.getAllUsers);

module.exports = router;