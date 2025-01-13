const Equipo = require('../models/Equipo');
const Usuario = require('../models/Usuario');
const Torneo = require('../models/Torneo');

const equipoController = {
  // Crear un equipo con categoría
  // Crear un equipo con categoría
  createEquipo: async (req, res) => {
    const { nombre, capitan_id, torneo_id, categoria_id } = req.body;

    try {
      // Obtener las categorías del torneo
      const categorias = await Equipo.getCategoriasByTorneo(torneo_id);
      console.log('Categorías obtenidas:', categorias); // Agregar para depuración

      // Verificar si la categoría seleccionada es válida
      const categoriaValida = categorias.some(c => c.categoria_id === categoria_id);
      console.log('Categoría válida:', categoriaValida); // Agregar para depuración

      if (!categoriaValida) {
        return res.status(400).json({ message: 'La categoría no existe para este torneo.' });
      }

      // Crear el equipo y asociarlo a la categoría
      const equipo = await Equipo.create(nombre, capitan_id, torneo_id, categoria_id);
      console.log('Equipo creado:', equipo); // Agregar para depuración

      res.status(201).json({ message: 'Equipo creado y registrado correctamente', equipo });
    } catch (err) {
      console.error('Error al crear el equipo:', err);
      res.status(500).json({ message: 'Error al crear el equipo', error: err.message });
    }
  },

  


  // Obtener todos los equipos
  getAllEquipos: async (req, res) => {
    try {
      const equipos = await Equipo.getAll();
      res.status(200).json(equipos);
    } catch (err) {
      console.error('Error al obtener los equipos:', err);
      res.status(500).json({ message: 'Error al obtener los equipos', error: err.message });
    }
  },


  // Obtener un equipo por ID
  getEquipoById: async (req, res) => {
    const { id } = req.params;
    try {
      const equipo = await Equipo.getById(id);
      if (!equipo) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
      res.status(200).json(equipo);
    } catch (err) {
      console.error('Error al obtener el equipo:', err);
      res.status(500).json({ message: 'Error al obtener el equipo', error: err.message });
    }
  },


  // Actualizar un equipo
  updateEquipo: async (req, res) => {
    const { id } = req.params;
    const { nombre, capitan_id, torneo_id } = req.body;


    try {
      const equipoExistente = await Equipo.getByCapitanAndTorneo(capitan_id, torneo_id);


      if (equipoExistente && equipoExistente.id !== parseInt(id)) {
        return res.status(400).json({ message: 'El capitán ya está asignado a un equipo en este torneo.' });
      }


      const equipoActualizado = await Equipo.update(id, nombre, capitan_id, torneo_id);
      res.status(200).json(equipoActualizado);
    } catch (err) {
      console.error('Error al actualizar el equipo:', err);
      res.status(500).json({ message: 'Error al actualizar el equipo', error: err.message });
    }
  },


  // Eliminar un equipo
  deleteEquipo: async (req, res) => {
    const { id } = req.params;


    try {
      const equipoEliminado = await Equipo.delete(id);
      res.status(200).json({ message: 'Equipo eliminado', equipo: equipoEliminado });
    } catch (err) {
      console.error('Error al eliminar el equipo:', err);
      res.status(500).json({ message: 'Error al eliminar el equipo', error: err.message });
    }
  },

   // Obtener detalles del equipo con el torneo y capitán
   getEquiposDetails: async (req, res) => {
  try {
    const equiposDetalles = await Equipo.getAllDetails();  // Aquí debes usar getAllDetails
    res.status(200).json(equiposDetalles);
  } catch (err) {
    console.error('Error al obtener los detalles de los equipos:', err);
    res.status(500).json({ message: 'Error al obtener los detalles de los equipos', error: err.message });
  }
  },

   // Inscribir un equipo en una categoría
   inscribirEquipo: async (req, res) => {
    const { nombre, capitan_id, torneo_id, categoria_id } = req.body;
    try {
      const equipoId = await Equipo.create(nombre, capitan_id, torneo_id, categoria_id);
      res.status(201).json({ message: 'Equipo inscrito correctamente', equipoId });
    } catch (error) {
      res.status(500).json({ message: 'Error al inscribir equipo', error });
    }
  },

  // Obtener equipos por categoría
  obtenerEquiposPorCategoria: async (req, res) => {
    const { categoriaId } = req.params;
    try {
      const equipos = await Equipo.obtenerEquiposPorCategoria(categoriaId);
      res.status(200).json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener equipos de la categoría', error });
    }
  }
};



module.exports = equipoController;
