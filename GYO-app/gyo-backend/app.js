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

// STRIPE WEBHOOK : En format RAW (Impératif)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Parser JSON pour tout le reste
app.use(express.json());

// ✅ CONFIGURATION CORS DYNAMIQUE (Fix pour Vercel Preview & Custom Headers)
const allowedOrigins = [
    'https://gyo-app.vercel.app', 
    'http://localhost:3000', 
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Autorise les requêtes sans origine (ex: Postman)
        if (!origin) return callback(null, true);
        
        // Autorise les domaines dans la liste OR les domaines de preview Vercel
        const isAllowed = allowedOrigins.includes(origin) || 
                         origin.endsWith('.vercel.app'); 

        if (isAllowed) {
            callback(null, true);
        } else {
            console.error(`🚨 CORS bloqué pour l'origine : ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    // 🔥 AJOUT DES HEADERS AUTORISÉS 🔥
    // On ajoute 'x-user-id' et 'x-user-email' pour que le frontend puisse s'identifier
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'stripe-signature', 
        'x-user-id', 
        'x-user-email'
    ]
}));

// --- DÉCLARATION DES ROUTES API ---
app.use('/api/bookings', bookingRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

// --- GESTION DES ERREURS ---
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée sur le serveur GYO" });
});

app.use((err, req, res, next) => {
    console.error("🚨 Erreur Détectée:", err.message);
    res.status(500).json({ error: "Erreur interne du serveur GYO" });
});

module.exports = app;