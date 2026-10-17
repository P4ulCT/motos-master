const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Ruta POST para /api/login
router.post('/login', login);

module.exports = router;