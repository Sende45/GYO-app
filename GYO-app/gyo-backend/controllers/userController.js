const User = require('../models/User');
const bcrypt = require('bcrypt');

// --- CONNEXION (LOGIN) ---
// C'est ici que tu utiliseras Yohane#6002
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Chercher l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // 2. Comparer le mot de passe envoyé avec le hash stocké en DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // 3. Réponse en cas de succès
        // On renvoie les infos de l'utilisateur (sans le password) pour le frontend
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json({
            message: "Connexion réussie",
            user: userWithoutPassword
        });

    } catch (err) {
        console.error("❌ Erreur Login:", err.message);
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
};

// --- RÉCUPÉRER UN PROFIL ---
exports.getUserProfile = async (req, res) => {
    try {
        // On cherche par _id (MongoDB) ou email selon ta préférence
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