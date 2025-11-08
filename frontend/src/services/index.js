import api from './api'

// Servicio de Autenticación
export const authService = {
  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Cambiar contraseña
  changePassword: async (passwords) => {
    const response = await api.put('/auth/change-password', passwords)
    return response.data
  },
}

// Servicio de Usuarios
export const userService = {
  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData)
    return response.data
  },

  // Obtener estudiantes (para docentes)
  getStudents: async () => {
    const response = await api.get('/users/students')
    return response.data
  },

  // Asignar tutoría a un estudiante
  assignTutor: async (studentId) => {
    const response = await api.post('/users/assign-tutor', { student_id: studentId })
    return response.data
  },

  // Remover tutoría de un estudiante
  removeTutor: async (studentId) => {
    const response = await api.post('/users/remove-tutor', { student_id: studentId })
    return response.data
  },

  // Obtener mis estudiantes bajo tutoría
  getMyTutees: async () => {
    const response = await api.get('/users/my-tutees')
    return response.data
  },

  // Obtener mi tutor (para estudiantes)
  getMyTutor: async () => {
    const response = await api.get('/users/my-tutor')
    return response.data
  },
}

// Servicio de Materias
export const subjectService = {
  // Obtener todas las materias
  getAll: async () => {
    const response = await api.get('/subjects/')
    return response.data
  },

  // Obtener una materia
  getById: async (id) => {
    const response = await api.get(`/subjects/${id}`)
    return response.data
  },

  // Obtener temas de una materia
  getTopics: async (subjectId) => {
    const response = await api.get(`/subjects/${subjectId}/topics`)
    return response.data
  },

  // Obtener preguntas de un tema
  getQuestions: async (topicId, params = {}) => {
    const response = await api.get(`/subjects/topics/${topicId}/questions`, { params })
    return response.data
  },
}

// Servicio de Exámenes
export const examService = {
  // Crear examen
  create: async (examData) => {
    const response = await api.post('/exams/create', examData)
    return response.data
  },

  // Enviar respuestas
  submit: async (examId, answers) => {
    const response = await api.post(`/exams/${examId}/submit`, { answers })
    return response.data
  },

  // Obtener mis exámenes
  getMyExams: async (params = {}) => {
    const response = await api.get('/exams/my-exams', { params })
    return response.data
  },

  // Obtener detalles de un examen
  getById: async (examId) => {
    const response = await api.get(`/exams/${examId}`)
    return response.data
  },

  // Obtener exámenes pendientes (docentes)
  getPendingReview: async () => {
    const response = await api.get('/exams/pending-review')
    return response.data
  },
}

// Servicio de Progreso
export const progressService = {
  // Obtener mi progreso
  getMyProgress: async () => {
    const response = await api.get('/progress/my-progress')
    return response.data
  },

  // Obtener progreso de una materia
  getSubjectProgress: async (subjectId) => {
    const response = await api.get(`/progress/subject/${subjectId}`)
    return response.data
  },

  // Agregar puntos
  addPoints: async (data) => {
    const response = await api.post('/progress/add-points', data)
    return response.data
  },

  // Obtener notificaciones
  getNotifications: async () => {
    const response = await api.get('/progress/notifications')
    return response.data
  },

  // Marcar notificación como leída
  markNotificationRead: async (notificationId) => {
    const response = await api.put(`/progress/notifications/${notificationId}/read`)
    return response.data
  },
}

// Servicio de Administración (Docentes)
export const adminService = {
  // Calificar examen
  gradeExam: async (gradeData) => {
    const response = await api.post('/admin/grade-exam', gradeData)
    return response.data
  },

  // Obtener exámenes de un estudiante
  getStudentExams: async (studentId) => {
    const response = await api.get(`/admin/students/${studentId}/exams`)
    return response.data
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },
}

// Servicio de Tutoría (Mensajes y Tareas)
export const tutoringService = {
  // ===== MENSAJES =====
  // Obtener todos los mensajes
  getMessages: async () => {
    const response = await api.get('/tutoring/messages')
    return response.data
  },

  // Obtener conversación con un usuario
  getConversation: async (userId) => {
    const response = await api.get(`/tutoring/messages/conversation/${userId}`)
    return response.data
  },

  // Enviar mensaje
  sendMessage: async (messageData) => {
    const response = await api.post('/tutoring/messages/send', messageData)
    return response.data
  },

  // Marcar mensaje como leído
  markMessageRead: async (messageId) => {
    const response = await api.put(`/tutoring/messages/${messageId}/read`)
    return response.data
  },

  // ===== TAREAS =====
  // Obtener tareas
  getTasks: async () => {
    const response = await api.get('/tutoring/tasks')
    return response.data
  },

  // Crear tarea
  createTask: async (taskData) => {
    const response = await api.post('/tutoring/tasks/create', taskData)
    return response.data
  },

  // Actualizar tarea
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tutoring/tasks/${taskId}`, taskData)
    return response.data
  },

  // Eliminar tarea
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tutoring/tasks/${taskId}`)
    return response.data
  },
}

export default {
  auth: authService,
  user: userService,
  subject: subjectService,
  exam: examService,
  progress: progressService,
  admin: adminService,
  tutoring: tutoringService,
}
