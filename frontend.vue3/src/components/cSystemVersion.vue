<template>
  <div class="text-caption text-center bg-grey-1 q-pa-sm">
    Versão Sistema:
    <q-badge align="middle" color="primary">
      <a 
        target="_blank" 
        :href="packageInfo.repository?.url || '#'" 
        class="text-white text-decoration-none"
      >
        v{{ packageInfo.version }}
      </a>
    </q-badge>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import packageJson from '../../package.json'

// Estado
const packageInfo = computed(() => ({
  version: packageJson.version,
  repository: {
    url: packageJson.repository?.url || 'https://github.com/jvkabum/Izingflow'
  }
}))
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

.text-white {
  color: white;
}
</style>
