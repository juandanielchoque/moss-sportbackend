const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);  // Registro de usuario
router.post('/login', authController.login);        // Login de usuario

module.exports = router;
