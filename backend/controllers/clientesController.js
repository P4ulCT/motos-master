const db = require('../config/db');

// 1. Obtener todos los clientes (READ)
const obtenerClientes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

// 2. Crear un nuevo cliente (CREATE)
const crearCliente = async (req, res) => {
  const { nombre, cedula, telefono, email, direccion } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO clientes (nombre, cedula, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)',
      [nombre, cedula, telefono, email, direccion]
    );
    res.status(201).json({ mensaje: 'Cliente creado exitosamente', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

// 3. Actualizar un cliente (UPDATE)
const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, cedula, telefono, email, direccion } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE clientes SET nombre = ?, cedula = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
      [nombre, cedula, telefono, email, direccion, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

// 4. Eliminar un cliente (DELETE)
const eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};