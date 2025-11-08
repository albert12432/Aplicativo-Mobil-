import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react'

const Dashboard = () => {
  const { isStudent, isTeacher } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirigir según el rol
    if (isStudent()) {
      navigate('/student', { replace: true })
    } else if (isTeacher()) {
      navigate('/teacher', { replace: true })
    }
  }, [isStudent, isTeacher, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner"></div>
    </div>
  )
}

export default Dashboard
