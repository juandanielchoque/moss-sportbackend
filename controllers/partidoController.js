// controllers/partidoController.js

const Partido = require('../models/Partido');

//fecha
const mysqlDateFormat = (isoDate) => {
  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};



const createPartido = async (req, res) => {
  const { torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro, categoria_id } = req.body;
  
  try {
    // Crear el partido
    const partido = await Partido.create({ torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro });

    // Asegurarse de que el partido se asocie solo a la categoría seleccionada
    await db.query(
      `INSERT INTO torneo_categorias (torneo_id, categoria_id) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE categoria_id = categoria_id`, 
      [torneo_id, categoria_id]
    );

    // Retornar el partido creado
    res.status(201).json(partido);
  } catch (err) {
    console.error('Error al crear el partido:', err);
    res.status(500).json({ message: 'Error al crear el partido', error: err.message });
  }
};


const getAllPartidos = async (req, res) => {
  try {
    const partidos = await Partido.getAll();
    res.status(200).json(partidos);
  } catch (err) {
    console.error('Error al obtener los partidos:', err);
    res.status(500).json({ message: 'Error al obtener los partidos', error: err.message });
  }
};

const getPartidoById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const partido = await Partido.getById(id);
    if (partido) {
      res.status(200).json(partido);
    } else {
      res.status(404).json({ message: 'Partido no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el partido:', err);
    res.status(500).json({ message: 'Error al obtener el partido', error: err.message });
  }
};

const updatePartido = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  // Convierte el campo fecha_hora si existe
  if (updatedFields.fecha_hora) {
    updatedFields.fecha_hora = mysqlDateFormat(updatedFields.fecha_hora);
  }

  try {
    const partidoActualizado = await Partido.update(Number(id), updatedFields);
    if (partidoActualizado) {
      res.status(200).json({
        message: 'Partido actualizado exitosamente.',
        partido: partidoActualizado,
      });
    } else {
      res.status(404).json({ message: 'Partido no encontrado.' });
    }
  } catch (err) {
    console.error('Error al actualizar el partido:', err.message);
    res.status(500).json({ 
      message: 'Error al actualizar el partido.',
      error: err.message 
    });
  }
};



const deletePartido = async (req, res) => {
  const { id } = req.params;
  
  try {
    const partidoEliminado = await Partido.delete(id);
    if (partidoEliminado) {
      res.status(200).json({ message: 'Partido eliminado' });
    } else {
      res.status(404).json({ message: 'Partido no encontrado' });
    }
  } catch (err) {
    console.error('Error al eliminar el partido:', err);
    res.status(500).json({ message: 'Error al eliminar el partido', error: err.message });
  }
};

module.exports = {
  createPartido,
  getAllPartidos,
  getPartidoById,
  updatePartido,
  deletePartido
};
