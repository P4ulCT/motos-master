const db = require('../config/db');

// Función para iniciar sesión
const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Por favor, ingrese usuario y contraseña' });
  }

  try {
    // Buscar el usuario en la base de datos
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = rows[0];

    // NOTA: Por ahora comparamos texto plano. Luego lo cambiaremos a bcrypt.
    if (password !== user.password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Si todo está bien, devolvemos los datos (sin la contraseña)
    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login };