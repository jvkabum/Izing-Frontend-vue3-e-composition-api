import { ref } from 'vue'
import { api } from '../services/api'
import { useNotification } from './useNotification'
import { useSocket } from './useSocket'

export function useWhatsapp() {
  // Estado
  const whatsApps = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Composables
  const { notify } = useNotification()
  const { socket } = useSocket()

  // Métodos
  const fetchWhatsApps = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/whatsapp')
      whatsApps.value = data
      return data
    } catch (err) {
      error.value = err.message
      notify({
        type: 'negative',
        message: 'Erro ao buscar conexões WhatsApp',
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWhatsApp = (whatsApp) => {
    const whatsAppIndex = whatsApps.value.findIndex(w => w.id === whatsApp.id)
    if (whatsAppIndex !== -1) {
      whatsApps.value[whatsAppIndex] = whatsApp
    } else {
      whatsApps.value = [whatsApp, ...whatsApps.value]
    }
  }

  const updateSession = (sessionData) => {
    const whatsAppIndex = whatsApps.value.findIndex(w => w.id === sessionData.id)
    if (whatsAppIndex !== -1) {
      whatsApps.value[whatsAppIndex] = {
        ...whatsApps.value[whatsAppIndex],
        status: sessionData.status,
        updatedAt: sessionData.updatedAt,
        qrcode: sessionData.qrcode,
        retries: sessionData.retries
      }
    }
  }

  const deleteWhatsApp = async (whatsAppId) => {
    loading.value = true
    try {
      await api.delete(`/whatsapp/${whatsAppId}`)
      whatsApps.value = whatsApps.value.filter(w => w.id !== whatsAppId)
      notify({
        type: 'positive',
        message: 'Conexão WhatsApp removida com sucesso',
        position: 'top'
      })
    } catch (err) {
      error.value = err.message
      notify({
        type: 'negative',
        message: 'Erro ao remover conexão WhatsApp',
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  const createWhatsApp = async (whatsAppData) => {
    loading.value = true
    try {
      const { data } = await api.post('/whatsapp', whatsAppData)
      whatsApps.value = [data, ...whatsApps.value]
      notify({
        type: 'positive',
        message: 'Conexão WhatsApp criada com sucesso',
        position: 'top'
      })
      return data
    } catch (err) {
      error.value = err.message
      notify({
        type: 'negative',
        message: 'Erro ao criar conexão WhatsApp',
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetWhatsApps = () => {
    whatsApps.value = []
    error.value = null
  }

  // Socket listeners para atualizações em tempo real
  socket.value?.on('whatsapp:update', (data) => {
    updateWhatsApp(data)
  })

  socket.value?.on('whatsapp:session', (data) => {
    updateSession(data)
  })

  return {
    // Estado
    whatsApps,
    loading,
    error,

    // Métodos
    fetchWhatsApps,
    updateWhatsApp,
    updateSession,
    deleteWhatsApp,
    createWhatsApp,
    resetWhatsApps
  }
}
