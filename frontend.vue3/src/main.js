import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useStore } from '@/composables/core/useStore'
import { useErrorHandler } from '@/composables/core/useErrorHandler'
import { useOffline } from '@/composables/core/useOffline'

const app = createApp(App)

// Inicializa store
const store = useStore()
await store.initializeStore()
app.provide('store', store)

// Registra error handler global
const errorHandler = useErrorHandler()
app.config.errorHandler = (err, vm, info) => {
  errorHandler.handleError(err, `Vue Error Handler: ${info}`)
}

// Monitora estado offline
const { isOffline } = useOffline()
app.provide('isOffline', isOffline)

app.mount('#app') 