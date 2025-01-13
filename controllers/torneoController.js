const db = require('../config/db');  // Conexión a la base de datos
const moment = require('moment');
const Categoria = require('../models/Categoria'); 

// Obtener todos los torneos con sus categorías
exports.obtenerTorneos = async (req, res) => {
  try {
    // Consulta para obtener torneos con sus categorías
    const [results] = await db.query(`
      SELECT 
          t.id AS id,
          t.nombre AS nombre,
          t.tipo,
          t.fecha_inicio,
          t.fecha_fin,
          t.lugar,
          t.estado,
          t.reglas,
          GROUP_CONCAT(c.nombre ORDER BY c.nombre) AS categorias
      FROM 
          torneos t
      LEFT JOIN 
          torneo_categorias tc ON t.id = tc.torneo_id
      LEFT JOIN 
          categorias c ON tc.categoria_id = c.id
      GROUP BY 
          t.id
  `);
  

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener torneos con categorías', error: error.message });
  }
};

// Obtener un torneo por ID
exports.obtenerTorneoPorId = async (req, res) => {
  const torneoId = req.params.id;
  try {
    const [results] = await db.query(`
      SELECT 
          t.id AS id,
          t.nombre AS nombre,
          t.tipo,
          t.fecha_inicio,
          t.fecha_fin,
          t.lugar,
          t.estado,
          t.reglas,
          GROUP_CONCAT(c.nombre ORDER BY c.nombre) AS categorias
      FROM 
          torneos t
      LEFT JOIN 
          torneo_categorias tc ON t.id = tc.torneo_id
      LEFT JOIN 
          categorias c ON tc.categoria_id = c.id
      WHERE 
          t.id = ?
      GROUP BY 
          t.id
  `, [torneoId]);
  

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Torneo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el torneo', error: error.message });
  }
};

// Crear un nuevo torneo sin categorías
exports.crearTorneo = async (req, res) => {
  const { nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas } = req.body;

  try {
    // Crear el torneo sin las categorías
    const [result] = await db.query('INSERT INTO torneos (nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas]);

    // Obtener el ID del torneo recién creado
    const torneoId = result.insertId;

    res.status(201).json({ 
      id: torneoId, 
      nombre, 
      tipo, 
      fecha_inicio, 
      fecha_fin, 
      lugar,  
      estado, 
      reglas 
    });
  } catch (error) {
    console.error('Error al crear el torneo:', error);
    res.status(500).json({ message: 'Error al crear el torneo', error: error.message });
  }
};

//
// Agregar categorías a un torneo existente
exports.agregarCategorias = async (req, res) => {
  const { torneoId, categorias } = req.body;

  try {
    if (!torneoId || !categorias || categorias.length === 0) {
      return res.status(400).json({ message: 'Se requiere el ID del torneo y al menos una categoría' });
    }

    // Verificar si el torneo existe
    const [torneo] = await db.query('SELECT id FROM torneos WHERE id = ?', [torneoId]);
    
    if (torneo.length === 0) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    // Iterar sobre las categorías y agregarlas al torneo
    const insertPromises = categorias.map(async (categoria) => {
      // Verificar si la categoría ya existe en la base de datos
      const [categoriaResult] = await db.query('SELECT id FROM categorias WHERE nombre = ?', [categoria]);

      if (categoriaResult.length === 0) {
        // Si la categoría no existe, crearla
        const [newCategoria] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [categoria]);
        // Asociar la nueva categoría al torneo
        return db.query('INSERT INTO torneo_categorias (torneo_id, categoria_id) VALUES (?, ?)', [torneoId, newCategoria.insertId]);
      } else {
        // Si la categoría ya existe, verificar si ya está asociada al torneo
        const [existingAssociation] = await db.query(
          'SELECT * FROM torneo_categorias WHERE torneo_id = ? AND categoria_id = ?',
          [torneoId, categoriaResult[0].id]
        );

        if (existingAssociation.length === 0) {
          // Si la categoría no está asociada al torneo, asociarla
          return db.query('INSERT INTO torneo_categorias (torneo_id, categoria_id) VALUES (?, ?)', [torneoId, categoriaResult[0].id]);
        } else {
          console.log(`La categoría ${categoria} ya está asociada al torneo ${torneoId}`);
          return null; // No hacer nada si ya está asociada
        }
      }
    });

    // Ejecutar todas las inserciones en paralelo
    await Promise.all(insertPromises);

    res.status(200).json({ message: 'Categorías agregadas al torneo correctamente' });
  } catch (error) {
    console.error('Error al agregar las categorías al torneo:', error);
    res.status(500).json({ message: 'Error al agregar categorías al torneo', error: error.message });
  }
};




// Eliminar un torneo por ID
exports.eliminarTorneo = async (req, res) => {
  const torneoId = req.params.id;
  try {
    const [result] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);
    if (result.length > 0) {
      await db.query('DELETE FROM torneo_categorias WHERE torneo_id = ?', [torneoId]);  // Eliminar asociaciones de categorías
      await db.query('DELETE FROM torneos WHERE id = ?', [torneoId]);
      res.status(200).json({ message: 'Torneo eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Torneo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el torneo', error: error.message });
  }
};

