<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="contact-info">
        <span>{{ contact?.name }}</span>
      </div>
      <div class="ticket-status">
        {{ status }}
      </div>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" class="message">
        <div :class="['message-content', message.fromMe ? 'sent' : 'received']">
          {{ message.body }}
          <span class="message-time">{{ formatMessageDate(message.createdAt) }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <q-input
        v-model="newMessage"
        placeholder="Digite uma mensagem..."
        @keyup.enter="handleSendMessage"
      >
        <template #append>
          <q-btn round dense flat icon="send" @click="handleSendMessage" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { useMessages } from 'src/composables/useMessages'
import { useTicketStatus } from 'src/composables/useTicketStatus'

// Props
const props = defineProps({
  ticketId: {
    type: String,
    required: true
  },
  contact: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['message-sent', 'status-change'])

// Estado local
const newMessage = ref('')
const loading = ref(false)

// Composables
const { messages, sendMessage, fetchMessages } = useMessages(props.ticketId)
const { status, updateStatus } = useTicketStatus(props.ticketId)

// Socket setup
const socket = inject('socket')
watch(() => props.ticketId, (newId) => {
  if (newId) {
    socket.on(`ticket:${newId}`, fetchMessages)
  }
  return () => {
    socket.off(`ticket:${newId}`, fetchMessages)
  }
}, { immediate: true })

// Métodos
const formatMessageDate = (date) => {
  return format(new Date(date), 'HH:mm')
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim()) return

  loading.value = true
  try {
    await sendMessage({ body: newMessage.value })
    newMessage.value = ''
    emit('message-sent')
  } finally {
    loading.value = false
  }
}

const handleStatusChange = async (newStatus) => {
  const success = await updateStatus(newStatus)
  if (success) {
    emit('status-change', newStatus)
  }
}

// Observar mudanças no ticketId
watch(() => props.ticketId, () => {
  if (props.ticketId) {
    fetchMessages()
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin-bottom: 0.5rem;
  
  &-content {
    padding: 0.5rem;
    border-radius: 8px;
    max-width: 70%;
    
    &.sent {
      background: $primary;
      color: white;
      margin-left: auto;
    }
    
    &.received {
      background: #f5f5f5;
    }
  }

  &-time {
    font-size: 0.8rem;
    opacity: 0.7;
    margin-left: 0.5rem;
  }
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid #eee;
}
</style> 