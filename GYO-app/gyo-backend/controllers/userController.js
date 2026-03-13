const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};