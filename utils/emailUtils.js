// utils/emailUtils.js
const transporter = require('../config/email'); // Importer le transporteur Nodemailer

// Fonction pour envoyer un e-mail de confirmation
const sendConfirmationEmail = (userEmail, appointmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Votre adresse e-mail
    to: userEmail, // L'adresse e-mail du destinataire
    subject: 'Confirmation de votre rendez-vous',
    text: `Bonjour,\n\nVotre rendez-vous avec ${appointmentDetails.professionnel} est confirmé pour le ${appointmentDetails.dateRendezVous}. 
    \n\nType de rendez-vous: ${appointmentDetails.typeRendezVous}.\n\nMerci de votre réservation !`
  };

  return transporter.sendMail(mailOptions);
};

// Fonction pour envoyer un rappel avant un rendez-vous
const sendReminderEmail = (userEmail, appointmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Rappel de votre rendez-vous',
    text: `Bonjour,\n\nCeci est un rappel concernant votre rendez-vous avec ${appointmentDetails.professionnel} prévu pour le ${appointmentDetails.dateRendezVous}. 
    \n\nN'oubliez pas de vous préparer pour votre rendez-vous de type: ${appointmentDetails.typeRendezVous}.`
  };

  return transporter.sendMail(mailOptions);
};

// Fonction pour envoyer une notification de modification ou d'annulation
const sendModificationOrCancellationEmail = (userEmail, appointmentDetails, action) => {
  const subject = action === 'annulé' ? 'Votre rendez-vous a été annulé' : 'Votre rendez-vous a été modifié';
  const message = action === 'annulé' 
    ? `Bonjour,\n\nNous vous informons que votre rendez-vous avec ${appointmentDetails.professionnel} prévu pour le ${appointmentDetails.dateRendezVous} a été annulé.`
    : `Bonjour,\n\nNous vous informons que votre rendez-vous avec ${appointmentDetails.professionnel} a été modifié. Il est désormais prévu pour le ${appointmentDetails.dateRendezVous}.`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: subject,
    text: message
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendConfirmationEmail,
  sendReminderEmail,
  sendModificationOrCancellationEmail
};
