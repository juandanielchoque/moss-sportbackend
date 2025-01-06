const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.post('/register', authController.register); // Registro de usuario
router.post('/login', authController.login);       // Login de usuario
router.get('/profile', authMiddleware, authController.getProfile); // Ruta protegida para el perfil

module.exports = router;
