<template>
  <div class="bg-white no-scroll hide-scrollbar overflow-hidden" :style="backgroundStyle">
    <infor-cabecalho-chat
      @updateTicket:resolver="updateTicketStatus('closed')"
      @updateTicket:retornar="updateTicketStatus('pending')"
      @updateTicket:reabrir="updateTicketStatus('open')"
      @abrir:modalAgendamentoMensagem="modalAgendamentoMensagem = true"
    />

    <q-scroll-area
      ref="scrollContainer"
      class="scroll-y"
      :style="scrollAreaStyle"
      @scroll="handleScroll"
    >
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <infinite-loading
          v-if="messages.length"
          @infinite="loadMoreMessages"
          direction="top"
          :identifier="ticketId"
          spinner="spiral"
        >
          <template #no-results>
            <div v-if="!messages.length">Sem resultados :(</div>
          </template>
          <template #no-more>
            Nada mais a carregar :)
          </template>
        </infinite-loading>
      </transition>

      <mensagem-chat
        v-if="messages.length && ticketId"
        v-model:replyingMessage="replyingMessage"
        :mensagens="messages"
        @mensagem-chat:encaminhar-mensagem="openForwardModal"
        v-model:ativarMultiEncaminhamento="isMultiForwardActive"
        v-model:mensagensParaEncaminhar="messagesToForward"
      />

      <div id="inicioListaMensagensChat"></div>
    </q-scroll-area>

    <!-- Empty State -->
    <div
      v-if="!ticketId"
      class="absolute-center items-center"
      :class="emptyStateClass"
    >
      <q-icon
        size="6em"
        color="grey-6"
        name="mdi-emoticon-wink-outline"
        :class="emptyStateIconClass"
      />
      <h1 class="text-grey-6 row col justify-center" :class="{ 'full-width': $q.screen.xs }">
        Selecione um ticket!
      </h1>
    </div>

    <!-- Scroll to bottom button -->
    <div v-if="messages.length" class="relative-position">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="showScrollIcon">
          <q-btn
            class="vac-icon-scroll"
            color="white"
            text-color="black"
            icon="mdi-arrow-down"
            round
            push
            ripple
            dense
            @click="scrollToBottom"
          />
        </div>
      </transition>
    </div>

    <!-- Footer -->
    <q-footer class="bg-white">
      <q-separator class="bg-grey-4" />
      
      <!-- Reply Message Preview -->
      <reply-message-preview
        v-if="replyingMessage"
        :message="replyingMessage"
        @close="replyingMessage = null"
        :loading="loading"
        :disabled="ticketStatus !== 'open'"
      />

      <!-- Forward Message Banner -->
      <forward-message-banner
        v-if="messagesToForward.length"
        :messages="messagesToForward"
        v-model:selectedContact="selectedContact"
        :loading="loading"
        @cancel="cancelMultiForward"
        @send="confirmForwardMessage(messagesToForward)"
        @search="searchContact"
        :contacts="contacts"
      />

      <!-- Message Input -->
      <input-mensagem
        v-if="!messagesToForward.length"
        :mensagensRapidas="quickMessages"
        v-model:replyingMessage="replyingMessage"
      />

      <q-resize-observer @resize="onResizeInputMessage" />
    </q-footer>

    <!-- Modals -->
    <schedule-message-modal
      v-model="modalAgendamentoMensagem"
      :mensagensRapidas="quickMessages"
      v-model:replyingMessage="replyingMessage"
    />

    <forward-message-modal
      v-model="modalEncaminhamentoMensagem"
      :message="messageToForward"
      v-model:selectedContact="selectedContact"
      :loading="loading"
      :contacts="contacts"
      @search="searchContact"
      @send="confirmForwardMessage([messageToForward])"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useChat } from '../../composables/useChat'
import { useTickets } from '../../composables/useTickets'
import { useContacts } from '../../composables/useContacts'
import InforCabecalhoChat from './InforCabecalhoChat.vue'
import MensagemChat from './MensagemChat.vue'
import InputMensagem from './InputMensagem.vue'
import ReplyMessagePreview from './ReplyMessagePreview.vue'
import ForwardMessageBanner from './ForwardMessageBanner.vue'
import ScheduleMessageModal from './ScheduleMessageModal.vue'
import ForwardMessageModal from './ForwardMessageModal.vue'
import whatsBackground from '../../assets/wa-background.png'
import whatsBackgroundDark from '../../assets/wa-background-dark.jpg'

// Props
const props = defineProps({
  quickMessages: {
    type: Array,
    default: () => []
  }
})

// Composables
const $q = useQuasar()
const { messages, loadMore, hasMore } = useChat()
const { updateTicketStatus, ticketId, ticketStatus } = useTickets()
const { searchContacts, forwardMessage } = useContacts()

