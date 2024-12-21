const db = require('../config/db');

// Crear usuario
async function create(nombre, email, password, rol) {
  try {
    const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [nombre, email, password, rol]);
    return result;
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
}

// Buscar usuario por email
async function findByEmail(email) {
  try {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0];
  } catch (error) {
    console.error('Error al buscar usuario por email:', error);
    throw error;
  }
}

module.exports = {
  create,
  findByEmail,
};
