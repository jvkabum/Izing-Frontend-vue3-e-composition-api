import { ref } from 'vue'
import axios from 'axios'
import { useAuth } from './useAuth'

export function useApi() {
  const baseURL = ref(process.env.VUE_URL_API)
  const loading = ref(false)
  const error = ref(null)

  const { token } = useAuth()

  const api = axios.create({
    baseURL: baseURL.value,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Interceptor de Request
  api.interceptors.request.use(
    config => {
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`
      }
      loading.value = true
      return config
    },
    err => {
      loading.value = false
      error.value = err.message
      return Promise.reject(err)
    }
  )

  // Interceptor de Response
  api.interceptors.response.use(
    response => {
      loading.value = false
      return response
    },
    err => {
      loading.value = false
      error.value = err.message

      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      return Promise.reject(err)
    }
  )

  return {
    api,
    loading,
    error
  }
} 