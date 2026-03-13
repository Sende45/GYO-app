require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Configuration des options de connexion (évite les warnings Mongoose)
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// --- CONNEXION MONGODB ATLAS ---
mongoose.connect(process.env.MONGO_URI, connectionOptions)
    .then(() => {
        console.log("-----------------------------------------");
        console.log("✅ CORE ENGINE : MongoDB Connecté (GYO)");
        
        const server = app.listen(PORT, () => {
            console.log(`🚀 SERVEUR ACTIF SUR LE PORT : ${PORT}`);
            console.log("-----------------------------------------");
        });

        // GESTION DU SHUTDOWN PROPRE (Pour Render)
        process.on('SIGTERM', () => {
            console.log('SIGTERM reçu. Fermeture du serveur GYO...');
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('MongoDB déconnecté. Fin du processus.');
                    process.exit(0);
                });
            });
        });
    })
    .catch((err) => {
        console.error("❌ ERREUR CRITIQUE DE CONNEXION :");
        console.error(err.message);
        process.exit(1);
    });

// Gestion des erreurs de base de données après connexion
mongoose.connection.on('error', err => {
    console.error('⚠️ MongoDB Error en cours de route:', err);
});