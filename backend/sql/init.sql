-- Initialize PostGIS and create tables
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  contraseña TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'ciudadano'
);

CREATE TABLE IF NOT EXISTS puntos_reciclaje (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT,
  geom geometry(POINT,4326),
  tipo_residuo TEXT,
  estado TEXT DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS reportes (
  id SERIAL PRIMARY KEY,
  id_punto INTEGER REFERENCES puntos_reciclaje(id),
  usuario INTEGER REFERENCES usuarios(id),
  descripcion TEXT,
  fecha TIMESTAMP,
  estado TEXT DEFAULT 'pendiente'
);

CREATE TABLE IF NOT EXISTS sugerencias (
  id SERIAL PRIMARY KEY,
  material TEXT,
  descripcion TEXT
);
