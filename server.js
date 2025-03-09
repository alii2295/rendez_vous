// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware pour traiter les données JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB', err);
  });

// Route pour s'inscrire
app.post('/api/register', async (req, res) => {
  const { nom, prenom, email, motDePasse, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà.' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({ nom, prenom, email, motDePasse, role });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Route pour se connecter (authentification)
app.post('/api/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Route pour obtenir la liste des utilisateurs (accessible uniquement pour les admins)
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
  });
  
  // Route pour obtenir les détails d'un utilisateur par ID
  app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des détails de l\'utilisateur' });
    }
  });
  
  // Route pour supprimer un utilisateur (accessible uniquement pour les admins)
  app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  });
  app.use('/api', appointmentRoutes); // Ajoutez cette ligne pour gérer les rendez-vous


// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
