<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <h3>{{ title }}</h3>
      <p>{{ error.message }}</p>
      <div class="actions">
        <q-btn 
          color="primary"
          label="Tentar Novamente"
          @click="retry"
        />
        <q-btn 
          flat
          color="grey"
          label="Voltar"
          @click="goBack"
        />
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorHandler } from '@/composables/core/useErrorHandler'

const props = defineProps({
  title: {
    type: String,
    default: 'Ops! Algo deu errado.'
  }
})

const router = useRouter()
const errorHandler = useErrorHandler()
const error = ref(null)

const retry = () => {
  error.value = null
}

const goBack = () => {
  router.back()
}

onErrorCaptured((err, vm, info) => {
  error.value = err
  errorHandler.handleError(err, `ErrorBoundary: ${info}`)
  return false // Impede propagação
})
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 20px;
}

.error-content {
  text-align: center;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style> 