const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { puntoSchema } = require('../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = `SELECT id, nombre, direccion, tipo_residuo, estado, ST_X(geom::geometry) as longitud, ST_Y(geom::geometry) as latitud FROM puntos_reciclaje`;
    const result = await db.query(q);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const q = `SELECT id, nombre, direccion, tipo_residuo, estado, ST_X(geom::geometry) as longitud, ST_Y(geom::geometry) as latitud FROM puntos_reciclaje WHERE id=$1`;
    const result = await db.query(q, [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { error, value } = puntoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });
  const { nombre, direccion, latitud, longitud, tipo_residuo, estado } = value;
  try {
    const q = `INSERT INTO puntos_reciclaje(nombre,direccion,geom,tipo_residuo,estado) VALUES($1,$2,ST_SetSRID(ST_MakePoint($4,$3),4326),$5,$6) RETURNING id`;
    const result = await db.query(q, [nombre, direccion, latitud, longitud, tipo_residuo, estado]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, latitud, longitud, tipo_residuo, estado } = req.body;
  try {
    const q = `UPDATE puntos_reciclaje SET nombre=$1, direccion=$2, geom=ST_SetSRID(ST_MakePoint($4,$3),4326), tipo_residuo=$5, estado=$6 WHERE id=$7`;
    await db.query(q, [nombre, direccion, latitud, longitud, tipo_residuo, estado, id]);
    res.json({ message: 'Actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM puntos_reciclaje WHERE id=$1', [id]);
    res.json({ message: 'Eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
