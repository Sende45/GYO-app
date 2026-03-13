const User = require('../models/User');

/**
 * Middleware de sécurité GYO : 
 * Vérifie l'identité via l'ID utilisateur stocké dans MongoDB.
 */
const verifyAdmin = async (req, res, next) => {
    try {
        // On récupère l'ID envoyé par le frontend (AdminDashboard)
        // On peut le passer via un header personnalisé pour plus de simplicité
        const userId = req.headers['x-user-id']; 

        if (!userId) {
            return res.status(401).json({ error: "Identification manquante (ID requis)." });
        }

        // Vérification directe dans ta base MongoDB "GYO"
        const user = await User.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable dans la base GYO." });
        }

        if (user.role !== 'admin') {
            console.warn(`🚨 Tentative d'accès refusée : UID ${userId} n'est pas admin.`);
            return res.status(403).json({ error: "Accès interdit. Droits administrateur requis." });
        }

        // Si tout est OK, on attache l'utilisateur à la requête et on passe à la suite
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Erreur Middleware Sécurité :", error.message);
        res.status(500).json({ error: "Erreur interne lors de la vérification des droits." });
    }
};

module.exports = { verifyAdmin };