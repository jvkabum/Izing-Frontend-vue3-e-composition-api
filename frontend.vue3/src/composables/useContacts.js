import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

export function useContacts() {
  const contacts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchContacts = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/contacts', { params })
      contacts.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar contatos:', err)
    } finally {
      loading.value = false
    }
  }

  const updateContact = async (id, contactData) => {
    loading.value = true
    try {
      const { data } = await api.put(`/contacts/${id}`, contactData)
      const index = contacts.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contacts.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteContact = async (id) => {
    loading.value = true
    try {
      await api.delete(`/contacts/${id}`)
      contacts.value = contacts.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchContacts)

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    updateContact,
    deleteContact
  }
} 