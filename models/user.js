// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
      message: props => `${props.value} n'est pas un email valide!`
    }
  },
  motDePasse: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'medecin', 'client'],
    default: 'client'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasse);
};

// Hachage du mot de passe avant la sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

// Créer un modèle à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User;
