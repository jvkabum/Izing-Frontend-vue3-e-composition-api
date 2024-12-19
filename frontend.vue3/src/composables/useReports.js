import { ref } from 'vue'
import { api } from '@/services/api'
import { format } from 'date-fns'

export function useReports() {
  const loading = ref(false)
  const error = ref(null)

  const generateReport = async (type, filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.get(`/reports/${type}`, {
        params: filters
      })
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportReport = async (type, filters = {}, format = 'xlsx') => {
    loading.value = true
    try {
      const { data } = await api.get(`/reports/${type}/export`, {
        params: { ...filters, format },
        responseType: 'blob'
      })

      const fileName = `relatorio_${type}_${format(new Date(), 'dd-MM-yyyy')}.${format}`
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()

      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAttendanceReport = async (filters = {}) => {
    return generateReport('attendance', filters)
  }

  const getTicketsReport = async (filters = {}) => {
    return generateReport('tickets', filters)
  }

  const getUsersReport = async (filters = {}) => {
    return generateReport('users', filters)
  }

  const getQueueReport = async (queueId, filters = {}) => {
    return generateReport(`queues/${queueId}`, filters)
  }

  return {
    loading,
    error,
    generateReport,
    exportReport,
    getAttendanceReport,
    getTicketsReport,
    getUsersReport,
    getQueueReport
  }
} 