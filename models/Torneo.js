// models/Torneo.js
const db = require('../config/db');

class Torneo {
    constructor(id, nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas) {
      this.id = id;
      this.nombre = nombre;
      this.tipo = tipo;
      this.fecha_inicio = fecha_inicio;
      this.fecha_fin = fecha_fin;
      this.lugar = lugar;
      this.max_equipos = max_equipos;
      this.min_equipos = min_equipos;
      this.estado = estado;
      this.reglas = reglas;
    }
    // Método para obtener un torneo por su nombre
  static async getByName(nombre) {
    try {
      const [rows] = await db.query('SELECT * FROM torneos WHERE nombre = ?', [nombre]);
      return rows[0];  // Retorna el primer torneo encontrado
    } catch (err) {
      console.error('Error al obtener el torneo por nombre:', err);
      throw new Error('Error al obtener el torneo');
    }
  }

  }
  
  
  
  module.exports = Torneo;
  