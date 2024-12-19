import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

export function useSettings() {
  const settings = ref({})
  const loading = ref(false)
  const error = ref(null)

  const fetchSettings = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/settings')
      settings.value = data
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

  onMounted(fetchSettings)

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    getSetting,
    setSetting
  }
} 