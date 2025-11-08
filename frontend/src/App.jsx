import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'

// Pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import StudentDashboard from './pages/Student/StudentDashboard'
import TeacherDashboard from './pages/Teacher/TeacherDashboard'
import Messages from './pages/Messages/Messages'
import Tasks from './pages/Tasks/Tasks'
import { SubjectView, ExamView, ExamResults, Profile } from './pages/placeholders'
import NotFound from './pages/NotFound'

// Components
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/layout/Layout'

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Rutas de estudiante */}
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/subject/:subjectId" element={<SubjectView />} />
                  <Route path="/exam/:examId" element={<ExamView />} />
                  <Route path="/exam/:examId/results" element={<ExamResults />} />
                  
                  {/* Rutas de docente */}
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  
                  {/* Rutas de tutoría */}
                  <Route path="/messages/:userId" element={<Messages />} />
                  <Route path="/tasks" element={<Tasks />} />
                  
                  {/* Perfil */}
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>
              
              {/* Redirección */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  )
}

export default App
