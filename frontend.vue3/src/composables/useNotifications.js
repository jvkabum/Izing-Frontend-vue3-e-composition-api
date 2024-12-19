import { ref, computed } from 'vue'
import { api } from '@/services/api'
import { useSocket } from './useSocket'

export function useNotifications() {
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { socket } = useSocket()

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  const fetchNotifications = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/notifications')
      notifications.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`)
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      notifications.value.forEach(n => n.read = true)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`)
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Socket listeners
  socket.value?.on('notification', (data) => {
    notifications.value.unshift(data)
  })

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
} 