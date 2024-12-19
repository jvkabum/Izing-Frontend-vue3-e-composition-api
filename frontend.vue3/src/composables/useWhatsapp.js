import { ref, computed } from 'vue'
import { api } from '@/services/api'

export function useWhatsapp() {
  const connections = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchConnections = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/whatsapp')
      connections.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar conexões:', err)
    } finally {
      loading.value = false
    }
  }

  const activeConnections = computed(() => 
    connections.value.filter(c => c.status === 'CONNECTED')
  )

  const hasActiveConnection = computed(() => 
    activeConnections.value.length > 0
  )

  const updateConnection = async (id, status) => {
    try {
      await api.put(`/whatsapp/${id}`, { status })
      await fetchConnections()
    } catch (err) {
      error.value = err.message
      console.error('Erro ao atualizar conexão:', err)
    }
  }

  return {
    connections,
    loading,
    error,
    activeConnections,
    hasActiveConnection,
    fetchConnections,
    updateConnection
  }
} 