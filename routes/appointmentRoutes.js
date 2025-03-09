// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
/*const authMiddleware = require('../middlewares/authMiddleware');*/
const {
    createAppointment,
    getAppointments,
    cancelAppointment
  } = require('../controllers/appointmentController');
  
// Créer un rendez-vous (route protégée)
router.post('/appointments', createAppointment);

// Lister les rendez-vous d'un utilisateur (route protégée)
router.get('/appointments/:userId', getAppointments);

// Annuler un rendez-vous (route protégée)
router.put('/appointments/:appointmentId/cancel', cancelAppointment);

module.exports = router;
