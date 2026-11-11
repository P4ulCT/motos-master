const db = require('../config/db');

// Obtener todas las motos (con el nombre del cliente dueño)
const obtenerMotos = async (req, res) => {
  try {
    const query = `
      SELECT m.*, c.nombre AS cliente_nombre 
      FROM motos m 
      JOIN clientes c ON m.cliente_id = c.id 
      ORDER BY m.id DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las motos' });
  }
};

// Crear una nueva moto
const crearMoto = async (req, res) => {
  const { cliente_id, marca, modelo, placa, anio, numero_motor } = req.body;
  
  if (!cliente_id || !marca || !modelo) {
    return res.status(400).json({ error: 'Cliente, marca y modelo son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO motos (cliente_id, marca, modelo, placa, anio, numero_motor) VALUES (?, ?, ?, ?, ?, ?)',
      [cliente_id, marca, modelo, placa, anio, numero_motor]
    );
    res.status(201).json({ mensaje: 'Moto registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la moto' });
  }
};

// Actualizar moto
const actualizarMoto = async (req, res) => {
  const { id } = req.params;
  const { cliente_id, marca, modelo, placa, anio, numero_motor } = req.body;

  try {
    await db.query(
      'UPDATE motos SET cliente_id=?, marca=?, modelo=?, placa=?, anio=?, numero_motor=? WHERE id=?',
      [cliente_id, marca, modelo, placa, anio, numero_motor, id]
    );
    res.json({ mensaje: 'Moto actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la moto' });
  }
};

// Eliminar moto
const eliminarMoto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM motos WHERE id = ?', [id]);
    res.json({ mensaje: 'Moto eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la moto' });
  }
};

module.exports = { obtenerMotos, crearMoto, actualizarMoto, eliminarMoto };