import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar si hay usuario en localStorage al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
        
        // Verificar token con el servidor
        try {
          const response = await authService.getCurrentUser()
          setUser(response.user)
          localStorage.setItem('user', JSON.stringify(response.user))
        } catch (error) {
          // Si falla, limpiar
          logout()
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success('¡Bienvenido! Has iniciado sesión correctamente')
      return response
    } catch (error) {
      const message = error.response?.data?.error || 'Error al iniciar sesión'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      setUser(response.user)
      setIsAuthenticated(true)
      
      // Guardar tokens
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      toast.success('¡Registro exitoso! Bienvenido a ICFES Prep')
      return response
    } catch (error) {
      const message = error.response?.data?.error || 'Error al registrar usuario'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    toast.info('Has cerrado sesión')
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const isStudent = () => user?.role?.name === 'estudiante'
  const isTeacher = () => user?.role?.name === 'docente'
  const isAdmin = () => user?.role?.name === 'admin'

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    isStudent,
    isTeacher,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
