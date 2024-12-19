<template>
  <q-dialog
    persistent
    :model-value="modalUsuario"
    @hide="closeModal"
    @show="openModal"
  >
    <q-card style="width: 600px">
      <q-card-section>
        <div class="text-h6">{{ isEditing ? 'Editar' : 'Cadastrar' }} Usuário</div>
      </q-card-section>

      <q-card-section class="q-col-gutter-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <c-input
              outlined
              v-model.trim="usuario.name"
              :error="v$.usuario.name.$error"
              :error-message="v$.usuario.name.$errors[0]?.$message"
              @blur="v$.usuario.name.$touch"
              label="Nome"
            />
          </div>
          <div class="col-12">
            <c-input
              outlined
              v-model.trim="usuario.email"
              :error="v$.usuario.email.$error"
              :error-message="v$.usuario.email.$errors[0]?.$message"
              @blur="v$.usuario.email.$touch"
              label="E-mail"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <c-input
              outlined
              v-model="usuario.password"
              :error="v$.usuario.password.$error"
              :error-message="v$.usuario.password.$errors[0]?.$message"
              @blur="v$.usuario.password.$touch"
              :type="isPwd ? 'password' : 'text'"
              label="Senha"
            >
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </c-input>
          </div>
          <div class="col-12">
            <q-select
              :disable="isProfile"
              outlined
              rounded
              dense
              v-model="usuario.profile"
              :options="profileOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Perfil"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          rounded
          label="Sair"
          class="q-px-md q-mr-sm"
          color="negative"
          v-close-popup
        />
        <q-btn
          rounded
          label="Salvar"
          class="q-px-md"
          color="primary"
          :loading="loading"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength } from '@vuelidate/validators'
import { useQuasar } from 'quasar'
import { useUser } from '../../composables/useUser'

// Props
const props = defineProps({
  modalUsuario: {
    type: Boolean,
    default: false
  },
  isProfile: {
    type: Boolean,
    default: false
  },
  usuarioEdicao: {
    type: Object,
    default: () => ({ id: null })
  }
})

// Emits
const emit = defineEmits([
  'update:modalUsuario',
  'update:usuarioEdicao',
  'modalUsuario:usuario-criado',
  'modalUsuario:usuario-editado'
])

// Composables
const $q = useQuasar()
const { createUser, updateUser, isAdmin } = useUser()

// Estado
const isPwd = ref(false)
const loading = ref(false)

const usuario = reactive({
  name: '',
  email: '',
  password: '',
  profile: 'user'
})

// Computed
const isEditing = computed(() => Boolean(usuario.id))

const profileOptions = [
  { value: 'user', label: 'Usuário' },
  { value: 'admin', label: 'Administrador' }
]

// Validações
const rules = computed(() => {
  const baseRules = {
    name: { 
      required, 
      minLength: minLength(3), 
      maxLength: maxLength(50) 
    },
    email: { required, email },
    profile: { required },
    password: {}
  }

  if (!usuario.id) {
    baseRules.password = { 
      required, 
      minLength: minLength(6), 
      maxLength: maxLength(50) 
    }
  }

  return { usuario: baseRules }
})

const v$ = useVuelidate(rules, { usuario })

// Métodos
const openModal = () => {
  if (props.usuarioEdicao.id || props.usuarioEdicao.userId) {
    const userData = props.usuarioEdicao.userId ? {
      ...props.usuarioEdicao,
      id: props.usuarioEdicao.userId,
      name: props.usuarioEdicao.username,
      profile: props.usuarioEdicao.profile
    } : { ...props.usuarioEdicao }

    Object.assign(usuario, userData)
  }
}

const closeModal = () => {
  if (!props.isProfile) {
    emit('update:usuarioEdicao', {})
  }
  emit('update:modalUsuario', false)
  
  // Reset form
  Object.assign(usuario, {
    name: '',
    email: '',
    password: '',
    profile: 'user'
  })
  
  isPwd.value = false
  v$.value.$reset()
}

const handleSubmit = async () => {
  try {
    loading.value = true
    const isValid = await v$.value.$validate()
    if (!isValid) {
      $q.notify({
        type: 'warning',
        message: 'Ops! Verifique os erros...',
        position: 'top'
      })
      return
    }

    if (usuario.id) {
      const params = {
        email: usuario.email,
        id: usuario.id,
        name: usuario.name,
        tenantId: usuario.tenantId,
        password: usuario.password
      }

      if (isAdmin) {
        params.profile = usuario.profile
      }

      const data = await updateUser(usuario.id, params)
      emit('modalUsuario:usuario-editado', data)
      
      $q.notify({
        type: 'info',
        message: 'Usuário editado!',
        position: 'top'
      })
    } else {
      const data = await createUser(usuario)
      emit('modalUsuario:usuario-criado', data)
      
      $q.notify({
        type: 'positive',
        message: 'Usuário criado!',
        position: 'top'
      })
    }

    emit('update:modalUsuario', false)
  } catch (error) {
    if (error.data?.error === 'ERR_USER_LIMIT_USER_CREATION') {
      $q.notify({
        type: 'negative',
        message: 'Limite de usuário atingido.',
        caption: 'ERR_USER_LIMIT_USER_CREATION',
        position: 'top'
      })
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erro ao salvar usuário',
        position: 'top'
      })
    }
    console.error('Erro ao salvar usuário:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
/* Adicione estilos específicos aqui se necessário */
</style>
