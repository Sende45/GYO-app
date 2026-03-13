const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// --- ROUTE : CRÉER SESSION DE PAIEMENT ---
router.post('/create-checkout-session', async (req, res) => {
    const { priceId, userId, email, planName, sessionsCount } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: 'https://gyo-app.vercel.app/success',
            cancel_url: 'https://gyo-app.vercel.app/subscriptions',
            customer_email: email,
            metadata: { 
                userId, 
                sessionsCount: sessionsCount.toString(), 
                planName 
            }
        });

        // ✅ MODIFICATION ICI : On renvoie l'URL pour la redirection frontend
        res.json({ url: session.url });
        
    } catch (error) {
        console.error("🚨 Erreur Stripe Session:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// --- ROUTE : WEBHOOK (LOGIQUE MONGODB) ---
// Note : app.use('/api/payments/webhook', express.raw(...)) dans app.js est vital ici
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`❌ Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Traitement une fois le paiement réussi
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, sessionsCount, planName } = session.metadata;
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // Validité 30 jours

        try {
            await User.findOneAndUpdate(
                { userId },
                { 
                    $set: { 
                        "subscription.planName": planName, 
                        "subscription.status": "active", 
                        "subscription.expiryDate": expiryDate 
                    },
                    $inc: { 
                        "subscription.remainingSessions": parseInt(sessionsCount) 
                    }
                },
                { upsert: true, new: true }
            );
            console.log(`✅ Abonnement activé pour l'UID: ${userId}`);
        } catch (dbError) {
            console.error("❌ Erreur MAJ MongoDB via Webhook:", dbError.message);
        }
    }

    res.json({ received: true });
});

module.exports = router;