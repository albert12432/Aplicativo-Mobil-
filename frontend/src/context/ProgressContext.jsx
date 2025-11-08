import { createContext, useContext, useState, useEffect } from 'react'
import { progressService } from '../services'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const ProgressContext = createContext()

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress debe ser usado dentro de ProgressProvider')
  }
  return context
}

export const ProgressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Cargar progreso cuando el usuario se autentique
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress()
      loadNotifications()
    }
  }, [isAuthenticated, user])

  const loadProgress = async () => {
    try {
      setLoading(true)
      const data = await progressService.getMyProgress()
      setProgress(data.progress || [])
    } catch (error) {
      console.error('Error cargando progreso:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadNotifications = async () => {
    try {
      const data = await progressService.getNotifications()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    } catch (error) {
      console.error('Error cargando notificaciones:', error)
    }
  }

  const getSubjectProgress = async (subjectId) => {
    try {
      const data = await progressService.getSubjectProgress(subjectId)
      return data.progress
    } catch (error) {
      console.error('Error obteniendo progreso de materia:', error)
      throw error
    }
  }

  const addPoints = async (subjectId, points) => {
    try {
      const data = await progressService.addPoints({ subject_id: subjectId, points })
      
      // Actualizar progreso local
      setProgress(prevProgress => {
        const index = prevProgress.findIndex(p => p.subject?.id === subjectId)
        if (index >= 0) {
          const newProgress = [...prevProgress]
          newProgress[index] = data.progress
          return newProgress
        } else {
          return [...prevProgress, data.progress]
        }
      })
      
      toast.success(`¡+${points} puntos ganados!`)
      return data.progress
    } catch (error) {
      console.error('Error agregando puntos:', error)
      toast.error('Error al agregar puntos')
      throw error
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      await progressService.markNotificationRead(notificationId)
      
      // Actualizar notificaciones locales
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marcando notificación:', error)
    }
  }

  const getTotalPoints = () => {
    return progress.reduce((total, p) => total + (p.total_points || 0), 0)
  }

  const getAverageLevel = () => {
    if (progress.length === 0) return 0
    const totalLevels = progress.reduce((sum, p) => sum + (p.level || 0), 0)
    return Math.round(totalLevels / progress.length)
  }

  const getMaxStreak = () => {
    if (progress.length === 0) return 0
    return Math.max(...progress.map(p => p.streak_days || 0))
  }

  const value = {
    progress,
    notifications,
    unreadCount,
    loading,
    loadProgress,
    loadNotifications,
    getSubjectProgress,
    addPoints,
    markNotificationAsRead,
    getTotalPoints,
    getAverageLevel,
    getMaxStreak,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export default ProgressContext
