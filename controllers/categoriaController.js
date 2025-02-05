const db = require("../config/db");

const Categoria = require('../models/Categoria');

// Obtener todas las categorías

exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.getAll();
    res.status(200).json({ success: true, data: categorias });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categorías.', error: error.message });
  }
};

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res
      .status(400)
      .json({ success: false, message: "El nombre es obligatorio." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO categorias (nombre) VALUES (?)",
      [nombre]
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Categoría creada exitosamente.",
        data: { id: result.insertId, nombre },
      });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al crear la categoría.",
        error: error.message,
      });
  }
};

// Eliminar una categoría por ID
exports.eliminarCategoria = async (req, res) => {
  const categoriaId = req.params.id;

  try {
    const [result] = await db.query("SELECT * FROM categorias WHERE id = ?", [
      categoriaId,
    ]);

    if (result.length > 0) {
      // Eliminar filas relacionadas en la tabla disciplina_categorias
      await db.query(
        "DELETE FROM disciplina_categorias WHERE categoria_id = ?",
        [categoriaId]
      );

      // Eliminar la categoría
      await db.query("DELETE FROM categorias WHERE id = ?", [categoriaId]);
      res
        .status(200)
        .json({ success: true, message: "Categoría eliminada exitosamente." });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Categoría no encontrada." });
    }
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al eliminar la categoría.",
        error: error.message,
      });
  }
};