// Estado
const loading = ref(false)
const showScrollIcon = ref(false)
const inputMessageHeight = ref(0)
const replyingMessage = ref(null)
const modalAgendamentoMensagem = ref(false)
const modalEncaminhamentoMensagem = ref(false)
const messageToForward = ref({})
const messagesToForward = ref([])
const isMultiForwardActive = ref(false)
const selectedContact = ref(null)
const contacts = ref([])
const scrollContainer = ref(null)

// Computed
const backgroundStyle = computed(() => ({
  backgroundImage: $q.dark.isActive 
    ? `url(${whatsBackgroundDark}) !important` 
    : `url(${whatsBackground}) !important`,
  backgroundPosition: 'center !important'
}))

const scrollAreaStyle = computed(() => {
  const baseHeight = 62 + inputMessageHeight.value
  return `min-height: calc(100vh - ${baseHeight}px); height: calc(100vh - ${baseHeight}px); width: 100%`
})

const emptyStateClass = computed(() => ({
  'row col text-center q-col-gutter-lg': !$q.screen.xs,
  'full-width text-center': $q.screen.xs
}))

const emptyStateIconClass = computed(() => ({
  'row col text-center q-mr-lg': !$q.screen.xs,
  'full-width text-center center-block': $q.screen.xs
}))

// Métodos
const onResizeInputMessage = (size) => {
  inputMessageHeight.value = size.height
}

const handleScroll = (e) => {
  if (!e) return
  showScrollIcon.value = (e.verticalSize - (e.verticalPosition + e.verticalContainerSize)) > 2000
}

const scrollToBottom = () => {
  document.getElementById('inicioListaMensagensChat')?.scrollIntoView()
}

const loadMoreMessages = async (state) => {
  if (loading.value || !hasMore.value || !ticketId.value) {
    return state.complete()
  }

  try {
    loading.value = true
    await loadMore()
    state.loaded()
  } catch (error) {
    state.complete()
    console.error('Erro ao carregar mais mensagens:', error)
  } finally {
    loading.value = false
  }
}

const openForwardModal = (msg) => {
  messageToForward.value = msg
  modalEncaminhamentoMensagem.value = true
}

const searchContact = async (search, update, abort) => {
  if (search.length < 2) {
    if (contacts.value.length) {
      update(() => { contacts.value = [...contacts.value] })
    }
    abort()
    return
  }

  try {
    loading.value = true
    const result = await searchContacts(search)
    update(() => {
      contacts.value = result.length ? result : [{}]
    })
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
  } finally {
    loading.value = false
  }
}

const cancelMultiForward = () => {
  messagesToForward.value = []
  isMultiForwardActive.value = false
}

const confirmForwardMessage = async (messages) => {
  if (!selectedContact.value?.id) {
    $q.notify({
      type: 'warning',
      message: 'Selecione o contato de destino das mensagens.',
      position: 'top'
    })
    return
  }

  try {
    await forwardMessage(messages, selectedContact.value)
    $q.notify({
      type: 'positive',
      message: `Mensagem encaminhada para ${selectedContact.value.name}`,
      position: 'top'
    })
    cancelMultiForward()
    modalEncaminhamentoMensagem.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Não foi possível encaminhar mensagem. Tente novamente em alguns minutos!',
      position: 'top'
    })
    console.error('Erro ao encaminhar mensagem:', error)
  }
}

// Lifecycle
onMounted(() => {
  window.$root.$on('scrollToBottomMessageChat', scrollToBottom)
})

onUnmounted(() => {
  window.$root.$off('scrollToBottomMessageChat', scrollToBottom)
})
</script>

<style lang="scss">
// Estilos mantidos do componente original
audio {
  height: 40px;
  width: 264px;
}

.mostar-btn-opcoes-chat {
  display: none;
  transition: width 2s transform 2s;
}

.q-message-text:hover .mostar-btn-opcoes-chat {
  display: block;
  float: right;
  position: absolute;
  z-index: 999;
}

.hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: 0.8;

  &:before {
    content: "";
    background: linear-gradient(to right, transparent, #818078, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }

  &:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: black;
    font-size: 16px;
    font-weight: 600;
    padding: 0 0.5em;
    line-height: 1.5em;
    background-color: $grey;
    border-radius: 15px;
  }
}

.textContentItem {
  overflow-wrap: break-word;
}

.textContentItemDeleted {
  font-style: italic;
  color: rgba(0, 0, 0, 0.36);
  overflow-wrap: break-word;
}

.replyginContactMsgSideColor {
  flex: none;
  width: 4px;
  background-color: #35cd96;
}

.replyginSelfMsgSideColor {
  flex: none;
  width: 4px;
  background-color: #6bcbef;
}

.replyginMsgBody {
  padding: 10;
  height: auto;
  display: block;
  white-space: pre-wrap;
  overflow: hidden;
}

.messageContactName {
  display: flex;
  color: #6bcbef;
  font-weight: 500;
}

.vac-icon-scroll {
  position: absolute;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 2px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  cursor: pointer;
  z-index: 99;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
