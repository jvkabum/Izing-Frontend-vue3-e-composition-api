<template>
  <div class="input-mensagem">
    <q-input
      v-model="message"
      type="textarea"
      rows="1"
      outlined
      dense
      placeholder="Digite uma mensagem..."
      @keypress.enter.prevent="handleSend"
    >
      <template #append>
        <q-btn
          round
          flat
          color="primary"
          icon="send"
          :loading="loading"
          @click="handleSend"
        />
      </template>

      <template #before>
        <q-btn-group flat>
          <q-btn
            round
            flat
            icon="attach_file"
            @click="$refs.fileInput.click()"
          />
          <q-btn
            round
            flat
            icon="mic"
            :color="isRecording ? 'negative' : 'grey'"
            @click="toggleRecording"
          />
        </q-btn-group>
        <input
          ref="fileInput"
          type="file"
          hidden
          @change="handleFileUpload"
        >
      </template>
    </q-input>

    <div v-if="replyingMessage" class="reply-preview">
      <div class="reply-content">
        <div class="reply-header">
          <span class="text-weight-bold">
            {{ replyingMessage.fromMe ? 'Você' : replyingMessage.contact?.name }}
          </span>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="$emit('cancel-reply')"
          />
        </div>
        <div class="reply-text">{{ replyingMessage.body }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAudio } from '@/composables/useAudio'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  replyingMessage: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'send', 'cancel-reply'])

const message = ref(props.modelValue)
const loading = ref(false)
const { isRecording, startRecording, stopRecording } = useAudio()

watch(message, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleSend = async () => {
  if (!message.value.trim()) return
  
  loading.value = true
  try {
    await emit('send')
    message.value = ''
  } finally {
    loading.value = false
  }
}

const toggleRecording = async () => {
  if (isRecording.value) {
    const audio = await stopRecording()
    // Emitir áudio
  } else {
    await startRecording()
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Emitir arquivo
}
</script>

<style lang="scss" scoped>
.input-mensagem {
  padding: 8px;
  border-top: 1px solid #ddd;
}

.reply-preview {
  margin-top: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;

  .reply-content {
    padding: 8px;
    border-left: 4px solid #1976d2;
  }

  .reply-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .reply-text {
    color: #666;
    font-size: 0.9em;
  }
}
</style> 