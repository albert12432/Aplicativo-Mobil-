import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaHome, FaBook, FaChartLine, FaUserGraduate, FaChalkboardTeacher, FaTimes } from 'react-icons/fa'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { isStudent, isTeacher } = useAuth()

  const studentLinks = [
    { path: '/dashboard', icon: FaHome, label: 'Inicio' },
    { path: '/student', icon: FaBook, label: 'Mis Materias' },
    { path: '/exams', icon: FaUserGraduate, label: 'Mis Exámenes' },
    { path: '/profile', icon: FaChartLine, label: 'Mi Progreso' },
  ]

  const teacherLinks = [
    { path: '/dashboard', icon: FaHome, label: 'Inicio' },
    { path: '/teacher', icon: FaChalkboardTeacher, label: 'Dashboard Docente' },
    { path: '/students', icon: FaUserGraduate, label: 'Estudiantes' },
    { path: '/profile', icon: FaChartLine, label: 'Estadísticas' },
  ]

  const links = isStudent() ? studentLinks : isTeacher() ? teacherLinks : studentLinks

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 w-64 h-screen pt-20 transition-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 bg-white border-r border-gray-200
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path

              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => onClose()}
                    className={`
                      flex items-center p-3 rounded-lg transition-colors
                      ${isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-3">{link.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
