# 📋 Estructura Completa del Proyecto

## 🎯 Visión General

Este proyecto es un **Sistema Completo de Preparación para Exámenes ICFES** desarrollado con:
- **Backend:** Python + Flask + MySQL
- **Frontend:** React + Vite + Tailwind CSS

Inspirado en la estructura de flujos de CuentasCobro (Laravel) pero implementado completamente en Python/React.

---

## 📁 Arquitectura del Proyecto

```
Aplicativo-Mobil-/
│
├── 📄 README.md                    # Documentación principal
├── 📄 INSTALACION.md               # Guía de instalación
├── 📄 PLAN_PROYECTO.md             # Plan detallado del proyecto
├── 📄 LICENSE
│
├── 📁 backend/                     # API REST Python Flask
│   ├── 📁 app/
│   │   ├── __init__.py
│   │   ├── extensions.py          # SQLAlchemy, Migrate
│   │   ├── models.py              # Modelos de BD (11 tablas)
│   │   │
│   │   └── 📁 routes/             # Endpoints API REST
│   │       ├── __init__.py        # Registro de blueprints
│   │       ├── auth_routes.py     # Login, Register, JWT
│   │       ├── user_routes.py     # Gestión de usuarios
│   │       ├── subject_routes.py  # Materias y temas
│   │       ├── exam_routes.py     # Exámenes y simulacros
│   │       ├── progress_routes.py # Progreso y notificaciones
│   │       └── admin_routes.py    # Panel docente
│   │
│   ├── config.py                  # Configuración Flask
│   ├── app.py                     # Aplicación principal
│   ├── requirements.txt           # Dependencias Python
│   ├── .env.example              # Variables de entorno
│   └── .gitignore
│
├── 📁 frontend/                   # Aplicación React
│   ├── 📁 public/
│   │   └── vite.svg
│   │
│   ├── 📁 src/
│   │   ├── main.jsx              # Entry point
│   │   ├── App.jsx               # Componente principal + Router
│   │   │
│   │   ├── 📁 components/        # Componentes reutilizables
│   │   │   ├── 📁 common/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── 📁 layout/
│   │   │       ├── Layout.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── Sidebar.jsx
│   │   │
│   │   ├── 📁 pages/             # Páginas/Vistas
│   │   │   ├── 📁 Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── 📁 Dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── 📁 Student/
│   │   │   │   └── StudentDashboard.jsx
│   │   │   ├── 📁 Teacher/
│   │   │   │   └── TeacherDashboard.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── placeholders.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 services/          # Comunicación con API
│   │   │   ├── api.js           # Axios configurado + interceptors
│   │   │   └── index.js         # Servicios organizados
│   │   │
│   │   ├── 📁 context/           # Estado global
│   │   │   ├── AuthContext.jsx  # Autenticación
│   │   │   └── ProgressContext.jsx # Progreso
│   │   │
│   │   └── 📁 styles/
│   │       └── index.css        # Tailwind + estilos personalizados
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── .gitignore
│
└── 📁 database/
    └── icfes_db.sql              # Script completo MySQL
```

---

## 🗄️ Modelo de Base de Datos

### Tablas Principales (11)

1. **roles** - Roles del sistema (estudiante, docente, admin)
2. **users** - Usuarios con autenticación
3. **subjects** - Materias ICFES (5 principales)
4. **topics** - Temas por materia
5. **questions** - Banco de preguntas
6. **exams** - Simulacros realizados
7. **exam_answers** - Respuestas de estudiantes
8. **progress** - Progreso por materia
9. **notifications** - Sistema de notificaciones
10. **grades** - Calificaciones docente
11. **cache/jobs** - Sistema de cache

### Relaciones
```
users (1) → (N) exams
users (1) → (N) progress
users (1) → (N) notifications
subjects (1) → (N) topics
topics (1) → (N) questions
exams (1) → (N) exam_answers
exams (1) → (N) grades
```

---

## 🔌 API Endpoints Implementados

### 🔐 Autenticación (`/api/auth`)
- `POST /register` - Registro de usuario
- `POST /login` - Inicio de sesión (retorna JWT)
- `GET /me` - Usuario actual
- `POST /refresh` - Refrescar token
- `PUT /change-password` - Cambiar contraseña

### 👤 Usuarios (`/api/users`)
- `GET /profile` - Obtener perfil + estadísticas
- `PUT /profile` - Actualizar perfil
- `GET /students` - Lista estudiantes (docentes)
- `GET /:id` - Usuario específico

