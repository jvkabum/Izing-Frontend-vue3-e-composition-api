<template>
  <q-item
    clickable
    v-ripple
    :active="routeName === currentRoute"
    active-class="bg-blue-1 text-grey-8 text-bold menu-link-active-item-top"
    @click="handleClick"
    class="houverList"
    :class="{'text-negative text-bolder': color === 'negative'}"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="color === 'negative' ? 'mdi-cellphone-nfc-off' : icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption></q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  routeName: {
    type: String,
    default: 'dashboard'
  },
  icon: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.name)

const handleClick = () => {
  if (routeName !== currentRoute.value) {
    router.push({ name: props.routeName })
  }
}
</script>

<style lang="sass">
.menu-link-active-item-top
  border-left: 3px solid rgb(21, 120, 173)
  border-right: 3px solid rgb(21, 120, 173)
  border-top-right-radius: 20px
  border-bottom-right-radius: 20px
  position: relative
  height: 100%
</style>
