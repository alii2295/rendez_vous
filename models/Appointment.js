// models/Appointment.js
const mongoose = require('mongoose');

// Définir le schéma du rendez-vous
const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur (client)
    required: true
  },
  professionnel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur (professionnel)
    required: true
  },
  dateRendezVous: {
    type: Date,
    required: true
  },
  typeRendezVous: {
    type: String,
    enum: ['consultation', 'coaching', 'juridique'], // Type de rendez-vous (à ajuster selon votre projet)
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmé', 'annulé'],
    default: 'en_attente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Créer un modèle pour les rendez-vous
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
