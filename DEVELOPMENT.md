# Guía de Desarrollo - SIG Reciclaje

## Configuración Local

### Requisitos
- Docker & Docker Compose
- Node.js 18+ (opcional: solo si desarrollas sin Docker)
- Git

### Setup Inicial

```bash
# Clona el repo
git clone https://github.com/Aguspreen/puntosreciclaje.git
cd puntosreciclaje

# Crea archivo .env para backend
cp backend/.env.example backend/.env

# Edita backend/.env con valores reales (al menos JWT_SECRET):
# PORT=4000
# DATABASE_URL=postgresql://postgres:postgres@db:5432/reciclaje_garcia
# JWT_SECRET=tu_secreto_aleatorio_aqui
# ADMIN_EMAIL=22067@virtual.utsc.edu.mx
```

### Inicio con Docker

```bash
docker compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000
- **DB:** localhost:5432

### Desarrollo sin Docker (opcional)

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev
# Requiere PostgreSQL corriendo localmente

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## Estructura del Proyecto

```
Proyecto2/
├── backend/
│   ├── src/
│   │   ├── index.js           # Punto de entrada
│   │   ├── db.js              # Conexión Pool PostgreSQL
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT verify, requireAdmin
│   │   ├── routes/
│   │   │   ├── auth.js        # /usuarios/*
│   │   │   ├── puntos.js      # /puntos/*
│   │   │   ├── reportes.js    # /reportes/*
│   │   │   └── sugerencias.js # /sugerencias/*
│   │   └── utils/
│   │       └── validation.js  # Schemas Joi
│   ├── sql/
│   │   └── init.sql           # Schema con PostGIS
│   ├── tests/
│   │   └── app.test.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api.js             # Axios instance con interceptor JWT
│   │   ├── main.jsx           # Entry point React
│   │   ├── App.jsx            # Router principal
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Estado global usuario
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Map.jsx
│   │   │   ├── AddPunto.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Suggestions.jsx
│   │   │   └── Reports.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── package.json
│   └── .gitignore
│
├── docker-compose.yml
├── .gitignore
├── README.md
├── API_DOCS.md
├── DEVELOPMENT.md (este archivo)
└── start.bat / start.sh

```

---

## Workflow

### Crear una Feature

```bash
# Asegúrate de estar en dev
git checkout dev
git pull origin dev

# Crea rama feature
git checkout -b feature/nueva-funcionalidad

# Develop...
vim frontend/src/pages/NewPage.jsx

# Commit
git add .
git commit -m "feat(frontend): add new page with filtering"

# Push
git push origin feature/nueva-funcionalidad

# Crea PR en GitHub: feature/nueva-funcionalidad -> dev
```

### Ramas

- **main:** estable, última versión producción
- **dev:** desarrollo integrado (mezcla PRs)
- **feature/*:** ramas de feature aisladas

---

## Convenciones de Código

### Commits

```
type(scope): description

feat(backend): add user role patch endpoint
fix(frontend): correct leaflet popup position
docs(readme): update API docs
refactor(backend): simplify auth middleware
```

**Types:** feat, fix, docs, refactor, test, chore, style

### Nombres de Archivos/Componentes

- **React Components:** PascalCase (`UserPanel.jsx`)
- **Modelos/Rutas:** camelCase (`userRoutes.js`)
- **Styles:** snake_case si no son componentes

### Código

- **Indentación:** 2 espacios (configurado en Vite)
- **Punto y coma:** Obligatorio
- **Const prefer:** usar `const` antes que `let` o `var`

---

## Testing

### Backend

```bash
cd backend
npm test
# O con nodemon en desarrollo:
npm run dev
```

Tests ubicados en `backend/tests/`

### Frontend (futuro)

```bash
cd frontend
npm run test
# Usar React Testing Library + Jest
```

---

## Despliegue

### Producción (Docker)

```bash
# Build images
docker compose -f docker-compose.yml build

# Deploy
docker compose -f docker-compose.yml up -d

# Ver logs
docker compose logs -f
```

### Env en Producción

Cambiar:
- `JWT_SECRET` → string aleatorio seguro (32+ caracteres)
- `DATABASE_URL` → credenciales reales de PostgreSQL
- `NODE_ENV` → `production`
- `PORT` → según configuración (default 4000)

---

## Debugging

### Backend

```bash
# Logs de contenedor
docker compose logs backend -f

# Entrar en contenedor
docker compose exec backend sh

# Conexión DB (dentro del contenedor)
psql $DATABASE_URL
SELECT * FROM usuarios;
```

### Frontend

- Abrir DevTools (F12) en navegador
- Redux DevTools (si se agrega Redux)
- Network tab para ver llamadas API

---

## Dependencias Principales

### Backend
- `express` - Framework HTTP
- `pg` - Cliente PostgreSQL
- `jsonwebtoken` - JWT
- `bcrypt` - Hash contraseñas
- `joi` - Validación schemas

### Frontend
- `react` - UI framework
- `react-router-dom` - Routing
- `leaflet` + `react-leaflet` - Mapas
- `@mui/material` - Componentes Material Design
- `axios` - HTTP client

---

## FAQ

**P: ¿Cómo agrego un nuevo endpoint?**

1. Crea archivo `backend/src/routes/nueva.js`
2. Exporte router con Express
3. Añade en `backend/src/index.js`: `app.use('/ruta', require('./routes/nueva'))`
4. Documenta en `API_DOCS.md`

**P: ¿Cómo cambio el email admin?**

Edita `backend/.env`:
```
ADMIN_EMAIL=nuevo@email.com
```
El siguiente registro con ese email será admin.

**P: ¿Dónde está la BD?**

PostgreSQL en contenedor Docker, volumen: `db-data`

```bash
docker volume ls
docker volume inspect proyecto2_db-data
```

**P: ¿JWT expirado cómo lo manejo?**

Frontend en `src/api.js` intercepta 401 y puede redirigir a `/login`.

---

## Checklist antes de hacer PR

- [ ] Código testado localmente
- [ ] `npm run dev` sin errores
- [ ] Commits claros y descriptivos
- [ ] Sin `console.log` de debug
- [ ] Archivos `.env` NO commiteados (solo .example)
- [ ] API documentada en `API_DOCS.md` si es nuevo endpoint
- [ ] Responsive en móvil (si es UI)

---

## Recursos

- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Leaflet Docs](https://leafletjs.com)
- [Material UI](https://mui.com)
- [PostGIS Docs](https://postgis.net)
- [JWT.io](https://jwt.io)

---

Preguntas? Abre issue en GitHub o contacta al equipo.
