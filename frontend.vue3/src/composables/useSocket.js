import { onMounted, onUnmounted } from 'vue'
import io from 'socket.io-client'

export function useSocket() {
  const socket = io(process.env.VUE_URL_API, {
    transports: ['websocket'],
    upgrade: false
  })

  const setupSocket = () => {
    socket.on('connect', () => {
      console.log('Socket conectado')
    })

    socket.on('disconnect', () => {
      console.log('Socket desconectado')
    })
  }

  onMounted(setupSocket)
  onUnmounted(() => socket.disconnect())

  return {
    socket
  }
} 