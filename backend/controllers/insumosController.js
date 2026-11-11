const db = require('../config/db');

// Obtener todos los insumos
const obtenerInsumos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM insumos ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los insumos' });
  }
};

// Crear un nuevo insumo
const crearInsumo = async (req, res) => {
  const { nombre, descripcion, cantidad, stock_minimo, precio } = req.body;
  
  if (!nombre || cantidad === undefined) {
    return res.status(400).json({ error: 'El nombre y la cantidad son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO insumos (nombre, descripcion, cantidad, stock_minimo, precio) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, cantidad, stock_minimo || 5, precio]
    );
    res.status(201).json({ mensaje: 'Insumo registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el insumo' });
  }
};

// Actualizar un insumo (por ejemplo, si llega más stock)
const actualizarInsumo = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, cantidad, stock_minimo, precio } = req.body;

  try {
    await db.query(
      'UPDATE insumos SET nombre=?, descripcion=?, cantidad=?, stock_minimo=?, precio=? WHERE id=?',
      [nombre, descripcion, cantidad, stock_minimo, precio, id]
    );
    res.json({ mensaje: 'Insumo actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el insumo' });
  }
};

// Eliminar un insumo
const eliminarInsumo = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM insumos WHERE id = ?', [id]);
    res.json({ mensaje: 'Insumo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el insumo' });
  }
};

module.exports = { obtenerInsumos, crearInsumo, actualizarInsumo, eliminarInsumo };