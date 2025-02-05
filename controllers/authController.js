const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const JWT_SECRET = process.env.JWT_SECRET || "Error no hay clave secreta";

const authController = {
  async register(req, res) {
    const { nombre, email, password, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password || !rol) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos." });
    }

    // Validar formato del correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Formato de correo electrónico no válido." });
    }

    // Validar rol
    const validRoles = ["administrador", "capitan"];
    if (!validRoles.includes(rol)) {
      return res.status(400).json({ message: "Rol no válido." });
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = await Usuario.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "El correo electrónico ya está registrado." });
      }

      // Crear el usuario en la base de datos
      const nuevoUsuario = await Usuario.create(nombre, email, password, rol);

      // Devolver el ID del usuario recién creado
      res.status(201).json({
        message: "Usuario registrado exitosamente.",
        id: nuevoUsuario.id, // Devuelve el ID del usuario
      });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      res.status(500).json({ message: "Error al registrar el usuario." });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("Datos recibidos:", { email, password });
  
      const user = await Usuario.findByEmail(email);
      console.log("Resultado de la consulta:", user);
  
      if (!user) {
        console.log("Usuario no encontrado");
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Contraseña válida:", isPasswordValid);
  
      if (!isPasswordValid) {
        console.log("Contraseña inválida");
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        });
      }
  
      const token = jwt.sign(
        { id: user.id, rol: user.rol, nombre: user.nombre },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      const userResponse = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      };
  
      console.log("Enviando respuesta exitosa:", { userResponse, token });
  
      // **Correction:** Send `success: true` only on successful login
      res.status(200).json({
        success: true,
        message: "Login exitoso",
        token,
        user: userResponse
      });
  
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        message: "Error en el servidor",
        error: error.message
      });
    }
  },

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
  
      const query = "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?";
      const [user] = await db.query(query, [userId]);
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // **Destructuring for cleaner variable names**
      const { id, nombre, email, rol } = user;
  
      res.json({
        id,
        nombre,
        email,
        rol,
      });
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      res
        .status(500)
        .json({ message: "Error al obtener el perfil del usuario" });
    }
  },

  async obtenerUsuarioPorId(req, res) {
    try {
      const userId = req.params.id; 

      const query = "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?";
      const [user] = await db.query(query, [userId]);

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const { id, nombre, email, rol } = user[0];

      res.json({
        id,
        nombre,
        email,
        rol,
      });
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  },
  
};


module.exports = authController;