require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const path = require('path');

// --- IMPORTATION DES ROUTES ---
const bookingRoutes = require('./routes/bookingRoutes');
const priceRoutes = require('./routes/priceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- MIDDLEWARES ---

/**
 * STRIPE WEBHOOK : 
 * Toujours en premier et en format RAW pour la vérification de signature
 */
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Parser JSON pour tout le reste
app.use(express.json());

// Configuration CORS optimisée pour Abidjan/Production
app.use(cors({
    origin: [
        'https://gyo-app.vercel.app', 
        'http://localhost:3000', 
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// --- DÉCLARATION DES ROUTES API ---
app.use('/api/bookings', bookingRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

// --- GESTION DES ERREURS 404 ---
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée sur le serveur GYO" });
});

// --- GESTIONNAIRE D'ERREURS GLOBAL ---
app.use((err, req, res, next) => {
    console.error("🚨 Erreur Détectée:", err.stack);
    res.status(500).json({ error: "Erreur interne du serveur GYO" });
});

module.exports = app;