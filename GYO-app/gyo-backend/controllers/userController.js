const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- CONNEXION (LOGIN) ---
exports.login = async (req, res) => {
    const email = req.body.email ? req.body.email.trim() : "";
    const password = req.body.password;

    try {
        console.log(`Attempting login for: ${email}`);

        const user = await User.findOne({ email: email });
        
        if (!user) {
            console.warn(`⚠️ Login fail: User ${email} not found.`);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (!user.password) {
            console.error(`🚨 Password missing in DB for ${email}`);
            return res.status(400).json({ message: "Compte mal configuré." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            console.warn(`❌ Password mismatch for ${email}`);
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        console.log(`✅ Login success: ${email}`);

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json({
            message: "Connexion réussie",
            user: userWithoutPassword
        });

    } catch (err) {
        console.error("❌ Erreur Login:", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
};

// --- 🔥 ROUTE DE SECOURS (RESET ADMIN) 🔥 ---
// Cette fonction va forcer le bon hash pour ton compte
exports.resetAdminPassword = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash("Yohane#6002", salt);
        
        const result = await User.findOneAndUpdate(
            { email: "yohannesende@gmail.com" },
            { 
                password: securePassword,
                role: 'admin' // On en profite pour s'assurer du rôle
            },
            { new: true }
        );

        if (!result) return res.status(404).send("Compte admin introuvable.");
        
        console.log("✅ Admin password reset via emergency route");
        res.send("<h1>Succès !</h1><p>Le mot de passe de <b>yohannesende@gmail.com</b> a été mis à jour avec le hash correct. Tu peux maintenant fermer cette page et te connecter sur GYO.</p>");
    } catch (err) {
        res.status(500).send("Erreur: " + err.message);
    }
};

// --- RÉCUPÉRER UN PROFIL ---
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- RÉCUPÉRER TOUS LES UTILISATEURS ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des membres." });
    }
};