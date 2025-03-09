// config/email.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Créez un transporteur Nodemailer (exemple avec un compte Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Vous pouvez utiliser d'autres services comme SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Votre adresse e-mail
    pass: process.env.EMAIL_PASS  // Votre mot de passe ou un mot de passe d'application
  }
});

module.exports = transporter;

