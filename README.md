# 📚 Sistema de Preparación ICFES

Sistema web completo de preparación para exámenes ICFES desarrollado con Python (Flask) + React + MySQL.

## 🎯 Descripción del Proyecto

Aplicativo educativo diseñado para reducir las brechas de desigualdad educativa entre instituciones públicas y privadas, enfocado en mejorar el desempeño en pruebas ICFES.

### Problemática
- Desigualdad en el acceso a recursos educativos de calidad
- Bajo desempeño en pruebas estandarizadas ICFES
- Falta de herramientas de estudio personalizadas
- Limitado seguimiento del progreso estudiantil

### Solución
Plataforma web con:
- ✅ Sistema de roles (Estudiante y Docente)
- ✅ Banco de preguntas tipo ICFES
- ✅ Simulacros cronometrados
- ✅ Gamificación tipo Duolingo (niveles, puntos, rachas)
- ✅ Dashboard de progreso tipo Moodle
- ✅ Sistema de calificación automática
- ✅ Retroalimentación docente
- ✅ Estadísticas y análisis de desempeño

## 🛠️ Stack Tecnológico

### Backend
- **Python 3.11+**
- **Flask** - Framework web
- **Flask-SQLAlchemy** - ORM
- **Flask-JWT-Extended** - Autenticación
- **MySQL** - Base de datos
- **Bcrypt** - Encriptación de contraseñas

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool
- **React Router** - Navegación
- **Axios** - HTTP client
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Recharts** - Gráficos

## 📦 Instalación

### Prerrequisitos
- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clonar el repositorio
```bash
cd Aplicativo-Mobil-
```

### 2. Configurar Base de Datos

#### Crear base de datos en MySQL
```bash
# Conectar a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE icfes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Importar estructura y datos
mysql -u root -p icfes_db < database/icfes_db.sql
```

### 3. Configurar Backend (Python/Flask)

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de configuración
copy .env.example .env

# Editar .env con tus credenciales de MySQL
# Configurar: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

#### Editar archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=icfes_db
DB_USER=root
DB_PASSWORD=tu_password_mysql
SECRET_KEY=genera_una_clave_secreta_segura
JWT_SECRET_KEY=genera_otra_clave_secreta
```

#### Iniciar servidor backend:
```bash
python app.py
```

El backend estará corriendo en: `http://localhost:5000`

### 4. Configurar Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar archivo de configuración
copy .env.example .env
```

#### Editar archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Iniciar servidor de desarrollo:
```bash
npm run dev
```

El frontend estará corriendo en: `http://localhost:5173`

## 👤 Usuarios de Prueba

### Estudiante
- **Email:** estudiante@icfes.test
- **Contraseña:** Estudiante123

### Docente
- **Email:** docente@icfes.test
- **Contraseña:** Docente123

## 📱 Funcionalidades

### Para Estudiantes:
1. **Dashboard Personal**
   - Vista general de progreso
   - Materias disponibles
   - Estadísticas de estudio

2. **Sistema de Materias**
   - Lectura Crítica
   - Matemáticas
   - Ciencias Naturales
   - Ciencias Sociales
   - Inglés

3. **Práctica y Simulacros**
   - Práctica por temas específicos
   - Simulacros ICFES cronometrados
   - Calificación automática
   - Explicaciones de respuestas

4. **Gamificación**
   - Sistema de puntos
   - Niveles de progreso
   - Rachas de estudio
   - Insignias y logros

5. **Análisis de Desempeño**
   - Gráficos de progreso
   - Estadísticas por materia
   - Historial de exámenes
   - Áreas de mejora

### Para Docentes:
1. **Dashboard Docente**
   - Resumen de estudiantes
   - Exámenes pendientes de revisión
   - Estadísticas generales

2. **Gestión de Estudiantes**
   - Lista de estudiantes
   - Historial de exámenes
   - Análisis individual y grupal

