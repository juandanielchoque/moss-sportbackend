
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const torneoRoutes = require('./routes/torneoRoutes');  // Asegúrate de que esta importación sea correcta
const equipoRoutes = require('./routes/equipoRoutes');
const partidoRoutes = require('./routes/partidoRoutes');
const jugadorRoutes = require('./routes/jugadorRoutes');
const authRoutes = require('./routes/authRoutes');

const authMiddleware = require('./utils/authMiddleware');
const roleMiddleware = require('./utils/roleMiddleware');
const torneoController = require('./controllers/torneoController');


app.use(cors());
app.use(express.json());

// Usar las rutas de torneos en '/api/torneos'
app.use('/api/torneos', torneoRoutes);  // Asegúrate de que la ruta esté montada correctamente
app.use('/api', equipoRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/auth', authRoutes);

app.listen(5000, () => {
    console.log('Servidor iniciado en http://localhost:5000');
});
