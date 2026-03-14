const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- 1. INSCRIPTION (REGISTER) ---
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName,
            role: 'client'
        });

        await newUser.save();
        
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        
        // MODIFICATION ICI : On envoie les données à plat
        res.status(201).json({ 
            message: "Utilisateur créé avec succès", 
            ...userWithoutPassword 
        });

    } catch (err) {
        console.error("❌ Erreur Register:", err.message);
        res.status(500).json({ error: "Erreur lors de la création du compte." });
    }
};

// --- 2. CONNEXION (LOGIN) ---
exports.login = async (req, res) => {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        // MODIFICATION ICI : On "étale" userWithoutPassword pour que le frontend 
        // puisse lire directement data.email ou data.role
        res.status(200).json({
            message: "Connexion réussie",
            ...userWithoutPassword
        });

    } catch (err) {
        console.error("❌ Erreur Login:", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
};

// --- 3. RÉCUPÉRER UN PROFIL PAR EMAIL ---
exports.getUserProfile = async (req, res) => {
    try {
        const email = req.params.email.toLowerCase();
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error("❌ Erreur getUserProfile:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// --- 4. RÉCUPÉRER TOUS LES UTILISATEURS ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Erreur getAllUsers:", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération des membres." });
    }
};

// --- 🔥 5. ROUTE DE SECOURS (RESET ADMIN) ---
exports.resetAdminPassword = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash("Yohane#6002", salt);
        
        const result = await User.findOneAndUpdate(
            { email: "yohannesende@gmail.com" },
            { 
                password: securePassword,
                role: 'admin'
            },
            { new: true }
        );

        if (!result) return res.status(404).send("Compte admin introuvable.");
        
        res.send("<h1>Succès !</h1><p>Le mot de passe a été mis à jour.</p>");
    } catch (err) {
        res.status(500).send("Erreur: " + err.message);
    }
};