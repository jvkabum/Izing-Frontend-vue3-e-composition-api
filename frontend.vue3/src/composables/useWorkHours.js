import { ref } from 'vue'
import { api } from '@/services/api'

export function useWorkHours() {
  const workHours = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchWorkHours = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/work-hours')
      workHours.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWorkHours = async (workHoursData) => {
    loading.value = true
    try {
      const { data } = await api.put('/work-hours', workHoursData)
      workHours.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkIsWorkHour = async () => {
    try {
      const { data } = await api.get('/work-hours/check')
      return data.isWorkHour
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  return {
    workHours,
    loading,
    error,
    fetchWorkHours,
    updateWorkHours,
    checkIsWorkHour
  }
} 