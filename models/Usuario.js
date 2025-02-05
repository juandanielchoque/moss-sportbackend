const bcrypt = require("bcrypt");
const db = require("../config/db");

const Usuario = {
  async create(nombre, email, password, rol) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // 1. Insertar el usuario
      const insertQuery = `
        INSERT INTO usuarios (nombre, email, password, rol)
        VALUES (?, ?, ?, ?);
      `;
      const [insertResult] = await db.query(insertQuery, [
        nombre,
        email,
        hashedPassword,
        rol,
      ]);

      // 2. Obtener el ID del usuario recién creado
      const idQuery = `SELECT LAST_INSERT_ID() AS id;`;
      const [idResult] = await db.query(idQuery);

      // Extraer el ID del resultado
      const userId = idResult[0].id;

      return { id: userId }; // Devuelve el ID del usuario
    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
      throw new Error("No se pudo crear el usuario.");
    }
  },

  async findByEmail(email) {
    try {
      const query = "SELECT * FROM usuarios WHERE email = ?";
      const [rows] = await db.query(query, [email]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      throw error;
    }
  },

  async verifyPassword(providedPassword, storedPassword) {
    try {
      return await bcrypt.compare(providedPassword, storedPassword);
    } catch (error) {
      console.error("Error en verificación de contraseña:", error);
      throw error;
    }
  },
};

module.exports = Usuario;