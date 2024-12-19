import { ref } from 'vue'
import { api } from '@/services/api'

export function useQuickReplies() {
  const quickReplies = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchQuickReplies = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/quick-replies')
      quickReplies.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createQuickReply = async (replyData) => {
    loading.value = true
    try {
      const { data } = await api.post('/quick-replies', replyData)
      quickReplies.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateQuickReply = async (id, replyData) => {
    loading.value = true
    try {
      const { data } = await api.put(`/quick-replies/${id}`, replyData)
      const index = quickReplies.value.findIndex(r => r.id === id)
      if (index !== -1) {
        quickReplies.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteQuickReply = async (id) => {
    loading.value = true
    try {
      await api.delete(`/quick-replies/${id}`)
      quickReplies.value = quickReplies.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    quickReplies,
    loading,
    error,
    fetchQuickReplies,
    createQuickReply,
    updateQuickReply,
    deleteQuickReply
  }
} 