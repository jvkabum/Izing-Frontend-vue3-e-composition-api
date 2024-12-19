import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

export function useTheme() {
  const q = useQuasar()
  const currentTheme = ref(localStorage.getItem('theme') || 'light')
  const loading = ref(false)
  const error = ref(null)

  // Observa mudanças no tema e salva no localStorage
  watch(currentTheme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  })

  const themes = {
    light: {
      primary: '#1976D2',
      secondary: '#26A69A',
      accent: '#9C27B0',
      dark: '#1D1D1D',
      background: '#F5F5F5'
    },
    dark: {
      primary: '#2196F3',
      secondary: '#26A69A',
      accent: '#9C27B0',
      dark: '#121212',
      background: '#1D1D1D'
    }
  }

  const applyTheme = (theme) => {
    try {
      q.dark.set(theme === 'dark')
      
      // Aplica as cores do tema
      Object.entries(themes[theme]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--q-${key}`, value)
      })
    } catch (err) {
      error.value = err.message
    }
  }

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (theme) => {
    if (!themes[theme]) {
      error.value = 'Tema inválido'
      return
    }
    currentTheme.value = theme
  }

  // Aplica o tema inicial
  applyTheme(currentTheme.value)

  return {
    currentTheme,
    loading,
    error,
    themes,
    toggleTheme,
    setTheme
  }
} 