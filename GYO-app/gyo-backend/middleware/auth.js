const User = require('../models/User');

/**
 * Middleware de sécurité GYO : 
 * Vérifie les droits Staff directement dans MongoDB via l'email.
 */
const verifyAdmin = async (req, res, next) => {
    try {
        // On récupère l'identifiant envoyé par ton intercepteur Axios
        // .toLowerCase() évite les problèmes si l'email est envoyé avec des majuscules
        const userEmail = req.headers['x-user-email'] ? req.headers['x-user-email'].toLowerCase() : null; 

        if (!userEmail) {
            return res.status(401).json({ error: "Identification manquante (Header 'x-user-email' requis)." });
        }

        // Vérification directe dans ta base MongoDB
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable dans le système GYO." });
        }

        // ✅ MODIF : On autorise 'admin' ET 'agent' (le staff du spa)
        // Les agents doivent pouvoir valider les réservations sur le dashboard
        const authorizedRoles = ['admin', 'agent'];

        if (!authorizedRoles.includes(user.role)) {
            console.warn(`🚨 Tentative d'accès refusée : ${userEmail} (Rôle: ${user.role}) a tenté d'accéder à une zone protégée.`);
            return res.status(403).json({ error: "Accès interdit. Droits Staff GYO requis." });
        }

        // Si tout est OK, on attache l'utilisateur à la requête pour les étapes suivantes
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Erreur Middleware Sécurité :", error.message);
        res.status(500).json({ error: "Erreur interne lors de la vérification des droits." });
    }
};

module.exports = { verifyAdmin };