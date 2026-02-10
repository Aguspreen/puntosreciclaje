const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const puntosRoutes = require('./routes/puntos');
const reportesRoutes = require('./routes/reportes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/usuarios', authRoutes);
app.use('/puntos', puntosRoutes);
app.use('/reportes', reportesRoutes);
app.use('/sugerencias', require('./routes/sugerencias'));

app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

const PORT = process.env.PORT || 4000;
if (require.main === module) {
	app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

module.exports = app;
