<script setup>
import { onMounted, ref } from 'vue'
import { mdiCheck, mdiClose } from '@mdi/js'
import PillTag from '@/components/PillTag.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useKubeStore } from '@/stores/kube.js'

const kubeStore = useKubeStore()

const expandedRows = ref({})
const deleteModalActive = ref(false)
const selectedContext = ref(null)

onMounted(() => {
  kubeStore.fetchContexts()
})

const toggleRow = async (ctx) => {
  expandedRows.value[ctx.name] = !expandedRows.value[ctx.name]
  if (expandedRows.value[ctx.name]) {
    await kubeStore.fetchContextDetail(ctx.name)
  }
}

const openDeleteModal = (ctx) => {
  selectedContext.value = ctx.name
  deleteModalActive.value = true
}

const confirmDelete = async () => {
  await kubeStore.deleteContext(selectedContext.value)
  deleteModalActive.value = false
}
</script>

<template>
  <CardBoxModal
    v-model="deleteModalActive"
    title="Delete context"
    button="danger"
    has-cancel
    @confirm="confirmDelete"
  >
    <p>Delete context {{ selectedContext }}?</p>
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Current</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="ctx in kubeStore.contexts" :key="ctx.name">
        <tr @click="toggleRow(ctx)" @contextmenu.prevent="openDeleteModal(ctx)">
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
        <tr v-if="expandedRows[ctx.name]">
          <td colspan="2" class="bg-gray-50 dark:bg-slate-800">
            <div v-if="kubeStore.contextDetails[ctx.name]" class="p-3 text-sm space-y-1">
              <div><b>Cluster:</b> {{ kubeStore.contextDetails[ctx.name].cluster.name }}</div>
              <div><b>Server:</b> {{ kubeStore.contextDetails[ctx.name].cluster.server }}</div>
              <div><b>User:</b> {{ kubeStore.contextDetails[ctx.name].user.name }}</div>
              <div>
                <b>Auth Method:</b>
                {{ kubeStore.contextDetails[ctx.name].user.authenticationMethod }}
              </div>
              <div><b>Namespace:</b> {{ kubeStore.contextDetails[ctx.name].namespace || '-' }}</div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
