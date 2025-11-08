# Sistema de Tutoría - Documentación

## 📚 Descripción General

El sistema de tutoría permite a los docentes asignar estudiantes bajo su supervisión y realizar seguimiento personalizado de su progreso académico.

## 🗄️ Cambios en la Base de Datos

### Tabla `users`
Se agregó el campo `tutor_id` para establecer la relación docente-estudiante:

```sql
tutor_id INT NULL
FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_users_tutor_id
```

## 🔌 Endpoints del Backend

### 1. Asignar Tutoría
**POST** `/api/users/assign-tutor`

Asigna al docente actual como tutor de un estudiante.

**Request Body:**
```json
{
  "student_id": 123
}
```

**Response:**
```json
{
  "message": "Tutoría asignada exitosamente",
  "student": {
    "id": 123,
    "full_name": "Juan Pérez",
    "tutor_id": 456,
    "tutor": {
      "id": 456,
      "full_name": "María Rodríguez",
      "email": "maria@example.com"
    }
  }
}
```

### 2. Remover Tutoría
**POST** `/api/users/remove-tutor`

Remueve la asignación de tutoría de un estudiante.

**Request Body:**
```json
{
  "student_id": 123
}
```

**Response:**
```json
{
  "message": "Tutoría removida exitosamente",
  "student": {
    "id": 123,
    "full_name": "Juan Pérez",
    "tutor_id": null,
    "tutor": null
  }
}
```

### 3. Obtener Mis Estudiantes Bajo Tutoría
**GET** `/api/users/my-tutees`

Obtiene la lista de estudiantes bajo la tutoría del docente actual.

**Response:**
```json
{
  "students": [
    {
      "id": 123,
      "full_name": "Juan Pérez",
      "email": "juan@example.com",
      "tutor_id": 456
    }
  ],
  "total": 1
}
```

### 4. Obtener Mi Tutor (Estudiantes)
**GET** `/api/users/my-tutor`

Permite a un estudiante ver su tutor asignado.

**Response:**
```json
{
  "tutor": {
    "id": 456,
    "full_name": "María Rodríguez",
    "email": "maria@example.com",
    "phone": "123456789"
  }
}
```

## 🎨 Frontend - Dashboard del Docente

### Pestañas Implementadas

#### 1. **Inicio**
- Estadísticas generales (Total estudiantes, Bajo mi tutoría, Pendientes, Promedio)
- Lista de exámenes pendientes de revisión
- Sidebar con estudiantes bajo tutoría
- Acciones rápidas

#### 2. **Mis Estudiantes**
- Búsqueda por nombre o email
- Filtros: Todos, Bajo mi tutoría, Sin tutor
- Tarjetas de estudiante con:
  - Avatar y datos básicos
  - Estadísticas (Exámenes, Promedio, Racha)
  - **Botón toggle de tutoría** (verde si está asignado)
  - Link a reporte completo

#### 3. **Estadísticas**
- Rendimiento general
- Top 10 estudiantes (ranking con medallas)
- Barras de progreso por materia
- Tasa de aprobación

### Uso del Sistema de Tutoría

```javascript
// En TeacherDashboard.jsx

// Toggle tutoría (asignar/remover)
const toggleTutor = async (studentId) => {
  try {
    const student = students.find(s => s.id === studentId)
    
    if (student?.tutor_id) {
      await userService.removeTutor(studentId)
      // Actualizar estado local
    } else {
      await userService.assignTutor(studentId)
      // Actualizar estado local
    }
  } catch (error) {
    console.error('Error al cambiar tutoría:', error)
  }
}
```

## 🔧 Servicios Frontend

### userService (services/index.js)

```javascript
// Asignar tutoría
userService.assignTutor(studentId)

// Remover tutoría
userService.removeTutor(studentId)

// Obtener mis estudiantes bajo tutoría
userService.getMyTutees()

// Obtener mi tutor (para estudiantes)
userService.getMyTutor()
```

## 🎯 Características Implementadas

✅ **Base de Datos**
- Campo `tutor_id` agregado con foreign key
- Índice para optimizar consultas
- Migración SQL automática

✅ **Backend (Flask)**
- 4 nuevos endpoints REST
- Validación de permisos (solo docentes)
- Relación bidireccional en modelos

✅ **Frontend (React)**
- Dashboard con 3 pestañas
- Interfaz moderna con Framer Motion
- Toggle visual de tutoría
- Filtros y búsqueda de estudiantes
- Estadísticas en tiempo real

✅ **Seguridad**
- Solo docentes pueden asignar/remover tutorías
- Validación de que el usuario es estudiante
- JWT para autenticación
- Permisos verificados en cada endpoint

## 📊 Flujo de Usuario (Docente)

1. El docente inicia sesión
2. Accede al Dashboard del Docente
3. Navega a la pestaña "Mis Estudiantes"
4. Busca/filtra estudiantes
5. Hace clic en "Asignar tutoría" en la tarjeta del estudiante
6. El botón cambia a verde: "Bajo mi tutoría"
7. El estudiante aparece en:
   - Sidebar del tab "Inicio"
   - Filtro "Bajo mi tutoría"
   - Estadística "Bajo mi Tutoría" (contador)

## 🔄 Flujo de Usuario (Estudiante)

1. El estudiante inicia sesión
2. En su dashboard/perfil puede ver:
   - "Tu tutor: [Nombre del docente]"
   - Información de contacto del tutor
   - Opción de enviar mensaje (futura implementación)

## 🚀 Próximas Mejoras

- [ ] Sistema de mensajería docente-estudiante
- [ ] Notificaciones cuando se asigna un tutor
- [ ] Reportes personalizados por tutor
- [ ] Calendario de sesiones de tutoría
- [ ] Chat en tiempo real
- [ ] Seguimiento de tareas asignadas
- [ ] Alertas automáticas de bajo rendimiento

## 📝 Notas de Migración

Si necesitas revertir los cambios:

```sql
ALTER TABLE users DROP FOREIGN KEY fk_users_tutor;
ALTER TABLE users DROP INDEX idx_users_tutor_id;
ALTER TABLE users DROP COLUMN tutor_id;
```

## 🧪 Testing

Para probar el sistema:

1. Inicia sesión como docente
2. Navega a "Mis Estudiantes"
3. Asigna tutoría a un estudiante
4. Verifica que aparece en "Bajo mi tutoría" (filtro y sidebar)
5. Cierra sesión e inicia como el estudiante
6. Verifica que puede ver su tutor asignado

---

**Fecha de implementación:** 8 de noviembre de 2025
**Versión:** 1.0
**Estado:** ✅ Completado y funcional
