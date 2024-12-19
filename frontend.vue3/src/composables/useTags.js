import { ref, computed } from 'vue'
import { api } from '@/services/api'

export function useTags() {
  const tags = ref([])
  const selectedTags = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchTags = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/tags')
      tags.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar tags:', err)
    } finally {
      loading.value = false
    }
  }

  const createTag = async (tagData) => {
    loading.value = true
    try {
      const { data } = await api.post('/tags', tagData)
      tags.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTag = async (id, tagData) => {
    loading.value = true
    try {
      const { data } = await api.put(`/tags/${id}`, tagData)
      const index = tags.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tags.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTag = async (id) => {
    loading.value = true
    try {
      await api.delete(`/tags/${id}`)
      tags.value = tags.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleTag = (tag) => {
    const index = selectedTags.value.findIndex(t => t.id === tag.id)
    if (index === -1) {
      selectedTags.value.push(tag)
    } else {
      selectedTags.value.splice(index, 1)
    }
  }

  const isTagSelected = computed(() => (tag) => 
    selectedTags.value.some(t => t.id === tag.id)
  )

  return {
    tags,
    selectedTags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    toggleTag,
    isTagSelected
  }
} 