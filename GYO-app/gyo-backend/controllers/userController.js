const User = require('../models/User');

// --- RÉCUPÉRER UN PROFIL (Public/Membre) ---
exports.getUserProfile = async (req, res) => {
    try {
        // Recherche par userId (l'ID unique que tu stockes dans MongoDB)
        const user = await User.findOne({ userId: req.params.userId });
        
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
        // Ton middleware verifyAdmin a déjà validé l'accès avant d'arriver ici
        const users = await User.find({}).sort({ createdAt: -1 }); // Triés du plus récent au plus ancien
        
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Erreur getAllUsers:", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération de la liste des membres." });
    }
};