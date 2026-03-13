require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// --- CONNEXION MONGODB ATLAS ---
// On retire useNewUrlParser et useUnifiedTopology car ils sont obsolètes
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("-----------------------------------------");
        console.log("✅ CORE ENGINE : MongoDB Connecté (GYO)");
        
        const server = app.listen(PORT, () => {
            console.log(`🚀 SERVEUR ACTIF SUR LE PORT : ${PORT}`);
            console.log("-----------------------------------------");
        });

        // GESTION DU SHUTDOWN PROPRE
        process.on('SIGTERM', () => {
            console.log('SIGTERM reçu. Fermeture du serveur GYO...');
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('MongoDB déconnecté.');
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

mongoose.connection.on('error', err => {
    console.error('⚠️ MongoDB Error:', err);
});