const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// --- IMPORTATION DES ROUTES ---
const bookingRoutes = require('./routes/bookingRoutes');
const priceRoutes = require('./routes/priceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- INITIALISATION FIREBASE ADMIN (POUR LE MIDDLEWARE AUTH) ---
if (!admin.apps.length) {
    try {
        let serviceAccount;
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            // Pour le dev local
            serviceAccount = require('./serviceAccount.json');
        }
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin initialisé dans App.js");
    } catch (error) {
        console.error("❌ Erreur initialisation Firebase Admin:", error.message);
    }
}

// --- MIDDLEWARES ---

/**
 * STRIPE WEBHOOK : 
 * Doit impérativement être placé AVANT express.json() 
 * car il nécessite le corps de la requête au format "raw" pour vérifier la signature.
 */
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware pour parser le JSON pour toutes les autres routes
app.use(express.json());

// Configuration CORS (Autorise ton Vercel et le localhost)
app.use(cors({
    origin: ['https://gyo-app.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// --- DÉCLARATION DES POINTS D'ENTRÉE (API ROUTES) ---

// Gestion des réservations (Bookings)
app.use('/api/bookings', bookingRoutes);

// Gestion des tarifs et services (Prices)
app.use('/api/prices', priceRoutes);

// Gestion des paiements et webhooks (Stripe)
app.use('/api/payments', paymentRoutes);

// Gestion des profils membres (Users)
app.use('/api/users', userRoutes);

// --- GESTION DES ERREURS 404 ---
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée sur le serveur GYO" });
});

// --- GESTIONNAIRE D'ERREURS GLOBAL ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Erreur interne du serveur" });
});

module.exports = app;