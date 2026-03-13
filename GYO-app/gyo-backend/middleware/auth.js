const User = require('../models/User');

/**
 * Middleware de sécurité GYO : 
 * Vérifie les droits Admin directement dans MongoDB via l'email ou l'ID.
 */
const verifyAdmin = async (req, res, next) => {
    try {
        // On récupère l'identifiant envoyé par le frontend (plus simple avec l'email en dev)
        // Tu peux le passer via le header 'x-user-email' depuis ton AdminDashboard
        const userEmail = req.headers['x-user-email']; 

        if (!userEmail) {
            return res.status(401).json({ error: "Identification manquante (Email requis dans les headers)." });
        }

        // Vérification directe dans ta base MongoDB "GYO"
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable dans la base GYO." });
        }

        // Vérification du rôle stocké en base
        if (user.role !== 'admin') {
            console.warn(`🚨 Tentative d'accès refusée : ${userEmail} n'est pas admin.`);
            return res.status(403).json({ error: "Accès interdit. Droits administrateur requis." });
        }

        // Si tout est OK, on attache l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Erreur Middleware Sécurité :", error.message);
        res.status(500).json({ error: "Erreur interne lors de la vérification des droits." });
    }
};

module.exports = { verifyAdmin };