const express = require('express');
const router = express.Router();
const { obtenerMotos, crearMoto, actualizarMoto, eliminarMoto } = require('../controllers/motosController');

router.get('/', obtenerMotos);
router.post('/', crearMoto);
router.put('/:id', actualizarMoto);
router.delete('/:id', eliminarMoto);

module.exports = router;