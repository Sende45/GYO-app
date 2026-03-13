const Price = require('../models/Price');

exports.getAllPrices = async (req, res) => {
    try {
        // On récupère les services classés par catégorie
        const prices = await Price.find().sort({ category: 1 });
        res.json(prices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};