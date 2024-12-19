import { ref } from 'vue'
import { api } from '../services/api'
import { useNotification } from './useNotification'

export function useContacts() {
  const contacts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { notify } = useNotification()

  const loadContacts = async (newContacts = []) => {
    try {
      // Atualiza contatos existentes e adiciona novos
      const updatedContacts = [...contacts.value]
      const newContactsList = []

      newContacts.forEach(contact => {
        const contactIndex = updatedContacts.findIndex(c => c.id === contact.id)
        if (contactIndex !== -1) {
          updatedContacts[contactIndex] = contact
        } else {
          newContactsList.push(contact)
        }
      })

      contacts.value = [...updatedContacts, ...newContactsList]
    } catch (err) {
      error.value = err.message
      notify({
        type: 'negative',
        message: 'Erro ao carregar contatos',
        position: 'top'
      })
    }
  }

  const fetchContacts = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/contacts', { params })
      await loadContacts(data)
      return data
    } catch (err) {
      error.value = err.message
      notify({
        type: 'negative',
        message: 'Erro ao buscar contatos',
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateContact = async (contactData) => {
    loading.value = true
    try {
      const { data } = await api.put(`/contacts/${contactData.id}`, contactData)
      const contactIndex = contacts.value.findIndex(c => c.id === contactData.id)
      
      if (contactIndex !== -1) {
        contacts.value[contactIndex] = data
      } else {
        contacts.value.unshift(data)
      }
      
      return data
    } catch (err) {
      error.value = err.message
      notify({
        type: 'negative',
        message: 'Erro ao atualizar contato',
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteContact = async (contactId) => {
    loading.value = true
    try {
      await api.delete(`/contacts/${contactId}`)
      const contactIndex = contacts.value.findIndex(c => c.id === contactId)
      if (contactIndex !== -1) {
        contacts.value.splice(contactIndex, 1)
      }
    } catch (err) {
      error.value = err.message
      notify({
        type: 'negative',
        message: 'Erro ao excluir contato',
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetContacts = () => {
    contacts.value = []
    error.value = null
  }

  return {
    // Estado
    contacts,
    loading,
    error,

    // Métodos
    loadContacts,
    fetchContacts,
    updateContact,
    deleteContact,
    resetContacts
  }
}
