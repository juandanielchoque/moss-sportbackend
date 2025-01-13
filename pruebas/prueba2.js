// models/Categoria.js

const db = require('../config/db'); // Asegúrate de tener la conexión a la base de datos

// Obtener categorías por torneo
const getCategoriasByTorneo = async (torneoId) => {
  try {
    const [result] = await db.query(`
      SELECT c.id, c.nombre
      FROM categorias c
      JOIN torneo_categorias tc ON c.id = tc.categoria_id
      WHERE tc.torneo_id = ?
    `, [torneoId]);

    return result; // Retorna las categorías asociadas al torneo
  } catch (error) {
    throw new Error('Error al obtener categorías por torneo: ' + error.message);
  }
};

// Obtener todas las categorías
const getAllCategorias = async () => {
  try {
    const [result] = await db.query(`
      SELECT id, nombre
      FROM categorias
    `);

    return result; // Retorna todas las categorías
  } catch (error) {
    throw new Error('Error al obtener todas las categorías: ' + error.message);
  }
};

// Crear una nueva categoría
const createCategoria = async (nombre, torneoId) => {
  try {
    const [result] = await db.query(`
      INSERT INTO categorias (nombre)
      VALUES (?)
    `, [nombre]);

    // Si se proporciona un torneoId, asociar la categoría al torneo
    if (torneoId) {
      await db.query(`
        INSERT INTO torneo_categorias (categoria_id, torneo_id)
        VALUES (?, ?)
      `, [result.insertId, torneoId]);
    }

    return { id: result.insertId, nombre };
  } catch (error) {
    throw new Error('Error al crear la categoría: ' + error.message);
  }
};

// Actualizar una categoría
const updateCategoria = async (id, nombre) => {
  try {
    const [result] = await db.query(`
      UPDATE categorias
      SET nombre = ?
      WHERE id = ?
    `, [nombre, id]);

    return result.affectedRows > 0;
  } catch (error) {
    throw new Error('Error al actualizar la categoría: ' + error.message);
  }
};

// Eliminar una categoría
const deleteCategoria = async (id) => {
  try {
    // Primero eliminamos las asociaciones con torneos
    await db.query(`
      DELETE FROM torneo_categorias
      WHERE categoria_id = ?
    `, [id]);

    // Luego eliminamos la categoría
    const [result] = await db.query(`
      DELETE FROM categorias
      WHERE id = ?
    `, [id]);

    return result.affectedRows > 0;
  } catch (error) {
    throw new Error('Error al eliminar la categoría: ' + error.message);
  }
};

// Obtener categorías con torneos, equipos y capitanes asociados
const getCategoriasWithTorneosEquipos = async () => {
  try {
    const [result] = await db.query(`
      SELECT 
        c.id AS categoria_id,
        c.nombre AS categoria,
        t.id AS torneo_id,
        t.nombre AS torneo,
        e.id AS equipo_id,
        e.nombre AS equipo,
        j.nombre AS capitan
      FROM 
        categorias c
      JOIN 
        torneo_categorias tc ON c.id = tc.categoria_id
      JOIN 
        torneos t ON tc.torneo_id = t.id
      JOIN 
        equipo_torneos et ON t.id = et.torneo_id
      JOIN 
        equipos e ON et.equipo_id = e.id
      LEFT JOIN 
        usuarios j ON e.capitan_id = j.id
    `);

    return result; // Retorna las categorías, torneos, equipos y capitanes
  } catch (error) {
    throw new Error('Error al obtener categorías, torneos, equipos y capitanes: ' + error.message);
  }
};

// Obtener categorías con torneos asociados
const getCategoriasConTorneos = async () => {
  try {
    const [result] = await db.query(`
      SELECT 
        c.id AS categoria_id,
        c.nombre AS categoria_nombre,
        t.id AS torneo_id,
        t.nombre AS torneo_nombre
      FROM 
        categorias c
      JOIN 
        torneo_categorias tc ON c.id = tc.categoria_id
      JOIN 
        torneos t ON tc.torneo_id = t.id
    `);

    return result; // Retorna las categorías y torneos asociados
  } catch (error) {
    throw new Error('Error al obtener categorías con torneos: ' + error.message);
  }
};

module.exports = {
  getAllCategorias,
  getCategoriasByTorneo,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriasWithTorneosEquipos,
  getCategoriasConTorneos,
};
