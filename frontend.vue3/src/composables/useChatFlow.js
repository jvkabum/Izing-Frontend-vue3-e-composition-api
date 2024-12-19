import { ref } from 'vue'

export function useChatFlow() {
  // Estado
  const flow = ref({})
  const users = ref([])
  const queues = ref([])

  // Métodos
  const setFlowData = (data) => {
    flow.value = data.flow
    users.value = data.usuarios
    queues.value = data.filas
  }

  const resetFlowData = () => {
    flow.value = {}
    users.value = []
    queues.value = []
  }

  return {
    // Estado
    flow,
    users,
    queues,

    // Métodos
    setFlowData,
    resetFlowData
  }
}
