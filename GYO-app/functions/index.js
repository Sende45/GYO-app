const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")("SK_TEST_TON_SECRET_STRIPE"); // Ta clé secrète

admin.initializeApp();

// 1. FONCTION : Créer la session Stripe
exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  // Vérifier si l'utilisateur est authentifié
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Vous devez être connecté.');
  }

  const { priceId, planName, sessionsCount } = data;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription', // ou 'payment' pour un achat unique
      success_url: 'https://ton-site.com/success',
      cancel_url: 'https://ton-site.com/subscriptions',
      customer_email: context.auth.token.email,
      metadata: {
        userId: context.auth.uid,
        sessionsCount: sessionsCount,
        planName: planName
      }
    });

    return { sessionId: session.id };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// 2. WEBHOOK : Écoute Stripe pour valider l'abonnement
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Vérifie que l'event vient bien de Stripe
    event = stripe.webhooks.constructEvent(req.rawBody, sig, "WHSEC_VOTRE_WEBHOOK_SECRET");
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, sessionsCount, planName } = session.metadata;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const userRef = admin.firestore().collection("users").doc(userId);
    
    // On utilise une transaction pour le cumul sécurisé
    await admin.firestore().runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      const currentSessions = userDoc.data()?.subscription?.remainingSessions || 0;

      t.update(userRef, {
        subscription: {
          planName: planName,
          status: "active",
          expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
          remainingSessions: currentSessions + parseInt(sessionsCount),
        },
        lastPurchaseDate: admin.firestore.FieldValue.serverTimestamp()
      });
    });
  }

  res.json({ received: true });
});