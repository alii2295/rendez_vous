const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware pour vérifier l'authentification et le rôle
const auth = (roleRequired = 'client') => {
  return async (req, res, next) => {
    // Récupérer le token depuis l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé' });
    }

    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Vérifier si l'utilisateur existe
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérifier le rôle
      if (roleRequired && user.role !== roleRequired) {
        return res.status(403).json({ message: 'Accès interdit' });
      }

      // Ajouter l'utilisateur à la requête pour l'utiliser plus tard
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  };
};

module.exports = auth;
