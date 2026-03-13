// 1. Charger les variables d'environnement (Même si déjà fait dans server.js, c'est une sécurité)
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin'); // <== CET IMPORT MANQUAIT !

// --- IMPORTATION DES ROUTES ---
const bookingRoutes = require('./routes/bookingRoutes');
const priceRoutes = require('./routes/priceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- INITIALISATION FIREBASE ADMIN ---
if (!admin.apps.length) {
    try {
        let serviceAccount;
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Sur Render, on parse la variable d'env
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            // En local, on cherche le fichier
            const serviceAccountPath = path.join(__dirname, 'serviceAccount.json');
            serviceAccount = require(serviceAccountPath);
        }
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin initialisé");
    } catch (error) {
        console.error("❌ Erreur Firebase Admin:", error.message);
        // On ne crash pas le serveur, mais les routes protégées risquent de faillir
    }
}

// --- MIDDLEWARES ---

// WEBHOOK STRIPE (Doit être en RAW et AVANT express.json)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use(cors({
    origin: ['https://gyo-app.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// --- ROUTES ---
app.use('/api/bookings', bookingRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

// --- ERREUR 404 ---
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée sur le serveur GYO" });
});

// --- GESTIONNAIRE D'ERREURS GLOBAL ---
app.use((err, req, res, next) => {
    console.error("🚨 Erreur Serveur:", err.stack);
    res.status(500).json({ error: "Erreur interne du serveur GYO" });
});

module.exports = app;