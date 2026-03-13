const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// Route : Créer Session
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
            metadata: { userId, sessionsCount: sessionsCount.toString(), planName }
        });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route : Webhook (Logique MongoDB intégrée)
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, sessionsCount, planName } = session.metadata;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        await User.findOneAndUpdate(
            { userId },
            { 
                $set: { "subscription.planName": planName, "subscription.status": "active", "subscription.expiryDate": expiryDate },
                $inc: { "subscription.remainingSessions": parseInt(sessionsCount) }
            },
            { upsert: true }
        );
    }
    res.json({ received: true });
});

module.exports = router;