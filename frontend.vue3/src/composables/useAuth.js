import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

export function useAuth() {
  const router = useRouter()
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', credentials)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const { data } = await api.get('/auth/check')
      user.value = data.user
      return true
    } catch (err) {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
} 