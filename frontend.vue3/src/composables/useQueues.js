import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'

export function useQueues() {
  const queues = ref([])
  const loading = ref(false)
  const error = ref(null)
  const userQueues = ref(JSON.parse(localStorage.getItem('queues') || '[]'))

  const fetchQueues = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/queues')
      queues.value = data
      localStorage.setItem('queues', JSON.stringify(data))
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar filas:', err)
    } finally {
      loading.value = false
    }
  }

  const activeQueues = computed(() => 
    queues.value.filter(q => q.active)
  )

  const userActiveQueues = computed(() => 
    queues.value.filter(q => 
      userQueues.value.some(uq => uq.id === q.id && uq.active)
    )
  )

  const updateQueue = async (id, queueData) => {
    loading.value = true
    try {
      const { data } = await api.put(`/queues/${id}`, queueData)
      const index = queues.value.findIndex(q => q.id === id)
      if (index !== -1) {
        queues.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchQueues)

  return {
    queues,
    loading,
    error,
    activeQueues,
    userActiveQueues,
    fetchQueues,
    updateQueue
  }
} 