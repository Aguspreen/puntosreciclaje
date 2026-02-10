# SIG Reciclaje - Proyecto Completo

Sistema de Información Geográfica para gestión de puntos de reciclaje con diferenciación de roles (admin/ciudadano).

## Estructura

- `backend/` - API REST con Node.js + Express + PostGIS
- `frontend/` - App React (Vite) con Material UI y Leaflet (mapa interactivo)
- `docker-compose.yml` - Servicios: PostgreSQL+PostGIS, backend, frontend

## Inicio Rápido (requiere Docker)

```powershell
# 1. Clona repo y entra en la carpeta
cd Proyecto2

# 2. Copia variables de entorno y configúralas (ADMIN_EMAIL, JWT_SECRET)
cp backend/.env.example backend/.env

# 3. Levanta los servicios
docker compose up --build
```

- Frontend en: http://localhost:3000
- Backend en: http://localhost:4000
- PostgreSQL en: localhost:5432

**Admin prioritario:** El correo configurado en `ADMIN_EMAIL` (por defecto: 22067@virtual.utsc.edu.mx) recibe rol admin al registrarse.

## Funcionalidades Implementadas

### Autenticación
- `POST /usuarios/register` - Registro (admin si email coincide)
- `POST /usuarios/login` - Login con JWT
- `GET /usuarios` - Listar usuarios (admin)
- `PATCH /usuarios/:id/role` - Cambiar rol (admin)

### Puntos de Reciclaje
- `GET /puntos` - Listar (con filtros por tipo)
- `GET /puntos/:id` - Detalle
- `POST /puntos` - Crear (admin)
- `PUT /puntos/:id` - Actualizar (admin)
- `DELETE /puntos/:id` - Eliminar (admin)

### Reportes Comunitarios
- `POST /reportes` - Crear (autenticado)
- `GET /reportes` - Listar (autenticado)
- `PUT /reportes/:id` - Cambiar estado (admin)

### Sugerencias
- `POST /sugerencias` - Crear (autenticado)
- `GET /sugerencias` - Listar (público)

## Páginas Frontend

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Mapa interactivo con filtros | Público |
| `/login` | Iniciar sesión | Público |
| `/register` | Registro de usuario | Público |
| `/sugerencias` | Ver y proponer ideas | Autenticado |
| `/reportes` | Reportar y ver problemas | Autenticado |
| `/add-punto` | Crear punto | Admin |
| `/admin` | Gestión de usuarios | Admin |

## Diferencias de Roles

### Ciudadano
- Ver mapa y puntos
- Crear sugerencias y reportes
- Perfil limitado

### Admin
- Todo lo anterior, más:
- Crear/editar/eliminar puntos
- Cambiar estado de reportes
- Gestionar usuarios y sus roles
- Acceso a panel administrativo

## Configuración de Entorno

**`backend/.env`**
```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/reciclaje_garcia
JWT_SECRET=tu_secreto_muy_seguro
ADMIN_EMAIL=22067@virtual.utsc.edu.mx
```

## Base de Datos

PostGIS integrado con tablas:
- `usuarios` - Autenticación con roles
- `puntos_reciclaje` - Geo-ubicados (geometry POINT SRID 4326)
- `reportes` - Incidentes
- `sugerencias` - Ideas de reutilización

Tipos de residuo soportados:
- PET / Plástico
- Cartón
- Vidrio
- Metal
- Electrónico
- Llantas

## Despliegue

Usa `docker-compose.yml` para desarrollo local o personaliza para producción.

## Siguientes Pasos (Opcionales)

- Pruebas unitarias e integración (Jest, Supertest)
- CI/CD con GitHub Actions
- Validaciones avanzadas en frontend/backend
- Importar datos reales de puntos de reciclaje
- Notificaciones/email para reportes
- Autenticación OAuth (Google, Facebook)

---

**Repositorio:** https://github.com/Aguspreen/puntosreciclaje