3. **Calificación y Retroalimentación**
   - Revisión de exámenes
   - Calificación personalizada
   - Comentarios y sugerencias
   - Identificación de fortalezas y debilidades

4. **Reportes**
   - Estadísticas de rendimiento
   - Reportes exportables
   - Análisis comparativo

## 📂 Estructura del Proyecto

```
Aplicativo-Mobil-/
├── backend/                    # API Python Flask
│   ├── app/
│   │   ├── models.py          # Modelos de base de datos
│   │   ├── routes/            # Endpoints API
│   │   ├── extensions.py      # Extensiones Flask
│   │   └── __init__.py
│   ├── config.py              # Configuración
│   ├── app.py                 # Aplicación principal
│   ├── requirements.txt       # Dependencias Python
│   └── .env.example
│
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas/Vistas
│   │   ├── services/          # Servicios API
│   │   ├── context/           # Context API
│   │   ├── styles/            # Estilos
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── database/
│   └── icfes_db.sql           # Script de base de datos
│
├── PLAN_PROYECTO.md           # Documentación del proyecto
└── README.md
```

## 🔧 Comandos Útiles

### Backend
```bash
# Activar entorno virtual
venv\Scripts\activate

# Instalar nuevas dependencias
pip install nombre_paquete
pip freeze > requirements.txt

# Ejecutar servidor
python app.py

# Crear migraciones (si se modifican modelos)
flask db migrate -m "descripción"
flask db upgrade
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview build
npm run preview
```

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Usuario actual
- `PUT /api/auth/change-password` - Cambiar contraseña

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `GET /api/users/students` - Lista de estudiantes (docentes)

### Materias
- `GET /api/subjects/` - Todas las materias
- `GET /api/subjects/:id` - Materia específica
- `GET /api/subjects/:id/topics` - Temas de una materia
- `GET /api/subjects/topics/:id/questions` - Preguntas

### Exámenes
- `POST /api/exams/create` - Crear examen
- `POST /api/exams/:id/submit` - Enviar respuestas
- `GET /api/exams/my-exams` - Mis exámenes
- `GET /api/exams/:id` - Detalles de examen
- `GET /api/exams/pending-review` - Pendientes (docentes)

### Progreso
- `GET /api/progress/my-progress` - Mi progreso
- `GET /api/progress/subject/:id` - Progreso por materia
- `POST /api/progress/add-points` - Agregar puntos
- `GET /api/progress/notifications` - Notificaciones

## 📊 Base de Datos

### Tablas Principales
- `roles` - Roles del sistema
- `users` - Usuarios
- `subjects` - Materias
- `topics` - Temas
- `questions` - Preguntas
- `exams` - Exámenes
- `exam_answers` - Respuestas
- `progress` - Progreso
- `notifications` - Notificaciones
- `grades` - Calificaciones

## 🚀 Características Técnicas

### Seguridad
- ✅ Contraseñas encriptadas con Bcrypt
- ✅ Autenticación JWT
- ✅ Tokens de acceso y refresh
- ✅ Validación de datos
- ✅ Protección CORS

### Performance
- ✅ Paginación de resultados
- ✅ Índices en base de datos
- ✅ Queries optimizadas
- ✅ Lazy loading de componentes

### UX/UI
- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Feedback visual inmediato
- ✅ Toast notifications
- ✅ Loading states

## 📝 Próximas Mejoras

- [ ] Sistema de recuperación de contraseña
- [ ] Chat en tiempo real entre docentes y estudiantes
- [ ] Exportar reportes a PDF
- [ ] Modo oscuro
- [ ] App móvil nativa
- [ ] Integración con Google Classroom
- [ ] Certificados de logros
- [ ] Ranking de estudiantes
- [ ] Modo offline
- [ ] Tests adaptativos con IA

## 🤝 Contribución

Este proyecto fue desarrollado como solución a la problemática de desigualdad educativa en Colombia.

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 👨‍💻 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para mejorar la educación en Colombia**
Creación de aplicativo móvil de desarrollo ICES 
