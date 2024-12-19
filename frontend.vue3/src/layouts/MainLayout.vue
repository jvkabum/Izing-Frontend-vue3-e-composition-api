<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-white text-grey-8 q-py-xs" height-hint="58" bordered>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        >
          <q-tooltip>Menu</q-tooltip>
        </q-btn>

        <q-btn flat no-caps no-wrap dense class="q-ml-sm" v-if="$q.screen.gt.xs">
          <q-img
            src="/logo.png"
            spinner-color="primary"
            style="height: 50px; width: 140px"
          />
        </q-btn>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <div v-if="userProfile === 'admin' || userProfile === 'user'">
            <q-btn round dense flat color="grey-8" icon="notifications">
              <q-badge
                color="red"
                text-color="white"
                floating
                v-if="totalNotifications > 0"
              >
                {{ totalNotifications }}
              </q-badge>
              <q-menu>
                <q-list style="min-width: 300px">
                  <q-item v-if="totalNotifications === 0">
                    <q-item-section>Nada de novo por aqui!</q-item-section>
                  </q-item>
                  
                  <q-item v-if="pendingNotificationsCount > 0">
                    <q-item-section
                      avatar
                      @click="router.push({ name: 'atendimento' })"
                      style="cursor: pointer"
                    >
                      <q-avatar
                        style="width: 60px; height: 60px"
                        color="blue"
                        text-color="white"
                      >
                        {{ pendingNotificationsCount }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      @click="router.push({ name: 'atendimento' })"
                      style="cursor: pointer"
                    >
                      Clientes pendentes na fila
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-for="ticket in notifications"
                    :key="ticket.id"
                    style="border-bottom: 1px solid #ddd; margin: 5px"
                  >
                    <q-item-section
                      avatar
                      @click="openExistingTicket(ticket.name, ticket)"
                      style="cursor: pointer"
                    >
                      <q-avatar style="width: 60px; height: 60px">
                        <img :src="ticket.profilePicUrl" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      @click="openExistingTicket(ticket.name, ticket)"
                      style="cursor: pointer"
                    >
                      <q-list>
                        <q-item style="text-align:center; font-size: 17px; font-weight: bold; min-height: 0">
                          {{ ticket.name }}
                        </q-item>
                        <q-item style="min-height: 0; padding-top: 0">
                          <b>Mensagem: </b> {{ ticket.lastMessage }}
                        </q-item>
                      </q-list>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-tooltip>Notificações</q-tooltip>
            </q-btn>

            <q-toggle
              size="xl"
              keep-color
              dense
              class="text-bold q-ml-xs"
              :icon-color="$q.dark.isActive ? 'black' : 'white'"
              :model-value="$q.dark.isActive"
              :color="$q.dark.isActive ? 'grey-3' : 'black'"
              checked-icon="mdi-white-balance-sunny"
              unchecked-icon="mdi-weather-sunny"
              @update:model-value="toggleDarkMode"
            >
              <q-tooltip content-class="text-body1 hide-scrollbar">
                {{ $q.dark.isActive ? 'Desativar' : 'Ativar' }} Modo Escuro
              </q-tooltip>
            </q-toggle>

            <q-avatar
              :color="userStatus === 'offline' ? 'negative' : 'positive'"
              text-color="white"
              size="25px"
              :icon="userStatus === 'offline' ? 'mdi-account-off' : 'mdi-account-check'"
              rounded
              class="q-ml-lg"
            >
              <q-tooltip>
                {{ userStatus === 'offline' ? 'Usuário Offline' : 'Usuário Online' }}
              </q-tooltip>
            </q-avatar>
          </div>

          <q-btn round flat class="bg-padrao text-bold q-mx-sm q-ml-lg">
            <q-avatar size="26px">
              {{ getInitials(username) }}
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item-label header>
                  Olá! <b>{{ username }}</b>
                </q-item-label>

                <c-status-usuario
                  @update:usuario="updateUser"
                  :usuario="userData"
                />

                <q-item clickable v-close-popup @click="openUserModal">
                  <q-item-section>Perfil</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section>Sair</q-item-section>
                </q-item>

                <q-separator />
                
                <q-item>
                  <q-item-section>
                    <c-system-version />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-tooltip>Usuário</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      content-class="bg-white text-grey-9"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <div v-if="userProfile === 'admin' || userProfile === 'user'">
            <essential-link
              v-for="item in menuData"
              :key="item.title"
              v-bind="item"
            />
          </div>
          
          <div v-if="userProfile === 'admin'">
            <q-separator spaced />
            <div class="q-mb-lg"></div>
            <essential-link
              v-for="item in menuDataAdmin"
              :key="item.title"
              v-bind="item"
              v-if="showBetaMenu(item)"
            />
          </div>
          
          <div v-if="userProfile === 'super'">
            <div class="q-mb-lg"></div>
            <essential-link
              v-for="item in menuDataSuper"
              :key="item.title"
              v-bind="item"
              v-if="showBetaMenu(item)"
            />
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-xs">
        <router-view />
      </q-page>
    </q-page-container>

    <audio ref="audioNotification" v-if="userProfile === 'admin' || userProfile === 'user'">
      <source :src="alertSound" type="audio/mp3" />
    </audio>

    <modal-usuario
      :is-profile="true"
      v-model:modal-usuario="modalUsuario"
      v-model:usuario-edicao="userData"
    />
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { format } from 'date-fns'
import { useSocket } from '../composables/useSocket'
import { useUser } from '../composables/useUser'
import { useNotifications } from '../composables/useNotifications'
import { useWhatsapp } from '../composables/useWhatsapp'
import EssentialLink from '../components/EssentialLink.vue'
import CSystemVersion from '../components/cSystemVersion.vue'
import CStatusUsuario from '../components/cStatusUsuario.vue'
import ModalUsuario from '../pages/usuarios/ModalUsuario.vue'
import alertSound from '../assets/sound.mp3'
import { menuData, menuDataAdmin, menuDataSuper } from '../config/menu'

// Composables
const router = useRouter()
const $q = useQuasar()
const { socket } = useSocket()
const { userData, userProfile, username, logout, updateUserPreferences } = useUser()
const { notifications, pendingNotifications, fetchNotifications } = useNotifications()
const { whatsapps, fetchWhatsApps } = useWhatsapp()

// Estado
const leftDrawerOpen = ref(false)
const miniState = ref(true)
const modalUsuario = ref(false)
const audioNotification = ref(null)

// Computed
const totalNotifications = computed(() => 
  notifications.value.length + pendingNotifications.value.length
)

const pendingNotificationsCount = computed(() => 
  pendingNotifications.value.length
)

const userStatus = computed(() => 
  userData.value?.status || 'offline'
)

const connectionProblem = computed(() => {
  return whatsapps.value.some(w => 
    ['PAIRING', 'TIMEOUT', 'DISCONNECTED'].includes(w.status)
  )
})

// Métodos
const toggleDarkMode = (value) => {
  updateUserPreferences({ isDark: value })
  $q.dark.set(value)
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const showBetaMenu = (item) => {
  if (!item?.isBeta) return true
  const experimentalDomains = ['@']
  return experimentalDomains.some(domain => 
    userData.value?.email?.includes(domain)
  )
}

const handleNotification = (data) => {
  const { message, contact, ticket } = data

  const notification = new Notification(
    `Mensagem de ${contact.name}`,
    {
      body: `${message.body} - ${format(new Date(), 'HH:mm')}`,
      icon: contact.profilePicUrl,
      tag: ticket.id,
      renotify: true
    }
  )

  notification.onclick = () => {
    window.focus()
    router.push({ name: 'atendimento' })
  }

  audioNotification.value?.play()
}

const openUserModal = () => {
  modalUsuario.value = true
}

const handleLogout = async () => {
  try {
    await logout()
    router.push({ name: 'login' })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao realizar logout',
      position: 'top'
    })
  }
}

const updateUser = () => {
  const status = userData.value?.status
  if (status === 'offline') {
    socket.value?.emit(`${userData.value.tenantId}:setUserIdle`)
  } else if (status === 'online') {
    socket.value?.emit(`${userData.value.tenantId}:setUserActive`)
  }
}

const openExistingTicket = (contact, ticket) => {
  $q.dialog({
    title: 'Atenção!!',
    message: `${contact} possui um atendimento em curso (Atendimento: ${ticket.id}). Deseja abrir o atendimento?`,
    cancel: {
      label: 'Não',
      color: 'primary',
      push: true
    },
    ok: {
      label: 'Sim',
      color: 'negative',
      push: true
    },
    persistent: true
  }).onOk(async () => {
    try {
      router.push({ 
        name: 'chat',
        params: { ticketId: ticket.id }
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao abrir atendimento',
        position: 'top'
      })
    }
  })
}

// Lifecycle Hooks
onMounted(async () => {
  await fetchWhatsApps()
  await fetchNotifications()

  if ('Notification' in window) {
    Notification.requestPermission()
  }

  socket.value?.on(`${userData.value.tenantId}:notification`, handleNotification)
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>

<style scoped>
.q-img__image {
  background-size: contain;
}
</style>
