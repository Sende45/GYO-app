const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

/**
 * Génère une session Stripe Checkout dynamique
 * Gère : 
 * 1. Paiement à l'acte (Coupes, Massages)
 * 2. Abonnements récurrents (Solo, Luxe, VIP)
 * 3. Cartes Cadeaux
 */
exports.createCheckoutSession = async (req, res) => {
    const { 
        priceId, 
        userId, 
        email, 
        planName, 
        sessionsCount, 
        isSubscription, // Booleen: true pour Solo/Luxe/VIP
        category        // 'Service', 'Abonnement', ou 'GiftCard'
    } = req.body;

    try {
        // Construction de la session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // 'subscription' active le prélèvement auto mensuel, 'payment' est pour le one-shot
            mode: isSubscription ? 'subscription' : 'payment',
            
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/subscriptions`,
            customer_email: email,
            
            // Les metadata sont CRUCIALES : elles permettent au Webhook de mettre à jour MongoDB
            metadata: { 
                userId: userId || "GUEST", 
                sessionsCount: sessionsCount ? sessionsCount.toString() : "0", 
                planName: planName || "Service Simple",
                category: category,
                isGiftCard: (category === 'GiftCard').toString()
            }
        });

        // On renvoie l'URL de redirection vers Stripe
        res.json({ url: session.url });

    } catch (error) {
        console.error("❌ Erreur Stripe Session:", error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Récupère les informations d'une session après paiement (Optionnel)
 */
exports.getSessionStatus = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        res.json({
            status: session.status,
            customer_email: session.customer_details.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};