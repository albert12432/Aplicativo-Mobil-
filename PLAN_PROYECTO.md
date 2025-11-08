# 📚 Sistema de Preparación ICFES - Plan de Proyecto

## 🎯 Problemática
Reducir las brechas de desigualdad educativa entre instituciones públicas y privadas que afectan:
- Desempeño en pruebas ICFES
- Desarrollo de competencias bilingües
- Oportunidades en educación superior y vida laboral

## 🚀 Solución: Plataforma Educativa ICFES

### Características Principales
1. **Sistema de Roles**
   - Estudiante: Acceso a materias, simulacros y progreso
   - Docente/Calificador: Revisión y seguimiento de estudiantes

2. **Módulo de Estudiante**
   - Dashboard de progreso tipo Duolingo
   - Materias disponibles (Matemáticas, Lectura Crítica, Ciencias, etc.)
   - Sistema de niveles y gamificación
   - Simulacros ICFES cronometrados
   - Estadísticas detalladas de rendimiento

3. **Módulo de Docente**
   - Panel de reportes tipo "cuentas de cobro"
   - Revisión de evaluaciones pendientes
   - Análisis grupal e individual
   - Retroalimentación a estudiantes

4. **Sistema de Autenticación**
   - Login/Registro con validación
   - Datos: Email, Teléfono, Contraseña, Nombre, Apellido
   - Perfiles personalizados por usuario

## 🛠️ Stack Tecnológico

### Backend
- **Python 3.11+** con Flask/FastAPI
- **MySQL** para base de datos
- **SQLAlchemy** ORM
- **JWT** para autenticación
- **Bcrypt** para encriptación

### Frontend
- **React 18+** con Vite
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Tailwind CSS** para estilos
- **Chart.js** para gráficos
- **Framer Motion** para animaciones

## 📊 Estructura de Base de Datos

### Tablas Principales
1. **users** - Usuarios del sistema
2. **roles** - Roles (Estudiante, Docente, Admin)
3. **subjects** - Materias (Matemáticas, Lectura, etc.)
4. **topics** - Temas por materia
5. **questions** - Banco de preguntas
6. **exams** - Simulacros realizados
7. **exam_answers** - Respuestas de estudiantes
8. **progress** - Progreso del estudiante
9. **notifications** - Sistema de notificaciones
10. **grades** - Calificaciones y retroalimentación

## 📁 Organización del Proyecto

```
icfes-app/
├── backend/               # API Python
│   ├── app/
│   │   ├── models/       # Modelos de BD
│   │   ├── routes/       # Endpoints API
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Autenticación, validación
│   │   └── utils/        # Funciones auxiliares
│   ├── migrations/       # Migraciones BD
│   ├── config/           # Configuración
│   └── requirements.txt
│
├── frontend/             # Aplicación React
│   ├── public/
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas/Vistas
│   │   ├── services/     # Servicios API
│   │   ├── context/      # Context API (estado global)
│   │   ├── hooks/        # Custom Hooks
│   │   ├── styles/       # Estilos globales
│   │   └── utils/        # Utilidades
│   └── package.json
│
└── database/
    └── icfes_db.sql      # Script de BD
```

## 🎨 Flujo de Trabajo

### Para Estudiantes:
1. Registro/Login
2. Selección de materias
3. Práctica por temas
4. Simulacros ICFES
5. Revisión de resultados
6. Seguimiento de progreso

### Para Docentes:
1. Login
2. Dashboard de estudiantes
3. Revisión de evaluaciones
4. Calificación y retroalimentación
5. Generación de reportes
6. Análisis estadístico

## 📈 Métricas de Éxito
- Tiempo de estudio por estudiante
- Mejora en puntajes simulacro
- Tasa de completación de temas
- Nivel de engagement (racha de días)
- Porcentaje de aprobación en simulacros
