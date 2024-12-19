import { ref, computed } from 'vue'
import { api } from '@/services/api'

export function useUser() {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAdmin = computed(() => user.value?.profile === 'admin')

  const fetchProfile = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/users/profile')
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    try {
      const { data } = await api.put('/users/profile', profileData)
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (passwords) => {
    loading.value = true
    try {
      await api.put('/users/profile/password', passwords)
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAdmin,
    fetchProfile,
    updateProfile,
    updatePassword
  }
} 