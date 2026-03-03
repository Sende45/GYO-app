// 1. TOUJOURS CHARGER DOTENV EN PREMIER
require('dotenv').config(); 

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

const app = express();

// Vérification console pour Stripe
console.log("Clé Stripe chargée :", process.env.STRIPE_SECRET_KEY ? "OUI ✅" : "NON ❌");

// --- CONFIGURATION FIREBASE (MODIFIÉE POUR RENDER) ---
try {
    let serviceAccount;

    // Vérifie si on est sur Render (via la variable d'environnement)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log("Mode : Chargement Firebase via Variable d'environnement (Render) ☁️");
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } 
    // Sinon, on est en local sur ton PC
    else {
        console.log("Mode : Chargement Firebase via fichier local (PC) 💻");
        const serviceAccountPath = path.join(__dirname, "serviceAccount.json");
        serviceAccount = require(serviceAccountPath);
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    console.log("Firebase Admin initialisé : OUI ✅");
} catch (error) {
    console.error("❌ ERREUR FIREBASE :", error.message);
    // On ne coupe le serveur que si aucune config n'est trouvée
    if (!process.env.FIREBASE_SERVICE_ACCOUNT && !path.join(__dirname, "serviceAccount.json")) {
        process.exit(1);
    }
}

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
            metadata: { 
                userId: userId, 
                sessionsCount: sessionsCount ? sessionsCount.toString() : "0", 
                planName: planName 
            }
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Erreur Session:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route 2 : Le Webhook (Indispensable pour mettre à jour Firestore)
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Erreur Webhook Signature:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, sessionsCount, planName } = session.metadata;

        console.log(`💰 Paiement réussi pour l'utilisateur : ${userId}`);

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        try {
            const userRef = db.collection("users").doc(userId);
            const userDoc = await userRef.get();
            
            const currentSessions = userDoc.exists ? (userDoc.data()?.subscription?.remainingSessions || 0) : 0;

            await userRef.set({
                subscription: {
                    planName: planName,
                    status: "active",
                    expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
                    remainingSessions: currentSessions + parseInt(sessionsCount),
                },
                lastPurchaseDate: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log("✅ Firestore mis à jour avec succès !");
        } catch (dbError) {
            console.error("❌ Erreur Firestore:", dbError);
        }
    }
    res.json({received: true});
});

// Utilisation dynamique du port pour Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur GYO actif sur le port ${PORT}`));