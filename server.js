// server.js
const cron = require('node-cron');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const appointmentController = require('./controllers/appointmentController');

dotenv.config();

const app = express();

app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Routes
app.use('/api', userRoutes);
app.use('/api', appointmentRoutes);

// Planifier l'envoi des rappels
cron.schedule('0 0 9 * * *', async () => { // Planifie tous les jours à 9h00
  try {
    await appointmentController.sendReminderEmails();
    console.log('Rappels envoyés');
  } catch (err) {
    console.error('Erreur lors de l\'envoi des rappels', err);
  }
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
