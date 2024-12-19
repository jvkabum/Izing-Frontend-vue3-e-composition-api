<template>
  <div class="text-caption text-center bg-grey-1 q-pa-sm">
    Versão Sistema:
    <q-badge align="middle" color="primary">
      <a :href="github" target="_blank">v{{ version }}</a>
    </q-badge>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import packageInfo from '@/../package.json'

const version = computed(() => packageInfo.version)
const github = computed(() => packageInfo.github)
</script>

<style>

</style>
