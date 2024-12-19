import { ref, onMounted, onUnmounted } from 'vue'
import { api } from '@/services/api'

export function useSettings() {
  const settings = ref({})
  const loading = ref(false)
  const error = ref(null)
  const shortcuts = ref(new Map())
  const greetings = ref({
    welcome: '',
    goodbye: '',
    away: ''
  })

  const fetchSettings = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/settings')
      settings.value = data
      greetings.value = data.greetings || {}
      localStorage.setItem('settings', JSON.stringify(data))
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar configurações:', err)
    } finally {
      loading.value = false
    }
  }

  const updateSettings = async (settingsData) => {
    loading.value = true
    try {
      const { data } = await api.put('/settings', settingsData)
      settings.value = data
      localStorage.setItem('settings', JSON.stringify(data))
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSetting = (key, defaultValue = null) => {
    return settings.value[key] ?? defaultValue
  }

  const setSetting = async (key, value) => {
    const updatedSettings = {
      ...settings.value,
      [key]: value
    }
    await updateSettings(updatedSettings)
  }

  const registerShortcut = (key, callback) => {
    shortcuts.value.set(key.toLowerCase(), {
      callback,
      active: true
    })
  }

  const handleKeyDown = (event) => {
    if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return

    const key = event.key.toLowerCase()
    const shortcut = shortcuts.value.get(key)

    if (shortcut?.active) {
      event.preventDefault()
      shortcut.callback(event)
    }
  }

  const updateGreeting = async (type, message) => {
    loading.value = true
    try {
      const { data } = await api.put(`/settings/greetings/${type}`, { message })
      greetings.value[type] = data.message
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchSettings)
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    getSetting,
    setSetting,
    registerShortcut,
    shortcuts,
    greetings,
    updateGreeting
  }
} 