# SIG Reciclaje - Proyecto

Plantilla inicial de un proyecto SIG (Sistema de Información Geográfica) para gestión de puntos de reciclaje.

Estructura básica:

- `backend/` - API con Node.js + Express
- `frontend/` - App React (Vite) con Material UI y Leaflet
- `docker-compose.yml` - Contiene servicios: `db` (PostGIS), `backend`, `frontend`

Rápido inicio (requiere Docker):

1. Clona el repo y sitúate en la carpeta del proyecto.
2. Copia variables de entorno: `backend/.env.example` -> `backend/.env` y ajusta `JWT_SECRET`.
3. Levanta todo con:

```powershell
docker compose up --build
```

La base de datos `reciclaje_garcia` se inicializa con `backend/sql/init.sql` (PostGIS incl.).

Admin prioritario: el correo configurado en `ADMIN_EMAIL` dentro de `.env` será asignado con rol `admin` al registrarse. Por defecto: 22067@virtual.utsc.edu.mx

Endpoints principales implementados:
- `POST /usuarios/register` - registro
- `POST /usuarios/login` - login
- `GET /puntos` - lista puntos
- `POST /puntos` - crear punto (admin)
- `PUT /puntos/:id` - actualizar (admin)
- `DELETE /puntos/:id` - eliminar (admin)
- `POST /reportes` - crear reporte (autenticado)
- `GET /reportes` - listar reportes (autenticado)

Siguientes pasos recomendados:
- Completar interfaz de administración para usuarios (solo admin).
- Añadir validaciones frontend, manejo de tokens en axios, y proteger rutas con React Router.
- Añadir tests y CI en `.github/workflows`.
