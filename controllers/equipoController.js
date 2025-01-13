const Equipo = require('../models/Equipo');
const Usuario = require('../models/Usuario');
const Torneo = require('../models/Torneo');
const Categoria = require('../models/Categoria');

const equipoController = {
  createEquipo: async (req, res) => {
    const { nombre, email_capitan, torneos } = req.body;
  
    try {
      // Buscar el ID del capitán usando el email
      const capitan = await Usuario.findByEmail(email_capitan);
      if (!capitan) {
        return res.status(404).json({ message: 'Capitán no encontrado' });
      }
  
      // Crear el equipo
      const equipo = await Equipo.create(nombre, capitan.id);
  
      // Asociar el equipo a los torneos
      for (const { torneo_id, categoria_id } of torneos) {
        // Verificar si el torneo existe
        const torneo = await Torneo.getById(torneo_id);
        if (!torneo) {
          return res.status(404).json({ message: `Torneo con ID ${torneo_id} no encontrado` });
        }
  
        // Verificar si la categoría es válida para el torneo
        const categorias = await Categoria.getCategoriasByTorneo(torneo_id);
        if (!categorias.some((categoria) => categoria.id === categoria_id)) {
          return res.status(400).json({
            message: `Categoría con ID ${categoria_id} no encontrada para el torneo con ID ${torneo_id}`,
          });
        }
  
        // Verificar si el equipo ya está asociado al torneo y categoría
        const equipoExistente = await Equipo.getByTorneoAndCategoria(equipo.id, torneo_id, categoria_id);
        if (equipoExistente) {
          return res.status(400).json({
            message: `El equipo ya está asociado al torneo con ID ${torneo_id} y la categoría con ID ${categoria_id}`,
          });
        }
  
        // Insertar solo en la categoría seleccionada
        await Equipo.addToTorneo(equipo.id, torneo_id, categoria_id);
      }
  
      res.status(201).json({ message: 'Equipo creado y asociado correctamente', equipo });
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


  // Editar un equipo
  editEquipo: async (req, res) => {
    const { equipo_id, nombre, email_capitan, torneos } = req.body;

    console.log('Datos recibidos:', req.body);  // Verificar el correo del capitán

    try {
      const equipo = await Equipo.getById(equipo_id);
      if (!equipo) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }

      const capitan = await Usuario.findByEmail(email_capitan);
      if (!capitan) {
        return res.status(404).json({ message: 'Capitán no encontrado' });
      }

      await Equipo.updateNombreAndCapitan(equipo_id, nombre, email_capitan);

      await Equipo.removeAllFromTorneo(equipo_id);

      for (const { torneo_id, categoria_id } of torneos) {
        const torneo = await Torneo.getById(torneo_id);
        if (!torneo) {
          return res.status(404).json({ message: `Torneo con ID ${torneo_id} no encontrado` });
        }

        const categorias = await Categoria.getCategoriasByTorneo(torneo_id);
        if (!categorias.some(c => c.id === categoria_id)) {
          return res.status(400).json({ message: `Categoría con ID ${categoria_id} no encontrada para el torneo ${torneo_id}` });
        }

        await Equipo.addToTorneo(equipo_id, torneo_id, categoria_id);
      }

      res.status(200).json({ message: 'Equipo actualizado correctamente' });
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

  // Obtener equipos asociados a un torneo y categoría específicos
  obtenerEquipos: async (req, res) => {
    const { torneo_id, categoria_id } = req.params;

    try {
      // Obtener los equipos asociados a ese torneo y categoría
      const equipos = await Equipo.getEquiposByTorneoYCategoria(torneo_id, categoria_id);

      // Si no se encuentran equipos, devolver un mensaje apropiado
      if (equipos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron equipos en esta categoría para el torneo especificado.' });
      }

      // Devolver la lista de equipos
      res.status(200).json(equipos);
    } catch (err) {
      console.error('Error al obtener los equipos:', err);
      res.status(500).json({ message: 'Error al obtener los equipos', error: err.message });
    }
  }
};


module.exports = equipoController;
