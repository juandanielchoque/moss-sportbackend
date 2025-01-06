const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta directamente en el código
const JWT_SECRET = 'mi_clave_secreta_personalizada';

const authController = {
  // Registrar usuario
  async register(req, res) {
    const { nombre, email, password, rol } = req.body;

    // Validar campos
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de correo electrónico no válido.' });
    }

    // Validar rol
    const validRoles = ['administrador', 'capitan'];
    if (!validRoles.includes(rol)) {
      return res.status(400).json({ message: 'Rol no válido.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Usuario.create(nombre, email, hashedPassword, rol);
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error al registrar el usuario.', error: error.message || error });
    }
  },

  // Iniciar sesión
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await Usuario.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }

      // Usar la clave secreta definida directamente en el código
      const token = jwt.sign({ id: user.id, rol: user.rol, nombre: user.nombre }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login exitoso.', token });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).json({ message: 'Error en el inicio de sesión.', error: error.message || error });
    }
  },

  // Obtener perfil del usuario
  async getProfile(req, res) {
    const userId = req.user.id; // El ID del usuario se obtiene del token

    try {
      const user = await Usuario.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error al obtener el perfil.', error: error.message || error });
    }
  },
};

module.exports = authController;
