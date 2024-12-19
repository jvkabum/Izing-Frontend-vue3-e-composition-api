import { ref, computed } from 'vue'
import { api } from '@/services/api'
import { useSocket } from './useSocket'

export function useChat() {
  const messages = ref([])
  const typing = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const { socket } = useSocket()

  const unreadCount = computed(() => 
    messages.value.filter(m => !m.read).length
  )

  const sendMessage = async (ticketId, messageData) => {
    loading.value = true
    try {
      const { data } = await api.post(`/messages/${ticketId}`, messageData)
      messages.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`)
      const message = messages.value.find(m => m.id === messageId)
      if (message) {
        message.read = true
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const startTyping = (ticketId) => {
    socket.value?.emit('typing', { ticketId, typing: true })
    typing.value = true
  }

  const stopTyping = (ticketId) => {
    socket.value?.emit('typing', { ticketId, typing: false })
    typing.value = false
  }

  return {
    messages,
    typing,
    loading,
    error,
    unreadCount,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping
  }
} 