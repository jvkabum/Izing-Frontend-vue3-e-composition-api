import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useChatStore = defineStore('chat', () => {
  // Estado
  const messages = ref([])
  const currentTicket = ref(null)
  const loading = ref(false)
  const hasMore = ref(true)

  // Getters
  const sortedMessages = computed(() => {
    return [...messages.value].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    )
  })

  // Actions
  const fetchMessages = async (ticketId) => {
    try {
      loading.value = true
      const { data } = await api.get(`/messages/${ticketId}`)
      messages.value = data
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (ticketId, message) => {
    try {
      loading.value = true
      await api.post(`/messages/${ticketId}`, message)
      await fetchMessages(ticketId)
    } finally {
      loading.value = false
    }
  }

  const setCurrentTicket = (ticket) => {
    currentTicket.value = ticket
  }

  return {
    // Estado
    messages,
    currentTicket,
    loading,
    hasMore,

    // Getters
    sortedMessages,

    // Actions
    fetchMessages,
    sendMessage,
    setCurrentTicket
  }
}) 