import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaGraduationCap, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'estudiante',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...userData } = formData
      await register(userData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error en registro:', error)
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'Acceso a más de 1000 preguntas ICFES',
    'Simulacros completos por materia',
    'Seguimiento de tu progreso',
    'Sistema de puntos y recompensas',
    'Estadísticas detalladas'
  ]

  return (
    <div className="min-h-screen flex bg-white">
      {/* Panel Izquierdo - Beneficios */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-teal-600 to-cyan-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Patrones decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 mb-12"
          >
            <FaGraduationCap className="text-white text-5xl" />
            <h1 className="text-4xl font-bold text-white">ICFES Prep</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Únete a miles de estudiantes
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Comienza tu preparación hoy mismo
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
              >
                <FaCheckCircle className="text-white text-xl flex-shrink-0" />
                <p className="text-white text-lg">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.p 
          className="text-white/80 text-sm relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          © 2025 ICFES Prep. Todos los derechos reservados.
        </motion.p>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FaGraduationCap className="text-green-600 text-5xl" />
              <h1 className="text-4xl font-bold text-gray-800">ICFES Prep</h1>
            </div>
            <p className="text-gray-600">Crea tu cuenta gratis</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear cuenta</h2>
            <p className="text-gray-600">Comienza tu preparación ICFES ahora</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de usuario */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'estudiante' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'estudiante'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="font-semibold">Estudiante</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'docente' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'docente'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <div className="font-semibold">Docente</div>
                </button>
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Pérez"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors pr-12"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors pr-12"
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                'Crear mi cuenta gratis'
              )}
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            Al crear una cuenta, aceptas nuestros términos y condiciones
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
