import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          Página no encontrada
        </p>
        <p className="text-gray-500 mt-2 mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center">
          <FaHome className="mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFound
