const admin = require('firebase-admin');
const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
    // 1. Récupération du Token dans le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 2. Vérification du token via Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // 3. Vérification du rôle dans MongoDB
        const user = await User.findOne({ userId: userId });

        if (!user || user.role !== 'admin') {
            console.error(`🚨 Tentative d'accès non autorisé par UID: ${userId}`);
            return res.status(403).json({ error: "Privilèges insuffisants. Accès interdit." });
        }

        // 4. Si tout est OK, on continue
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Erreur de validation Token:", error.message);
        res.status(401).json({ error: "Session expirée ou invalide." });
    }
};

module.exports = { verifyAdmin };