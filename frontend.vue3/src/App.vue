<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUser } from './composables/useUser'

const $q = useQuasar()
const router = useRouter()
const { userData } = useUser()

// Estado
const IDLE_TIMEOUT = ref(5) // seconds
const idleSecondsCounter = ref(0)
let idleInterval = null

// Métodos
const checkIdleTime = () => {
  idleSecondsCounter.value++
  if (idleSecondsCounter.value >= IDLE_TIMEOUT.value) {
    alert('Time expired!')
    // Você pode adicionar aqui a lógica de logout
    // router.push('/logout')
  }
}

const resetIdleCounter = () => {
  idleSecondsCounter.value = 0
}

// Lifecycle Hooks
onBeforeMount(() => {
  // Configurar tema escuro baseado nas preferências do usuário
  if (userData.value?.configs?.isDark) {
    $q.dark.set(userData.value.configs.isDark)
  }
})

onMounted(() => {
  // Configurar listeners para resetar o contador
  document.addEventListener('click', resetIdleCounter)
  document.addEventListener('mousemove', resetIdleCounter)
  document.addEventListener('keypress', resetIdleCounter)
  
  // Iniciar intervalo de verificação
  idleInterval = window.setInterval(checkIdleTime, 1000)
})

onUnmounted(() => {
  // Limpar listeners e intervalo
  document.removeEventListener('click', resetIdleCounter)
  document.removeEventListener('mousemove', resetIdleCounter)
  document.removeEventListener('keypress', resetIdleCounter)
  
  if (idleInterval) {
    clearInterval(idleInterval)
  }
})
</script>

<style>
/* Adicione estilos globais aqui se necessário */
</style>
