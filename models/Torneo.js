// models/Torneo.js
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
  }
  
  module.exports = Torneo;
  