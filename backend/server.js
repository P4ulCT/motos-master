require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const clientesRoutes = require('./routes/clientesRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Usar las rutas
app.use('/api', authRoutes);
app.use('/api/clientes', clientesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor Motos Master funcionando 🏍️' });
});

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});