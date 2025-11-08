import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa'
import { useProgress } from '../../context/ProgressContext'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { unreadCount } = useProgress()

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden mr-3 text-gray-600 hover:text-gray-900"
            >
              <FaBars size={20} />
            </button>
            
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-gradient">ICFES Prep</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <Link to="/notifications" className="relative text-gray-600 hover:text-gray-900">
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Usuario */}
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full" />
                ) : (
                  <FaUserCircle size={32} className="text-gray-600" />
                )}
                <span className="hidden md:block font-medium text-gray-700">
                  {user?.first_name}
                </span>
              </Link>
              
              <button
                onClick={logout}
                className="ml-4 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
