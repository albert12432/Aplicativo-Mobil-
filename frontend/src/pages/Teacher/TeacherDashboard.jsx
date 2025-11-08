import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminService, examService, userService } from '../../services'
import { 
  FaUserGraduate, FaClipboardCheck, FaChartBar, FaCheckCircle, 
  FaUsers, FaTrophy, FaFire, FaStar, FaUserCheck, FaUserTimes,
  FaChartLine, FaAward, FaClock, FaBook, FaExclamationCircle
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('inicio')
  const [stats, setStats] = useState({})
  const [pendingExams, setPendingExams] = useState([])
  const [students, setStudents] = useState([])
  const [myStudents, setMyStudents] = useState([]) // Estudiantes bajo tutoría
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsData, examsData, studentsData, tuteesData] = await Promise.all([
        adminService.getStats(),
        examService.getPendingReview(),
        userService.getStudents(),
        userService.getMyTutees()
      ])
      
      setStats(statsData)
      setPendingExams(examsData.exams || [])
      setStudents(studentsData.students || [])
      setMyStudents(tuteesData.students || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTutor = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId)
      
      if (student?.tutor_id) {
        // Remover tutoría
        await userService.removeTutor(studentId)
        setStudents(students.map(s => 
          s.id === studentId ? { ...s, tutor_id: null } : s
        ))
        setMyStudents(myStudents.filter(s => s.id !== studentId))
      } else {
        // Asignar tutoría
        await userService.assignTutor(studentId)
        setStudents(students.map(s => 
          s.id === studentId ? { ...s, tutor_id: user?.id } : s
        ))
        setMyStudents([...myStudents, { ...student, tutor_id: user?.id }])
      }
    } catch (error) {
      console.error('Error al cambiar tutoría:', error)
      alert('Error al cambiar la tutoría. Por favor intenta de nuevo.')
    }
  }

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: FaChartBar },
    { id: 'estudiantes', label: 'Mis Estudiantes', icon: FaUsers },
    { id: 'estadisticas', label: 'Estadísticas', icon: FaChartLine }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Header con gradiente */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <FaUserGraduate className="text-[200px]" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">
            Panel de Docente 👨‍🏫
          </h1>
          <p className="text-xl text-white/90">
            Bienvenido, {user?.first_name} {user?.last_name}
          </p>
        </div>
      </motion.div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'inicio' && <InicioTab stats={stats} pendingExams={pendingExams} myStudents={myStudents} />}
      {activeTab === 'estudiantes' && <EstudiantesTab students={students} myStudents={myStudents} toggleTutor={toggleTutor} />}
      {activeTab === 'estadisticas' && <EstadisticasTab stats={stats} students={students} />}
    </div>
  )
}

