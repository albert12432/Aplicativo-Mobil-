import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProgress } from '../../context/ProgressContext'
import { subjectService, examService, userService, tutoringService } from '../../services'
import { 
  FaBook, FaChartLine, FaFire, FaTrophy, FaClock, FaCheckCircle,
  FaStar, FaArrowRight, FaPlay, FaAward, FaGraduationCap, FaUserTie, FaEnvelope, FaPhone, FaComments
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { progress, getTotalPoints, getMaxStreak } = useProgress()
  const [subjects, setSubjects] = useState([])
  const [recentExams, setRecentExams] = useState([])
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [subjectsData, examsData, tutorData] = await Promise.all([
        subjectService.getAll(),
        examService.getMyExams({ per_page: 5 }),
        userService.getMyTutor().catch(() => ({ tutor: null }))
      ])
      
      setSubjects(subjectsData.subjects || [])
      setRecentExams(examsData.exams || [])
      setTutor(tutorData.tutor || null)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevel = () => {
    const points = getTotalPoints()
    return Math.floor(points / 100) + 1
  }

  const getProgressToNextLevel = () => {
    const points = getTotalPoints()
    const currentLevelPoints = (getLevel() - 1) * 100
    const nextLevelPoints = getLevel() * 100
    return ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu progreso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Header con saludo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <FaGraduationCap className="text-[200px]" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">
            ¡Hola, {user?.first_name}! 👋
          </h1>
          <p className="text-xl text-white/90 mb-6">
            ¡Sigues con tu racha de {getMaxStreak()} días! 🔥 ¡Sigue así!
          </p>
          
          {/* Progress Bar para nivel */}
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Nivel {getLevel()}</span>
              <span className="text-sm">Nivel {getLevel() + 1}</span>
            </div>
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getProgressToNextLevel()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-white h-full rounded-full"
              />
            </div>
            <p className="text-xs text-white/80 mt-1">
              {100 - Math.floor(getProgressToNextLevel())} puntos para el siguiente nivel
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - Estilo Duolingo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <FaTrophy className="text-4xl mb-3" />
          <p className="text-white/90 text-sm font-medium">Total Puntos</p>
          <p className="text-4xl font-bold">{getTotalPoints()}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <FaFire className="text-4xl mb-3" />
          <p className="text-white/90 text-sm font-medium">Racha de Días</p>
          <p className="text-4xl font-bold">{getMaxStreak()}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <FaBook className="text-4xl mb-3" />
          <p className="text-white/90 text-sm font-medium">Materias</p>
          <p className="text-4xl font-bold">{subjects.length}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <FaChartLine className="text-4xl mb-3" />
          <p className="text-white/90 text-sm font-medium">Exámenes</p>
          <p className="text-4xl font-bold">{recentExams.length}</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Materias y Progreso */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continuar donde lo dejaste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FaPlay className="mr-2 text-primary-600" />
              Continúa estudiando
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Simulacro ICFES Completo
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Practica con todas las materias y mide tu progreso
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaClock className="mr-1" /> 4 horas
                    </span>
                    <span className="flex items-center">
                      <FaStar className="mr-1 text-yellow-500" /> +50 puntos
                    </span>
                  </div>
                </div>
                <Link
                  to="/exam/create"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center"
                >
                  Empezar
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Materias disponibles - Estilo Moodle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Materias</h2>
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                >
                  <Link
                    to={`/subject/${subject.id}`}
                    className="block bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${subject.color}20` }}
                        >
                          {subject.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                            {subject.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {subject.total_topics || 0} temas disponibles
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: subject.color }}>
                            {Math.floor(Math.random() * 100)}%
                          </p>
                          <p className="text-xs text-gray-500">Progreso</p>
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Columna derecha - Actividad y Logros */}
        <div className="space-y-6">
          {/* Mi Tutor */}
          {tutor && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center mb-4">
                <FaUserTie className="text-3xl mr-2" />
                <h3 className="text-xl font-bold">Tu Tutor</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {tutor.full_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{tutor.full_name}</p>
                    <p className="text-white/80 text-sm">Docente asignado</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-white/70" />
                    <span className="text-white/90">{tutor.email}</span>
                  </div>
                  {tutor.phone && (
                    <div className="flex items-center space-x-2">
                      <FaPhone className="text-white/70" />
                      <span className="text-white/90">{tutor.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-white/80 text-sm mb-3">
                Tu tutor está aquí para ayudarte en tu proceso de aprendizaje. ¡No dudes en contactarlo!
              </p>
              
              <button
                onClick={() => navigate(`/messages/${tutor.id}`)}
                className="w-full bg-white text-indigo-600 py-2.5 px-4 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <FaComments />
                <span>Enviar Mensaje</span>
              </button>
            </motion.div>
          )}

          {/* Logros recientes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaAward className="mr-2 text-yellow-500" />
              Logros
            </h3>
            <div className="space-y-3">
              {getMaxStreak() >= 3 && (
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <p className="font-semibold text-gray-800">Racha Activa</p>
                    <p className="text-xs text-gray-600">{getMaxStreak()} días consecutivos</p>
                  </div>
                </div>
              )}
              {getTotalPoints() >= 100 && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <p className="font-semibold text-gray-800">Primer Centenar</p>
                    <p className="text-xs text-gray-600">100+ puntos ganados</p>
                  </div>
                </div>
              )}
              {recentExams.length >= 5 && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                  <div className="text-3xl">📚</div>
                  <div>
                    <p className="font-semibold text-gray-800">Estudiante Dedicado</p>
                    <p className="text-xs text-gray-600">{recentExams.length} exámenes completados</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actividad reciente */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h3>
            {recentExams.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FaClock className="text-4xl mx-auto mb-2" />
                <p className="text-sm">Aún no has realizado exámenes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentExams.slice(0, 3).map(exam => (
                  <Link
                    key={exam.id}
                    to={`/exam/${exam.id}/results`}
                    className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{exam.title}</p>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                      <span className="font-bold text-primary-600">{exam.percentage?.toFixed(0)}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-2">Meta Diaria</h3>
            <p className="text-white/90 text-sm mb-4">
              Completa un simulacro hoy para mantener tu racha
            </p>
            <Link
              to="/exam/create"
              className="block bg-white text-green-600 text-center py-2 rounded-lg font-bold hover:shadow-lg transition-shadow"
            >
              Practicar ahora
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
