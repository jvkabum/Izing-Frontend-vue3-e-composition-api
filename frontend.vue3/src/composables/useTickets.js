import { ref, computed } from 'vue'
import { api } from '@/services/api'

export function useTickets() {
  const tickets = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const hasMore = ref(true)

  const filterParams = ref({
    searchParam: '',
    status: ['open', 'pending', 'closed'],
    showAll: false,
    queuesIds: [],
    withUnreadMessages: false,
    isNotAssignedUser: false,
    includeNotQueueDefined: true
  })

  const fetchTickets = async (params = {}) => {
    if (loading.value) return

    loading.value = true
    try {
      const { data } = await api.get('/tickets', {
        params: {
          ...filterParams.value,
          pageNumber: currentPage.value,
          ...params
        }
      })

      if (currentPage.value === 1) {
        tickets.value = data.tickets
      } else {
        tickets.value = [...tickets.value, ...data.tickets]
      }

      hasMore.value = data.hasMore
      currentPage.value++
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar tickets:', err)
    } finally {
      loading.value = false
    }
  }

  const updateTicket = async (id, ticketData) => {
    loading.value = true
    try {
      const { data } = await api.put(`/tickets/${id}`, ticketData)
      const index = tickets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tickets.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTicket = async (id) => {
    loading.value = true
    try {
      await api.delete(`/tickets/${id}`)
      tickets.value = tickets.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFilter = (newParams) => {
    filterParams.value = {
      ...filterParams.value,
      ...newParams
    }
    currentPage.value = 1
    fetchTickets()
  }

  const groupedTickets = computed(() => {
    return {
      open: tickets.value.filter(t => t.status === 'open' && !t.isGroup),
      pending: tickets.value.filter(t => t.status === 'pending' && !t.isGroup),
      closed: tickets.value.filter(t => t.status === 'closed' && !t.isGroup),
      groups: tickets.value.filter(t => t.isGroup)
    }
  })

  return {
    tickets,
    loading,
    error,
    hasMore,
    currentPage,
    filterParams,
    groupedTickets,
    fetchTickets,
    updateTicket,
    deleteTicket,
    updateFilter
  }
} 