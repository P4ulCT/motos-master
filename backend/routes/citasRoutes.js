const express = require('express');
const router = express.Router();
const { obtenerCitas, crearCita, actualizarEstadoCita, eliminarCita } = require('../controllers/citasController');

router.get('/', obtenerCitas);
router.post('/', crearCita);
router.put('/:id/estado', actualizarEstadoCita);
router.delete('/:id', eliminarCita);

module.exports = router;