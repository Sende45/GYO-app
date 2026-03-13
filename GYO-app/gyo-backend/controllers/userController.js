const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- 1. INSCRIPTION (REGISTER) - Pour corriger ton erreur 404 ---
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création du nouvel utilisateur
        const newUser = new User({
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName,
            role: 'client' // Rôle par défaut
        });

        await newUser.save();
        
        // On retourne l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json({ 
            message: "Utilisateur créé avec succès", 
            user: userWithoutPassword 
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
        console.log(`Attempting login for: ${email}`);

        const user = await User.findOne({ email: email });
        
        if (!user) {
            console.warn(`⚠️ Login fail: User ${email} not found.`);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (!user.password) {
            console.error(`🚨 Password missing in DB for ${email}`);
            return res.status(400).json({ message: "Compte mal configuré (Pas de password)." });
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

// --- 3. RÉCUPÉRER UN PROFIL PAR EMAIL (Utilisé par SuccessPage) ---
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

// --- 4. RÉCUPÉRER TOUS LES UTILISATEURS (Admin) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Erreur getAllUsers:", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération des membres." });
    }
};

// --- 🔥 5. ROUTE DE SECOURS (RESET ADMIN) 🔥 ---
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
        
        console.log("✅ Admin password reset via emergency route");
        res.send("<h1>Succès !</h1><p>Le mot de passe de <b>yohannesende@gmail.com</b> a été mis à jour avec le hash correct.</p>");
    } catch (err) {
        res.status(500).send("Erreur: " + err.message);
    }
};