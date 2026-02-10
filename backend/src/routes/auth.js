const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { registerSchema } = require('../utils/validation');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });
  const { nombre, correo, contraseña } = value;
  try {
    const hashed = await bcrypt.hash(contraseña, 10);
    const role = (correo === process.env.ADMIN_EMAIL) ? 'admin' : 'ciudadano';
    const result = await db.query(
      'INSERT INTO usuarios(nombre, correo, contraseña, rol) VALUES($1,$2,$3,$4) RETURNING id, nombre, correo, rol',
      [nombre, correo, hashed, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Correo ya registrado' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  if (!correo || !contraseña) return res.status(400).json({ message: 'Credenciales requeridas' });
  try {
    const user = await db.query('SELECT * FROM usuarios WHERE correo=$1', [correo]);
    if (!user.rows.length) return res.status(400).json({ message: 'Usuario no encontrado' });
    const u = user.rows[0];
    const ok = await bcrypt.compare(contraseña, u.contraseña);
    if (!ok) return res.status(401).json({ message: 'Contraseña incorrecta' });
    const token = jwt.sign({ id: u.id, correo: u.correo, role: u.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: u.id, nombre: u.nombre, correo: u.correo, role: u.rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: listar usuarios
const { authenticateToken, requireAdmin } = require('../middleware/auth');
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, nombre, correo, rol FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: change user role
router.patch('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params
  const { rol } = req.body
  if (!['admin','ciudadano'].includes(rol)) return res.status(400).json({ message: 'Rol inválido' })
  try {
    await db.query('UPDATE usuarios SET rol=$1 WHERE id=$2', [rol, id])
    res.json({ message: 'Rol actualizado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router;