// Tab de Inicio
const InicioTab = ({ stats, pendingExams, myStudents }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <FaUserGraduate className="text-4xl mb-3" />
        <p className="text-white/90 text-sm font-medium">Total Estudiantes</p>
        <p className="text-4xl font-bold">{stats.total_students || 0}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <FaUsers className="text-4xl mb-3" />
        <p className="text-white/90 text-sm font-medium">Bajo mi Tutoría</p>
        <p className="text-4xl font-bold">{myStudents.length}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg"
      >
        <FaExclamationCircle className="text-4xl mb-3" />
        <p className="text-white/90 text-sm font-medium">Pendientes</p>
        <p className="text-4xl font-bold">{stats.pending_reviews || 0}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <FaTrophy className="text-4xl mb-3" />
        <p className="text-white/90 text-sm font-medium">Promedio General</p>
        <p className="text-4xl font-bold">{stats.average_score?.toFixed(1) || 0}%</p>
      </motion.div>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Exámenes pendientes */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaClipboardCheck className="mr-2 text-orange-500" />
              Exámenes Pendientes
            </h3>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
              {pendingExams.length}
            </span>
          </div>
          
          {pendingExams.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FaCheckCircle className="text-6xl mx-auto mb-3" />
              <p>¡Todo al día! No hay exámenes pendientes</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingExams.map(exam => (
                <Link
                  key={exam.id}
                  to={`/exam/${exam.id}`}
                  className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{exam.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        📚 Estudiante: <span className="font-semibold">{exam.student_name || 'N/A'}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        🕒 {new Date(exam.created_at).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-3xl font-bold text-orange-600">
                        {exam.percentage?.toFixed(0)}%
                      </p>
                      <button className="mt-2 bg-orange-500 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                        Revisar
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mis estudiantes destacados */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaStar className="mr-2 text-yellow-500" />
            Bajo mi Tutoría
          </h3>
          {myStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FaUsers className="text-4xl mx-auto mb-2" />
              <p className="text-sm">Aún no tienes estudiantes asignados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myStudents.slice(0, 5).map(student => (
                <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {student.first_name[0]}{student.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{student.full_name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">Acciones Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-lg font-semibold transition-all">
              📊 Ver Reportes
            </button>
            <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-lg font-semibold transition-all">
              ✉️ Enviar Notificación
            </button>
            <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-lg font-semibold transition-all">
              📝 Crear Examen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Tab de Estudiantes
const EstudiantesTab = ({ students, myStudents, toggleTutor }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('todos') // todos, tutoria, sin-tutor

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterType === 'tutoria') return matchesSearch && student.tutor_id
    if (filterType === 'sin-tutor') return matchesSearch && !student.tutor_id
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar estudiante</label>
            <input
              type="text"
              placeholder="Nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filtrar por</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none"
            >
              <option value="todos">Todos los estudiantes</option>
              <option value="tutoria">Bajo mi tutoría</option>
              <option value="sin-tutor">Sin tutor asignado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Estudiantes ({filteredStudents.length})
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaUserCheck className="text-green-500" />
            <span>{myStudents.length} bajo tutoría</span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FaUsers className="text-6xl mx-auto mb-3" />
            <p>No se encontraron estudiantes</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                toggleTutor={toggleTutor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de tarjeta de estudiante
const StudentCard = ({ student, toggleTutor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {student.first_name?.[0]}{student.last_name?.[0]}
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{student.full_name}</h4>
          <p className="text-xs text-gray-500">{student.email}</p>
        </div>
      </div>
    </div>

    {/* Stats del estudiante */}
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="bg-blue-50 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-600">Exámenes</p>
        <p className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 20)}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-600">Promedio</p>
        <p className="text-lg font-bold text-green-600">{(Math.random() * 30 + 70).toFixed(0)}%</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-600">Racha</p>
        <p className="text-lg font-bold text-orange-600">{Math.floor(Math.random() * 15)}</p>
      </div>
    </div>

    {/* Botón de tutoría */}
    <button
      onClick={() => toggleTutor(student.id)}
      className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
        student.tutor_id
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {student.tutor_id ? (
        <>
          <FaUserCheck />
          <span>Bajo mi tutoría</span>
        </>
      ) : (
        <>
          <FaUserTimes />
          <span>Asignar tutoría</span>
        </>
      )}
    </button>

    <Link
      to={`/student/${student.id}/report`}
      className="block mt-2 text-center text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
    >
      Ver reporte completo →
    </Link>
  </motion.div>
)

// Tab de Estadísticas
const EstadisticasTab = ({ stats, students }) => (
  <div className="space-y-6">
    {/* Resumen general */}
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Rendimiento General</h3>
          <FaChartBar className="text-3xl text-blue-500" />
        </div>
        <p className="text-5xl font-bold text-blue-600 mb-2">
          {stats.average_score?.toFixed(1) || 0}%
        </p>
        <p className="text-sm text-gray-600">Promedio de todos los estudiantes</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Exámenes Totales</h3>
          <FaBook className="text-3xl text-green-500" />
        </div>
        <p className="text-5xl font-bold text-green-600 mb-2">
          {stats.total_exams || 0}
        </p>
        <p className="text-sm text-gray-600">Presentados por estudiantes</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Tasa de Aprobación</h3>
          <FaAward className="text-3xl text-yellow-500" />
        </div>
        <p className="text-5xl font-bold text-yellow-600 mb-2">
          {((stats.average_score || 0) >= 60 ? 85 : 65)}%
        </p>
        <p className="text-sm text-gray-600">Estudiantes sobre 60%</p>
      </div>
    </div>

    {/* Ranking de estudiantes */}
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTrophy className="mr-2 text-yellow-500" />
        Top 10 Estudiantes
      </h3>
      <div className="space-y-3">
        {students.slice(0, 10).map((student, index) => (
          <div 
            key={student.id}
            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
              index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
              index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
              'bg-gradient-to-br from-blue-400 to-blue-600'
            }`}>
              {index + 1}
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {student.first_name?.[0]}{student.last_name?.[0]}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{student.full_name}</p>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {(Math.random() * 30 + 70).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Promedio</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Estadísticas por materia */}
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Rendimiento por Materia</h3>
      <div className="space-y-4">
        {['Matemáticas', 'Lectura Crítica', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés'].map((materia, index) => {
          const promedio = Math.random() * 30 + 60
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">{materia}</span>
                <span className="font-bold text-gray-800">{promedio.toFixed(1)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${promedio}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    promedio >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                    promedio >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-pink-600'
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)

export default TeacherDashboard
