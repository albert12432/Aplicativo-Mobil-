import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { tutoringService, userService } from '../../services'
import { 
  FaArrowLeft, FaPlus, FaTasks, FaCheckCircle, FaClock, 
  FaExclamationCircle, FaBook, FaTrash, FaEdit, FaCalendar
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const Tasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTask, setNewTask] = useState({
    student_id: '',
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const tasksData = await tutoringService.getTasks()
      setTasks(tasksData.tasks || [])
      
      // Si es docente, cargar lista de estudiantes bajo tutoría
      if (user?.role?.name === 'docente') {
        const studentsData = await userService.getMyTutees()
        setStudents(studentsData.students || [])
      }
    } catch (error) {
      console.error('Error cargando tareas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      await tutoringService.createTask(newTask)
      setShowCreateModal(false)
      setNewTask({
        student_id: '',
        title: '',
        description: '',
        due_date: '',
        priority: 'medium'
      })
      await loadData()
    } catch (error) {
      console.error('Error creando tarea:', error)
      alert('Error al crear la tarea')
    }
  }

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await tutoringService.updateTask(taskId, { status: newStatus })
      await loadData()
    } catch (error) {
      console.error('Error actualizando tarea:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return
    
    try {
      await tutoringService.deleteTask(taskId)
      await loadData()
    } catch (error) {
      console.error('Error eliminando tarea:', error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white'
      case 'in_progress': return 'bg-blue-500 text-white'
      case 'overdue': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle />
      case 'overdue': return <FaExclamationCircle />
      default: return <FaClock />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white"
      >
        <Link to={user?.role?.name === 'estudiante' ? '/dashboard' : '/teacher'} className="inline-flex items-center text-white/90 hover:text-white mb-4">
          <FaArrowLeft className="mr-2" />
          Volver
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaTasks className="text-4xl" />
            <div>
              <h1 className="text-3xl font-bold">Mis Tareas</h1>
              <p className="text-white/90">
                {user?.role?.name === 'docente' ? 'Tareas asignadas a tus estudiantes' : 'Tareas asignadas por tu tutor'}
              </p>
            </div>
          </div>
          {user?.role?.name === 'docente' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <FaPlus />
              <span>Nueva Tarea</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Lista de tareas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
            <FaTasks className="text-6xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {user?.role?.name === 'docente' ? 'No has asignado tareas aún' : 'No tienes tareas asignadas'}
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all"
            >
              {/* Header de la tarea */}
              <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                  {task.status === 'completed' ? 'Completada' : 
                   task.status === 'in_progress' ? 'En progreso' :
                   task.status === 'overdue' ? 'Vencida' : 'Pendiente'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                  {task.priority === 'high' ? 'Alta' : task.priority === 'low' ? 'Baja' : 'Media'}
                </span>
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h3>
              
              {/* Descripción */}
              {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{task.description}</p>
              )}

              {/* Info adicional */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {user?.role?.name === 'docente' && task.student && (
                  <p>👨‍🎓 {task.student.full_name}</p>
                )}
                {user?.role?.name === 'estudiante' && task.tutor && (
                  <p>👨‍🏫 {task.tutor.full_name}</p>
                )}
                {task.subject && (
                  <p className="flex items-center">
                    <FaBook className="mr-2" />
                    {task.subject.name}
                  </p>
                )}
                {task.due_date && (
                  <p className="flex items-center">
                    <FaCalendar className="mr-2" />
                    {new Date(task.due_date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex space-x-2">
                {user?.role?.name === 'estudiante' && task.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center space-x-1"
                  >
                    <FaCheckCircle />
                    <span>Completar</span>
                  </button>
                )}
                {user?.role?.name === 'docente' && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center space-x-1"
                  >
                    <FaTrash />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal de crear tarea */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Tarea</h2>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estudiante
                </label>
                <select
                  value={newTask.student_id}
                  onChange={(e) => setNewTask({ ...newTask, student_id: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Seleccionar estudiante...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de vencimiento
                </label>
                <input
                  type="datetime-local"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Tasks
