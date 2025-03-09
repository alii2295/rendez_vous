// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Assurez-vous que le chemin est correct
const {
    register,
    login,
    getUsers,
    getUserById,
    deleteUser
  } = require('../controllers/MangmenuserControleur');
  
router.post('/register',register);
router.post('/login',login);
router.get('/users',getUsers);
router.get('/users/:id',getUserById);
router.delete('/users/:id',deleteUser);

module.exports = router;
