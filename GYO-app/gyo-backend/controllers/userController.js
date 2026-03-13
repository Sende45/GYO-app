const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- CONNEXION (LOGIN) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Chercher l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // 🛡️ MODIF DE SÉCURITÉ : Vérifier si le mot de passe existe en base
        // Si tu as un ancien compte sans mot de passe (ex: pur Firebase), ça évitera le crash 500
        if (!user.password) {
            console.error(`🚨 L'utilisateur ${email} n'a pas de mot de passe défini dans MongoDB.`);
            return res.status(400).json({ message: "Compte mal configuré. Contactez l'administrateur." });
        }

        // 2. Comparer le mot de passe envoyé avec le hash stocké en DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // 3. Réponse en cas de succès
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json({
            message: "Connexion réussie",
            user: userWithoutPassword
        });

    } catch (err) {
        // Log précis pour Render
        console.error("❌ Erreur Critique Login:", err.message);
        res.status(500).json({ error: "Erreur interne lors de la connexion" });
    }
};

// --- RÉCUPÉRER UN PROFIL ---
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé dans la base GYO" });
        }
        
        res.status(200).json(user);
    } catch (err) {
        console.error("❌ Erreur getUserProfile:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// --- RÉCUPÉRER TOUS LES UTILISATEURS (Admin Uniquement) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Erreur getAllUsers:", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération de la liste des membres." });
    }
};