// Actualizar un torneo por ID y sus categorías
exports.actualizarTorneo = async (req, res) => {
  const torneoId = req.params.id;
  const { nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, categorias } = req.body;
  
  try {
    // Convertir las fechas a formato adecuado si es necesario
    const fechaInicio = fecha_inicio;  // Ya viene en formato YYYY-MM-DD desde el frontend
    const fechaFin = fecha_fin;        // Ya viene en formato YYYY-MM-DD desde el frontend
    
    // Verificar si el torneo existe
    const [result] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);
    if (result.length > 0) {
      // Actualizar el torneo sin los campos de max_equipos y min_equipos
      await db.query('UPDATE torneos SET nombre = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, lugar = ?, estado = ?, reglas = ? WHERE id = ?', 
        [nombre, tipo, fechaInicio, fechaFin, lugar, estado, reglas, torneoId]
      );

      // Eliminar las categorías existentes asociadas
      await db.query('DELETE FROM torneo_categorias WHERE torneo_id = ?', [torneoId]);

      // Convertir categorías en array si viene como texto
      const categoriasArray = Array.isArray(categorias) ? categorias : categorias.split(',').map(categoria => categoria.trim());

      // Reinsertar las nuevas categorías
      if (categoriasArray && categoriasArray.length > 0) {
        for (let categoria of categoriasArray) {
          // Verificar si la categoría ya existe en la base de datos
          const [categoriaResult] = await db.query('SELECT id FROM categorias WHERE nombre = ?', [categoria]);

          if (categoriaResult.length === 0) {
            // Si la categoría no existe, crearla
            const [newCategoria] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [categoria]);
            await db.query('INSERT INTO torneo_categorias (torneo_id, categoria_id) VALUES (?, ?)', [torneoId, newCategoria.insertId]);
          } else {
            // Verificar si la relación ya existe en la tabla torneo_categorias
            const [existingRelation] = await db.query('SELECT * FROM torneo_categorias WHERE torneo_id = ? AND categoria_id = ?', [torneoId, categoriaResult[0].id]);

            if (existingRelation.length === 0) {
              // Si la relación no existe, asociarla al torneo
              await db.query('INSERT INTO torneo_categorias (torneo_id, categoria_id) VALUES (?, ?)', [torneoId, categoriaResult[0].id]);
            }
          }
        }
      }

      res.status(200).json({ message: 'Torneo actualizado exitosamente' });
    } else {
      res.status(404).json({ message: 'Torneo no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el torneo:', error); // Para ver el detalle del error
    res.status(500).json({ message: 'Error al actualizar el torneo', error: error.message });
  }
};



//-------

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const [totalTorneos] = await db.query('SELECT COUNT(*) AS total_torneos FROM torneos');
    console.log('Total de torneos:', totalTorneos);  // Depuración

    const [torneosPorEstado] = await db.query(`
      SELECT estado, COUNT(*) AS cantidad
      FROM torneos
      GROUP BY estado
    `);
    console.log('Torneos por estado:', torneosPorEstado);  // Depuración

    const [torneosPorTipo] = await db.query(`
      SELECT tipo, COUNT(*) AS cantidad
      FROM torneos
      GROUP BY tipo
    `);
    console.log('Torneos por tipo:', torneosPorTipo);  // Depuración

    const [torneosFuturos] = await db.query(`
      SELECT COUNT(*) AS cantidad
      FROM torneos
      WHERE fecha_inicio > NOW()
    `);
    console.log('Torneos futuros:', torneosFuturos);  // Depuración

    res.status(200).json({
      totalTorneos: totalTorneos[0].total_torneos,
      torneosPorEstado: torneosPorEstado,
      torneosPorTipo: torneosPorTipo,
      torneosFuturos: torneosFuturos[0].cantidad,
    });
  } catch (error) {
    console.log('Error al obtener estadísticas:', error.message);  // Depuración
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};


