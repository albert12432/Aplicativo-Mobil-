import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { tutoringService } from '../../services'
import { FaArrowLeft, FaPaperPlane, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Messages = () => {
  const { userId } = useParams() // ID del usuario con quien se conversa
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState(null)

  useEffect(() => {
    if (userId) {
      loadConversation()
    }
  }, [userId])

  const loadConversation = async () => {
    try {
      const data = await tutoringService.getConversation(userId)
      setMessages(data.messages || [])
      
      // Obtener info del otro usuario del primer mensaje
      if (data.messages && data.messages.length > 0) {
        const firstMessage = data.messages[0]
        const other = firstMessage.sender.id === user.id ? firstMessage.receiver : firstMessage.sender
        setOtherUser(other)
      }
    } catch (error) {
      console.error('Error cargando conversación:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      await tutoringService.sendMessage({
        receiver_id: parseInt(userId),
        subject: subject || 'Sin asunto',
        message: newMessage
      })
      
      setNewMessage('')
      setSubject('')
      await loadConversation()
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      alert('Error al enviar el mensaje. Por favor intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white"
      >
        <Link to={user?.role?.name === 'estudiante' ? '/dashboard' : '/teacher'} className="inline-flex items-center text-white/90 hover:text-white mb-4">
          <FaArrowLeft className="mr-2" />
          Volver
        </Link>
        <div className="flex items-center space-x-4">
          <FaEnvelope className="text-4xl" />
          <div>
            <h1 className="text-3xl font-bold">Mensajes</h1>
            {otherUser && (
              <p className="text-white/90">Conversación con {otherUser.full_name}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lista de mensajes */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6 max-h-[500px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FaEnvelope className="text-6xl mx-auto mb-3" />
            <p>No hay mensajes aún. ¡Empieza la conversación!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender.id === user.id ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender.id === user.id ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl p-4`}>
                  {msg.subject && (
                    <p className={`font-bold text-sm mb-1 ${msg.sender.id === user.id ? 'text-white/90' : 'text-gray-600'}`}>
                      {msg.subject}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <div className={`flex items-center justify-between mt-2 text-xs ${msg.sender.id === user.id ? 'text-white/70' : 'text-gray-500'}`}>
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      {new Date(msg.created_at).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {msg.sender.id === user.id && msg.is_read && (
                      <span className="flex items-center">
                        <FaCheckCircle className="mr-1" />
                        Leído
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario de nuevo mensaje */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Asunto (opcional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del mensaje..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensaje
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <FaPaperPlane />
                <span>Enviar Mensaje</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default Messages
