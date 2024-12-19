import { ref } from 'vue'
import { format } from 'date-fns'
import alertSound from '@/assets/sound.mp3'

export function useNotification() {
  const audio = ref(new Audio(alertSound))
  const permission = ref(Notification.permission)

  const requestPermission = async () => {
    if (!('Notification' in window)) return false
    
    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    } catch (err) {
      console.error('Erro ao solicitar permissão:', err)
      return false
    }
  }

  const showNotification = async (message) => {
    try {
      // Tocar som
      await audio.value.play()
      
      // Mostrar notificação do sistema
      if (permission.value === 'granted') {
        const notification = new Notification(
          `Mensagem de ${message.contact.name}`,
          {
            body: `${message.body} - ${format(new Date(), 'HH:mm')}`,
            icon: message.contact.profilePicUrl,
            tag: message.ticketId,
            renotify: true
          }
        )

        notification.onclick = () => {
          window.focus()
          // Navegar para o chat
        }

        setTimeout(() => notification.close(), 10000)
      }
    } catch (err) {
      console.error('Erro ao mostrar notificação:', err)
    }
  }

  return {
    permission,
    requestPermission,
    showNotification
  }
} 