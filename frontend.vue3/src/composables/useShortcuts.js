import { ref, onMounted, onUnmounted } from 'vue'

export function useShortcuts() {
  const shortcuts = ref(new Map())
  const error = ref(null)

  const registerShortcut = (key, callback, description = '') => {
    try {
      shortcuts.value.set(key.toLowerCase(), {
        callback,
        description,
        active: true
      })
    } catch (err) {
      error.value = err.message
    }
  }

  const unregisterShortcut = (key) => {
    shortcuts.value.delete(key.toLowerCase())
  }

  const disableShortcut = (key) => {
    const shortcut = shortcuts.value.get(key.toLowerCase())
    if (shortcut) {
      shortcut.active = false
    }
  }

  const enableShortcut = (key) => {
    const shortcut = shortcuts.value.get(key.toLowerCase())
    if (shortcut) {
      shortcut.active = true
    }
  }

  const handleKeyDown = (event) => {
    // Ignora eventos de teclas em inputs e textareas
    if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return

    const key = event.key.toLowerCase()
    const shortcut = shortcuts.value.get(key)

    if (shortcut && shortcut.active) {
      event.preventDefault()
      shortcut.callback(event)
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    shortcuts,
    error,
    registerShortcut,
    unregisterShortcut,
    disableShortcut,
    enableShortcut
  }
} 