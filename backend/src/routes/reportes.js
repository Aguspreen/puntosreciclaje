const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { id_punto, descripcion } = req.body;
  try {
    const q = 'INSERT INTO reportes(id_punto, usuario, descripcion, fecha, estado) VALUES($1,$2,$3,NOW(),$4) RETURNING id';
    const result = await db.query(q, [id_punto, req.user.id, descripcion, 'pendiente']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM reportes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update report status (pendiente/resuelto)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { estado } = req.body
  try {
    // allow only admin to change
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin only' })
    await db.query('UPDATE reportes SET estado=$1 WHERE id=$2', [estado, id])
    res.json({ message: 'Updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router;
