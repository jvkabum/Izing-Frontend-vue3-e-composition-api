<template>
  <div>
    <q-select
      borderless
      dense
      rounded
      v-model="userStatus"
      :options="statusOptions"
      map-options
      emit-value
      @update:model-value="updateStatus"
    >
      <template #selected>
        <div class="row full-width justify-center">
          <q-chip
            color="grey-3"
            text-color="primary"
            class="q-my-none q-ml-sm q-mr-none q-py-md"
          >
            <q-avatar
              :color="currentStatus.color"
              text-color="white"
              size="40px"
              :icon="currentStatus.icon"
              rounded
            />
            {{ currentStatus.label }}
          </q-chip>
        </div>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUser } from '../composables/useUser'

// Props
const props = defineProps({
  usuario: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:usuario'])

// Composables
const { updateUserStatus } = useUser()

// Estado
const userStatus = ref(props.usuario.status)

// Constantes
const statusOptions = [
  { 
    label: 'Online',
    value: 'online',
    icon: 'mdi-account-check',
    color: 'positive'
  },
  { 
    label: 'Offline',
    value: 'offline',
    icon: 'mdi-account-off',
    color: 'negative'
  }
]

// Computed
const currentStatus = computed(() => 
  statusOptions.find(s => s.value === userStatus.value) || {}
)

// Métodos
const updateStatus = async (status) => {
  try {
    const updatedUser = {
      ...props.usuario,
      status
    }

    // Atualizar localStorage
    localStorage.setItem('usuario', JSON.stringify(updatedUser))
    
    // Atualizar estado global do usuário
    await updateUserStatus(status)
    
    // Emitir evento para o componente pai
    emit('update:usuario', updatedUser)
    
    userStatus.value = status
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
  }
}
</script>

<style scoped>
/* Adicione estilos específicos aqui se necessário */
</style>
