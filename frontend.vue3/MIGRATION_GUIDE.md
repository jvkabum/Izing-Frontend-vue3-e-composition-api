# Guia de Migração para Vue 3 + Composition API

## Principais Mudanças

1. **Setup Script**
```vue
<script setup>
// Código aqui é executado no setup()
// Não precisa return
</script>
```

2. **Reatividade**
```js
import { ref, computed } from 'vue'

// Antes (Vue 2)
data() {
  return {
    count: 0
  }
}

// Agora (Vue 3)
const count = ref(0)
```

3. **Props e Emits**
```js
// Props
const props = defineProps({
  message: String
})

// Emits
const emit = defineEmits(['update', 'delete'])
```

4. **Computed**
```js
// Antes
computed: {
  doubleCount() {
    return this.count * 2
  }
}

// Agora
const doubleCount = computed(() => count.value * 2)
```

5. **Methods**
```js
// Antes
methods: {
  increment() {
    this.count++
  }
}

// Agora
const increment = () => {
  count.value++
}
```

## Exemplo de Migração

### Vue 2 (Options API)
```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

### Vue 3 (Composition API)
```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
const increment = () => count.value++
</script>
``` 