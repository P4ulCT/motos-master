const db = require('../config/db');

// Obtener todas las citas
const obtenerCitas = async (req, res) => {
  try {
    const query = `
      SELECT ci.*, c.nombre AS cliente_nombre, m.marca, m.modelo, m.placa 
      FROM citas ci
      JOIN clientes c ON ci.cliente_id = c.id
      JOIN motos m ON ci.moto_id = m.id
      ORDER BY ci.fecha DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
};

// Crear una cita
const crearCita = async (req, res) => {
  const { cliente_id, moto_id, fecha, motivo } = req.body;
  
  if (!cliente_id || !moto_id || !fecha) {
    return res.status(400).json({ error: 'Cliente, moto y fecha son obligatorios' });
  }

  try {
    // CONVERTIR LA FECHA AL FORMATO DE MYSQL (YYYY-MM-DD HH:MM:SS)
    const fechaMysql = new Date(fecha).toISOString().slice(0, 19).replace('T', ' ');

    await db.query(
      'INSERT INTO citas (cliente_id, moto_id, fecha, motivo) VALUES (?, ?, ?, ?)',
      [cliente_id, moto_id, fechaMysql, motivo] // <-- Aquí usamos la fecha limpia
    );
    res.status(201).json({ mensaje: 'Cita agendada exitosamente' });
  } catch (error) {
    console.error(error); // Esto mostrará el error real en la terminal por si acaso
    res.status(500).json({ error: 'Error al agendar la cita' });
  }
};

// Actualizar estado de la cita
const actualizarEstadoCita = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // 'pendiente', 'completada', 'cancelada'

  try {
    await db.query('UPDATE citas SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ mensaje: 'Estado de la cita actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
};

// Eliminar cita
const eliminarCita = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM citas WHERE id = ?', [id]);
    res.json({ mensaje: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cita' });
  }
};

module.exports = { obtenerCitas, crearCita, actualizarEstadoCita, eliminarCita };