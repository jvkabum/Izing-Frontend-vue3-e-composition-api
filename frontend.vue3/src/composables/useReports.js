import { ref } from 'vue'
import { api } from '@/services/api'
import { format } from 'date-fns'

export function useReports() {
  const loading = ref(false)
  const error = ref(null)

  const getAttendanceReport = async (filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/reports/attendance', { params: filters })
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTicketsReport = async (filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/reports/tickets', { params: filters })
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUsersReport = async (filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/reports/users', { params: filters })
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportReport = async (type, filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.get(`/reports/${type}/export`, {
        params: filters,
        responseType: 'blob'
      })

      const fileName = `relatorio_${type}_${format(new Date(), 'dd-MM-yyyy')}.xlsx`
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getAttendanceReport,
    getTicketsReport,
    getUsersReport,
    exportReport
  }
} 