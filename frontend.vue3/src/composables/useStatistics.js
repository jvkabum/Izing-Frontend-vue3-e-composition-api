import { ref } from 'vue'
import { api } from '@/services/api'

export function useStatistics() {
  const stats = ref({})
  const loading = ref(false)
  const error = ref(null)

  const fetchStatistics = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/statistics', { params })
      stats.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserStats = async (userId, params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get(`/statistics/users/${userId}`, { params })
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchQueueStats = async (queueId, params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get(`/statistics/queues/${queueId}`, { params })
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStatistics,
    fetchUserStats,
    fetchQueueStats
  }
} 