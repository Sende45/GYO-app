const express = require('express');
const cors = require('cors');
const app = express();

// Autorise les requêtes provenant d'autres sites (ton app mobile par exemple)
app.use(cors({ origin: true }));
app.use(express.json());

// Route de test
app.get('/hello', (req, res) => {
  res.status(200).send("Salut Yohanne ! Ton API fonctionne sans clé JSON !");
});

// Route pour tester la base de données
app.get('/users', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// On exporte l'application vers Firebase
exports.api = onRequest(app);