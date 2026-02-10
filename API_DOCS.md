# API Documentation - SIG Reciclaje

## Base URL
- **Development:** `http://localhost:4000`
- **Production:** Configure según tu deployment

## Authentication
Todos los endpoints protegidos requieren:
```
Authorization: Bearer <JWT_TOKEN>
```

El JWT se obtiene de `/usuarios/login` y contiene: `id`, `correo`, `role`.

---

## Endpoints

### 🔐 Usuarios (Autenticación)

#### POST `/usuarios/register`
Registrar nuevo usuario.
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contraseña": "password123"
}
```
**Respuesta (201):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "rol": "ciudadano"
}
```
**Nota:** Si `correo === ADMIN_EMAIL` en `.env`, se asigna rol `admin`.

---

#### POST `/usuarios/login`
Iniciar sesión.
```json
{
  "correo": "juan@example.com",
  "contraseña": "password123"
}
```
**Respuesta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "role": "ciudadano"
  }
}
```

---

#### GET `/usuarios`
**Requiere:** Auth + Admin
Listar todos los usuarios.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombre": "Admin User",
    "correo": "22067@virtual.utsc.edu.mx",
    "rol": "admin"
  },
  {
    "id": 2,
    "nombre": "Citizen User",
    "correo": "citizen@example.com",
    "rol": "ciudadano"
  }
]
```

---

#### PATCH `/usuarios/:id/role`
**Requiere:** Auth + Admin
Cambiar rol de un usuario.

**Body:**
```json
{
  "rol": "admin"
}
```
**Valores válidos:** `"admin"`, `"ciudadano"`

---

### 🗺️ Puntos de Reciclaje

#### GET `/puntos`
Listar todos los puntos. **Público.**

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombre": "Centro de Reciclaje Norte",
    "direccion": "Av. Principal 123",
    "latitud": 20.5,
    "longitud": -99.2,
    "tipo_residuo": "PET",
    "estado": "activo"
  }
]
```

---

#### GET `/puntos/:id`
**Público.** Obtener un punto específico.

---

#### POST `/puntos`
**Requiere:** Auth + Admin
Crear nuevo punto.

**Body:**
```json
{
  "nombre": "Nuevo Punto",
  "direccion": "Calle 456",
  "latitud": 20.6,
  "longitud": -99.3,
  "tipo_residuo": "Cartón",
  "estado": "activo"
}
```
**Tipos válidos:** `"PET"`, `"Cartón"`, `"Vidrio"`, `"Metal"`, `"Electrónico"`, `"Llantas"`

---

#### PUT `/puntos/:id`
**Requiere:** Auth + Admin
Actualizar punto existente.

**Body:** (mismo formato que POST)

---

#### DELETE `/puntos/:id`
**Requiere:** Auth + Admin
Eliminar punto.

---

### 📝 Reportes

#### POST `/reportes`
**Requiere:** Auth
Crear reporte de problema.

**Body:**
```json
{
  "id_punto": 1,
  "descripcion": "El contenedor está dañado"
}
```

---

#### GET `/reportes`
**Requiere:** Auth
Listar reportes.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "id_punto": 1,
    "usuario": 2,
    "descripcion": "El contenedor está dañado",
    "fecha": "2024-02-10T12:30:00Z",
    "estado": "pendiente"
  }
]
```

---

#### PUT `/reportes/:id`
**Requiere:** Auth + Admin
Actualizar estado de reporte.

**Body:**
```json
{
  "estado": "resuelto"
}
```
**Valores válidos:** `"pendiente"`, `"resuelto"`

---

### 💡 Sugerencias

#### POST `/sugerencias`
**Requiere:** Auth
Crear sugerencia de reutilización.

**Body:**
```json
{
  "material": "Botellas PET",
  "descripcion": "Pueden convertirse en mochilas resistentes"
}
```

---

#### GET `/sugerencias`
**Público.** Listar todas las sugerencias.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "material": "Botellas PET",
    "descripcion": "Pueden convertirse en mochilas resistentes"
  }
]
```

---

## Códigos de Estado Comunes

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (sin token) |
| 403 | Forbidden (sin permisos) |
| 404 | Not Found |
| 500 | Server Error |

---

## Testing con cURL

```bash
# Registro
curl -X POST http://localhost:4000/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","correo":"test@example.com","contraseña":"password123"}'

# Login
curl -X POST http://localhost:4000/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@example.com","contraseña":"password123"}'

# Listar puntos
curl http://localhost:4000/puntos

# Crear punto (requiere token)
curl -X POST http://localhost:4000/puntos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Punto Test","latitud":20.5,"longitud":-99.2,"tipo_residuo":"PET"}'
```

---

## Variables de Entorno

**Backend (`backend/.env`)**
```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/reciclaje_garcia
JWT_SECRET=tu_secreto_muy_seguro
ADMIN_EMAIL=22067@virtual.utsc.edu.mx
NODE_ENV=development
```

---

## Errores Comunes

### "Token required"
Falta el header `Authorization: Bearer <token>`

### "Invalid token"
El token es inválido o expiró (duración: 8 horas)

### "Admin only"
El usuario no tiene rol `admin`

### "Correo ya registrado"
Ese email ya tiene una cuenta registrada

---

## Consideraciones de Seguridad

1. **JWT_SECRET:** Cambiar en producción - usar string aleatorio largo
2. **HTTPS:** Usar en producción (no HTTP)
3. **CORS:** Configurado en `backend/src/index.js`
4. **Password:** Encriptadas con bcrypt (salt: 10)
5. **SQL Injection:** Previsto usando pg (prepared statements)

---

Más info: https://github.com/Aguspreen/puntosreciclaje
