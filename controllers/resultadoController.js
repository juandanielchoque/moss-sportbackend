const Resultado = require('../models/Resultado');

// Renombrar getResultados a getAllResultados para coincidir con la ruta
exports.getAllResultados = async (req, res) => {
  try {
    const resultados = await Resultado.findAll();
    res.status(200).json({
      success: true,
      data: resultados
    });
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener resultados',
      error: error.message 
    });
  }
};

exports.createResultado = async (req, res) => {
  try {
    const resultado = await Resultado.create(req.body);
    res.status(201).json({
      success: true,
      data: resultado,
      message: 'Resultado creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear resultado:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear resultado',
      error: error.message 
    });
  }
};

// Agregar método para obtener resultados por partido
exports.getResultadosByPartido = async (req, res) => {
  const { partidoId } = req.params;
  try {
    const resultados = await Resultado.findByPartido(partidoId);
    res.status(200).json({
      success: true,
      data: resultados
    });
  } catch (error) {
    console.error('Error al obtener resultados del partido:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener resultados del partido',
      error: error.message 
    });
  }
};

// Agregar método para actualizar resultado
exports.updateResultado = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await Resultado.update(id, req.body);
    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: 'Resultado no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: resultado,
      message: 'Resultado actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar resultado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar resultado',
      error: error.message 
    });
  }
};

// Agregar método para eliminar resultado
exports.deleteResultado = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await Resultado.delete(id);
    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: 'Resultado no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Resultado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar resultado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar resultado',
      error: error.message 
    });
  }
};