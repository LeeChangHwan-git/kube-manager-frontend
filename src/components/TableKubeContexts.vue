<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { mdiCheck, mdiClose } from '@mdi/js'
import PillTag from '@/components/PillTag.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useKubeStore } from '@/stores/kube.js'

const kubeStore = useKubeStore()

const expandedRows = ref({})
const deleteModalActive = ref(false)
const selectedContext = ref(null)

const contextMenuVisible = ref(false)
const contextMenuPos = ref({ x: 0, y: 0 })
const contextMenuCtx = ref(null)

onMounted(() => {
  kubeStore.fetchContexts()
  document.addEventListener('click', hideContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
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

const hideContextMenu = () => {
  contextMenuVisible.value = false
}

const showContextMenu = (event, ctx) => {
  event.preventDefault()
  contextMenuCtx.value = ctx
  contextMenuPos.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

const chooseDelete = () => {
  selectedContext.value = contextMenuCtx.value.name
  contextMenuVisible.value = false
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
        <tr @click="toggleRow(ctx)" @contextmenu="showContextMenu($event, ctx)">
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
  <div
    v-if="contextMenuVisible"
    class="fixed bg-white dark:bg-slate-800 border rounded shadow z-50"
    :style="{ top: contextMenuPos.y + 'px', left: contextMenuPos.x + 'px' }"
  >
    <ul>
      <li
        class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
        @click="chooseDelete"
      >
        Delete
      </li>
    </ul>
  </div>
</template>