### 📚 Materias (`/api/subjects`)
- `GET /` - Todas las materias
- `GET /:id` - Materia específica + temas
- `GET /:id/topics` - Temas de materia
- `GET /topics/:id/questions` - Preguntas (paginadas)

### 📝 Exámenes (`/api/exams`)
- `POST /create` - Crear examen/simulacro
- `POST /:id/submit` - Enviar respuestas
- `GET /my-exams` - Mis exámenes (paginado)
- `GET /:id` - Detalles de examen
- `GET /pending-review` - Pendientes (docentes)

### 📊 Progreso (`/api/progress`)
- `GET /my-progress` - Mi progreso total
- `GET /subject/:id` - Progreso por materia
- `POST /add-points` - Agregar puntos (gamificación)
- `GET /notifications` - Notificaciones
- `PUT /notifications/:id/read` - Marcar leída

### 👨‍🏫 Admin/Docentes (`/api/admin`)
- `POST /grade-exam` - Calificar examen
- `GET /students/:id/exams` - Exámenes de estudiante
- `GET /stats` - Estadísticas generales

---

## 🎨 Componentes Frontend Clave

### Contexts
- **AuthContext:** Manejo de autenticación, JWT, roles
- **ProgressContext:** Progreso, puntos, notificaciones

### Páginas Principales
- **Login/Register:** Autenticación completa
- **StudentDashboard:** Vista estudiante con materias
- **TeacherDashboard:** Vista docente con revisiones
- **NotFound:** Página 404

### Layout
- **Navbar:** Navegación superior con notificaciones
- **Sidebar:** Menú lateral según rol
- **ProtectedRoute:** HOC para rutas privadas

---

## 🔒 Seguridad Implementada

### Backend
✅ Contraseñas encriptadas con Bcrypt
✅ JWT con tokens de acceso y refresh
✅ Validación de datos en endpoints
✅ CORS configurado
✅ SQL injection prevention (SQLAlchemy ORM)
✅ Rate limiting ready

### Frontend
✅ Interceptores Axios para tokens
✅ Refresh automático de tokens
✅ Rutas protegidas por rol
✅ Validación de formularios
✅ Sanitización de inputs

---

## 🎯 Funcionalidades Especiales

### Gamificación (Tipo Duolingo)
- Sistema de puntos por actividad
- Niveles automáticos (cada 100 puntos)
- Rachas de días estudiando
- Actualización automática de progreso

### Calificación Automática
- Comparación de respuestas
- Puntuación instantánea
- Porcentaje de aciertos
- Explicaciones automáticas

### Dashboard Inteligente
- Estadísticas en tiempo real
- Gráficos de progreso
- Historial de exámenes
- Áreas de mejora identificadas

---

## 📦 Dependencias Principales

### Backend (Python)
```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.6.0
Flask-CORS==4.0.0
Flask-Migrate==4.0.5
PyMySQL==1.1.0
bcrypt==4.1.2
python-dotenv==1.0.0
```

### Frontend (React)
```
react==18.3.1
react-router-dom==6.22.0
axios==1.6.7
tailwindcss==3.4.1
framer-motion==11.0.5
recharts==2.12.0
react-icons==5.0.1
react-toastify==10.0.4
```

---

## 🚀 Comandos de Desarrollo

### Iniciar Todo el Sistema
```powershell
# Terminal 1 - Backend
cd backend
.\venv\Scripts\Activate.ps1
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Resetear Base de Datos
```powershell
mysql -u root -p -e "DROP DATABASE icfes_db; CREATE DATABASE icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p icfes_db < database\icfes_db.sql
```

---

## 📈 Próximas Fases de Desarrollo

### Fase 2 - Mejoras Inmediatas
- [ ] Páginas completas de SubjectView
- [ ] Vista de examen en tiempo real
- [ ] Resultados detallados con gráficos
- [ ] Perfil de usuario editable

### Fase 3 - Funcionalidades Avanzadas
- [ ] Sistema de recuperación de contraseña
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Exportar reportes a PDF
- [ ] Modo oscuro

### Fase 4 - Expansión
- [ ] App móvil (React Native)
- [ ] IA para recomendaciones personalizadas
- [ ] Integración con plataformas educativas
- [ ] Análisis predictivo de resultados

---

## 🎓 Inspiración del Proyecto

Basado en la estructura de:
- **CuentasCobro (Laravel):** Flujo de documentos y roles
- **Moodle:** Sistema de progreso educativo
- **Duolingo:** Gamificación y engagement
- **Khan Academy:** Dashboard de aprendizaje

---

**Desarrollado para cerrar brechas educativas en Colombia 🇨🇴**