//------------------
//------------------
exports.getTablaPosiciones = async (req, res) => {
  const { torneoId } = req.params;

  try {
    // Primero obtenemos el nombre del torneo
    const torneoQuery = 'SELECT nombre FROM torneos WHERE id = ?';
    const [torneoRows] = await db.query(torneoQuery, [torneoId]);

    if (torneoRows.length === 0) {
      return res.status(404).json({ error: 'Torneo no encontrado' });
    }

    const torneoNombre = torneoRows[0].nombre.toLowerCase();

    // Definir las reglas de puntuación según el nombre del torneo
    let query;

    if (torneoNombre === 'futbol') {
      // Consulta para Fútbol
      query = `
        SELECT 
            e.nombre AS equipo,
            COUNT(p.id) AS PJ,
            -- Si el equipo ha ganado, 3 puntos
            SUM(CASE WHEN (p.goles_local > p.goles_visitante AND p.equipo_local_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) OR 
                     (p.goles_visitante > p.goles_local AND p.equipo_visitante_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) THEN 3 ELSE 0 END) AS G,
            -- Si el equipo ha empatado, 1 punto
            SUM(CASE WHEN p.goles_local = p.goles_visitante AND (p.goles_local > 0 OR p.goles_visitante > 0) THEN 1 ELSE 0 END) AS E,
            -- Los perdedores no reciben puntos (0 puntos)
            SUM(CASE WHEN (p.goles_local < p.goles_visitante AND p.equipo_local_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) OR 
                     (p.goles_visitante < p.goles_local AND p.equipo_visitante_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) THEN 0 ELSE 0 END) AS P,
            -- Goles a favor
            SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_local ELSE p.goles_visitante END) AS GF,
            -- Goles en contra
            SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_visitante ELSE p.goles_local END) AS GC,
            -- Diferencia de goles (Goles a favor - Goles en contra)
            SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_local ELSE p.goles_visitante END) - 
            SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_visitante ELSE p.goles_local END) AS DG,
            -- Cálculo total de puntos
            SUM(
              CASE 
                WHEN (p.goles_local > p.goles_visitante AND p.equipo_local_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) OR 
                     (p.goles_visitante > p.goles_local AND p.equipo_visitante_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) THEN 3 -- Victoria
                WHEN p.goles_local = p.goles_visitante AND (p.goles_local > 0 OR p.goles_visitante > 0) THEN 1 -- Empate
                ELSE 0 -- Derrota sin goles
              END
            ) AS Pts
        FROM equipos e
        LEFT JOIN partidos p ON e.id = p.equipo_local_id OR e.id = p.equipo_visitante_id
        WHERE e.torneo_id = ?
        GROUP BY e.id, e.nombre
        ORDER BY Pts DESC, DG DESC, GF DESC;
      `;
    } else if (torneoNombre === 'basket') {
      // Consulta para Baloncesto
      query = `
        SELECT 
          e.nombre AS equipo,
          COUNT(p.id) AS PJ,
          -- Si el equipo ha ganado, 2 puntos
          SUM(CASE WHEN (p.goles_local > p.goles_visitante AND p.equipo_local_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) OR 
                   (p.goles_visitante > p.goles_local AND p.equipo_visitante_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) THEN 2 ELSE 0 END) AS G,
          -- Si el equipo ha empatado, 1 punto
          SUM(CASE WHEN p.goles_local = p.goles_visitante AND (p.goles_local > 0 OR p.goles_visitante > 0) THEN 1 ELSE 0 END) AS E,
          -- Los perdedores obtienen 1 punto
          SUM(CASE WHEN (p.goles_local < p.goles_visitante AND p.equipo_local_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) OR 
                   (p.goles_visitante < p.goles_local AND p.equipo_visitante_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) THEN 1 ELSE 0 END) AS P,
          
          -- Goles a favor y en contra
          SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_local ELSE p.goles_visitante END) AS GF,
          SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_visitante ELSE p.goles_local END) AS GC,
          -- Diferencia de goles (Goles a favor - Goles en contra)
          SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_local ELSE p.goles_visitante END) - 
          SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_visitante ELSE p.goles_local END) AS DG,
          -- Si el equipo tiene goles registrados, se considera que se presentó
          SUM(CASE WHEN (p.goles_local IS NOT NULL AND p.goles_local > 0) OR 
                   (p.goles_visitante IS NOT NULL AND p.goles_visitante > 0) THEN 1 ELSE 0 END) AS SePresento,
           -- Cálculo de puntos totales
           SUM(
           CASE 
      WHEN (p.goles_local > p.goles_visitante AND p.equipo_local_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) OR 
           (p.goles_visitante > p.goles_local AND p.equipo_visitante_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) THEN 2 
      WHEN p.goles_local = p.goles_visitante AND (p.goles_local > 0 OR p.goles_visitante > 0) THEN 1 
      WHEN (p.goles_local < p.goles_visitante AND p.equipo_local_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) OR 
           (p.goles_visitante < p.goles_local AND p.equipo_visitante_id = e.id AND (p.goles_local > 0 OR p.goles_visitante > 0)) THEN 1 
      ELSE 0 
    END
  ) AS Pts
        FROM equipos e
        LEFT JOIN partidos p ON e.id = p.equipo_local_id OR e.id = p.equipo_visitante_id
        WHERE e.torneo_id = ?
        GROUP BY e.id, e.nombre
        ORDER BY Pts DESC, DG DESC, GF DESC;
      `;
    } else {
      return res.status(400).json({ error: 'Tipo de torneo no soportado' });
    }

    // Ejecutamos la consulta final según el tipo de torneo
    const [rows] = await db.query(query, [torneoId]);
    res.status(200).json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la tabla de posiciones' });
  }

  // Función para obtener categorías, torneos, equipos y capitanes
const obtenerCategoriasTorneosEquipos = async (req, res) => {
  try {
      // Consulta SQL
      const query = `
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
              jugadores j ON e.capitan_id = j.id;
      `;

      // Ejecutamos la consulta SQL
      const [result] = await db.execute(query);

      // Devolver los resultados
      res.status(200).json(result);
  } catch (error) {
      console.error("Error al obtener categorías, torneos, equipos y capitanes:", error);
      res.status(500).json({ message: 'Hubo un error en el servidor' });
  }
};
};









