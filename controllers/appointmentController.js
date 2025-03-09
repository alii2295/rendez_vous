// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/user');

// Créer un rendez-vous
exports.createAppointment = async (req, res) => {
  const { clientId, professionnelId, dateRendezVous, typeRendezVous } = req.body;

  try {
    // Vérifier si les utilisateurs existent
    const client = await User.findById(clientId);
    const professionnel = await User.findById(professionnelId);

    if (!client || !professionnel) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Créer le rendez-vous
    const newAppointment = new Appointment({
      client: clientId,
      professionnel: professionnelId,
      dateRendezVous,
      typeRendezVous
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Rendez-vous créé avec succès', appointment: newAppointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous' });
  }
};

// Lister les rendez-vous d'un utilisateur (client ou professionnel)
exports.getAppointments = async (req, res) => {
  const { userId } = req.params;

  try {
    // Récupérer tous les rendez-vous pour l'utilisateur (client ou professionnel)
    const appointments = await Appointment.find({
      $or: [
        { client: userId },
        { professionnel: userId }
      ]
    }).populate('client professionnel', 'nom prenom email'); // Populer les informations des utilisateurs

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous' });
  }
};

// Annuler un rendez-vous
exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Modifier le statut à "annulé"
    appointment.statut = 'annulé';
    await appointment.save();

    res.status(200).json({ message: 'Rendez-vous annulé avec succès', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l\'annulation du rendez-vous' });
  }
};
