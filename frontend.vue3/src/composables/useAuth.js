import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../services/api'
import { useSocket } from './useSocket'

export function useAuth() {
  // Composables
  const router = useRouter()
  const $q = useQuasar()
  const { socket, disconnect: disconnectSocket } = useSocket()

  // Estado
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Default configs
  const defaultFilters = {
    searchParam: '',
    pageNumber: 1,
    status: ['open', 'pending', 'closed'],
    showAll: false,
    count: null,
    queuesIds: [],
    withUnreadMessages: false,
    isNotAssignedUser: false,
    includeNotQueueDefined: true
  }

  // Computed
  const isAuthenticated = computed(() => !!user.value)

  const isAdmin = computed(() => 
    user.value?.profile === 'admin' || isSupport.value
  )

  const isSupport = computed(() => {
    const supportDomains = ['@']
    return supportDomains.some(domain => 
      user.value?.email?.toLowerCase().includes(domain.toLowerCase())
    )
  })

  const userQueues = computed(() => user.value?.queues || [])

  // Métodos
  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null

      const { data } = await api.post('/auth/login', {
        ...credentials,
        email: credentials.email.trim()
      })

      // Armazenar dados
      localStorage.setItem('token', JSON.stringify(data.token))
      localStorage.setItem('username', data.username)
      localStorage.setItem('profile', data.profile)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('usuario', JSON.stringify(data))
      localStorage.setItem('queues', JSON.stringify(data.queues))

      // Configurações
      if (data?.configs?.filtrosAtendimento) {
        localStorage.setItem('filtrosAtendimento', 
          JSON.stringify(data.configs.filtrosAtendimento)
        )
      } else {
        localStorage.setItem('filtrosAtendimento', 
          JSON.stringify(defaultFilters)
        )
      }

      // Tema
      if (data?.configs?.isDark !== undefined) {
        $q.dark.set(data.configs.isDark)
      }

      user.value = data

      // Notificar sucesso
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!',
        position: 'top'
      })

      // Redirecionar
      if (data.profile === 'admin') {
        router.push({ name: 'home-dashboard' })
      } else if (data.profile === 'super') {
        router.push({ name: 'empresassuper' })
      } else {
        router.push({ name: 'atendimento' })
      }

      return data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao realizar login'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      
      // Notificar servidor
      if (user.value?.id) {
        await api.post('/auth/logout', { userId: user.value.id })
      }

      // Desconectar socket
      disconnectSocket()

      // Limpar storage
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('profile')
      localStorage.removeItem('userId')
      localStorage.removeItem('usuario')
      localStorage.removeItem('queues')
      localStorage.removeItem('filtrosAtendimento')

      // Limpar estado
      user.value = null
      error.value = null

      // Redirecionar
      router.push({ name: 'login' })
    } catch (err) {
      console.error('Erro ao realizar logout:', err)
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      error.value = null

      const { data } = await api.put(`/users/${user.value.id}`, profileData)
      
      // Atualizar storage
      localStorage.setItem('usuario', JSON.stringify({
        ...user.value,
        ...data
      }))

      // Atualizar estado
      user.value = {
        ...user.value,
        ...data
      }

      $q.notify({
        type: 'positive',
        message: 'Perfil atualizado com sucesso!',
        position: 'top'
      })

      return data
    } catch (err) {
      error.value = 'Erro ao atualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePreferences = async (preferences) => {
    try {
      loading.value = true
      error.value = null

      const { data } = await api.put('/users/preferences', preferences)
      
      // Atualizar storage
      localStorage.setItem('usuario', JSON.stringify({
        ...user.value,
        configs: {
          ...user.value.configs,
          ...preferences
        }
      }))

      // Atualizar estado
      user.value = {
        ...user.value,
        configs: {
          ...user.value.configs,
          ...preferences
        }
      }

      // Atualizar tema se necessário
      if (preferences.isDark !== undefined) {
        $q.dark.set(preferences.isDark)
      }

      return data
    } catch (err) {
      error.value = 'Erro ao atualizar preferências'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('usuario')

    if (token && userData) {
      user.value = JSON.parse(userData)
      return true
    }

    return false
  }

  // Inicialização
  checkAuth()

  return {
    // Estado
    user,
    loading,
    error,

    // Computed
    isAuthenticated,
    isAdmin,
    isSupport,
    userQueues,

    // Métodos
    login,
    logout,
    updateProfile,
    updatePreferences,
    checkAuth
  }
}
