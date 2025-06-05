<script setup>
import { onMounted } from 'vue'
import { mdiCheck, mdiClose } from '@mdi/js'
import PillTag from '@/components/PillTag.vue'
import { useKubeStore } from '@/stores/kube.js'

const kubeStore = useKubeStore()

onMounted(() => {
  kubeStore.fetchContexts()
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Current</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ctx in kubeStore.contexts" :key="ctx.name">
        <td data-label="Name">{{ ctx.name }}</td>
        <td data-label="Current">
          <PillTag
            :label="ctx.isCurrent ? 'Current' : 'Inactive'"
            :color="ctx.isCurrent ? 'success' : 'light'"
            :icon="ctx.isCurrent ? mdiCheck : mdiClose"
            small
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
