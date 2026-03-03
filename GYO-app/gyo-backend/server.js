const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuration Firebase Admin (Indispensable pour toucher à ta DB)
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());

// Route 1 : Créer la session de paiement
app.post('/create-checkout-session', express.json(), async (req, res) => {
  const { priceId, userId, email, planName, sessionsCount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://votre-site-gyo.web.app/success',
      cancel_url: 'https://votre-site-gyo.web.app/subscriptions',
      customer_email: email,
      metadata: { userId, sessionsCount, planName }
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route 2 : Le Webhook (Appelé par Stripe après paiement)
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
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

    // Mise à jour Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const currentSessions = userDoc.data()?.subscription?.remainingSessions || 0;

    await userRef.update({
      subscription: {
        planName,
        status: "active",
        expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
        remainingSessions: currentSessions + parseInt(sessionsCount),
      },
      lastPurchaseDate: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  res.json({received: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur GYO actif sur le port ${PORT}`));