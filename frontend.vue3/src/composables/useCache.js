import { ref } from 'vue'

export function useCache() {
  const cache = ref(new Map())
  const error = ref(null)

  const set = (key, value, ttl = 0) => {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl
      }
      cache.value.set(key, item)
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const get = (key) => {
    try {
      const item = cache.value.get(key)
      if (!item) return null

      if (item.ttl > 0) {
        const age = Date.now() - item.timestamp
        if (age > item.ttl) {
          cache.value.delete(key)
          return null
        }
      }

      return item.value
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const remove = (key) => {
    try {
      return cache.value.delete(key)
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const clear = () => {
    try {
      cache.value.clear()
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const has = (key) => {
    return cache.value.has(key)
  }

  return {
    error,
    set,
    get,
    remove,
    clear,
    has
  }
} 