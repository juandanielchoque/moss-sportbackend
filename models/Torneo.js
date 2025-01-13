// models/Torneo.js
const db = require('../config/db');

class Torneo {
    constructor(id, nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, categorias) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.lugar = lugar;
        this.estado = estado;
        this.reglas = reglas;
        this.categorias = categorias;
    }

    // Método para obtener un torneo por su nombre
    static async getByName(nombre) {
        try {
            const [rows] = await db.query('SELECT * FROM torneos WHERE nombre = ?', [nombre]);
            return rows[0];
        } catch (err) {
            console.error('Error al obtener el torneo por nombre:', err);
            throw new Error('Error al obtener el torneo');
        }
    }

    // Método para obtener las categorías asociadas a un torneo
    static async getCategorias(torneo_id) {
        try {
            const [rows] = await db.query(
                `SELECT c.id, c.nombre 
                 FROM categorias c
                 JOIN torneo_categorias tc ON c.id = tc.categoria_id
                 WHERE tc.torneo_id = ?`,
                [torneo_id]
            );
            return rows;
        } catch (err) {
            console.error('Error al obtener categorías del torneo:', err);
            throw new Error('Error al obtener las categorías del torneo');
        }
    }

    // Método para obtener un torneo por su ID
    static async getById(id) {
        try {
          const [rows] = await db.query('SELECT * FROM torneos WHERE id = ?', [id]);
          return rows.length > 0 ? rows[0] : null; // Devuelve el torneo o null si no se encuentra.
        } catch (error) {
          console.error('Error en Torneo.getById:', error);
          throw error;
        }
      }
}

module.exports = Torneo;
