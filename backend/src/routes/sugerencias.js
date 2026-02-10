const express = require('express')
const db = require('../db')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

router.post('/', authenticateToken, async (req, res) => {
  const { material, descripcion } = req.body
  try {
    const q = 'INSERT INTO sugerencias(material, descripcion) VALUES($1,$2) RETURNING id'
    const result = await db.query(q, [material, descripcion])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sugerencias ORDER BY id DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
