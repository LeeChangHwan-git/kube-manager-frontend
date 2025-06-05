<script setup>
import { mdiKubernetes } from '@mdi/js'
import { reactive, ref } from 'vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import CardBox from '@/components/CardBox.vue'
import TableKubeContexts from '@/components/TableKubeContexts.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useKubeStore } from '@/stores/kube.js'

const kubeStore = useKubeStore()

const addModalActive = ref(false)
const form = reactive({
  clusterName: '',
  server: '',
  contextName: '',
  user: '',
  token: '',
})

const submitAdd = async () => {
  await kubeStore.addConfig({
    clusterName: form.clusterName,
    server: form.server,
    contextName: form.contextName,
    user: form.user,
    token: form.token,
  })
  addModalActive.value = false
  form.clusterName = ''
  form.server = ''
  form.contextName = ''
  form.user = ''
  form.token = ''
}
</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal
      v-model="addModalActive"
      title="Add context"
      button="info"
      button-label="Add"
      has-cancel
      @confirm="submitAdd"
    >
      <FormField label="Cluster Name">
        <FormControl v-model="form.clusterName" required />
      </FormField>
      <FormField label="Server">
        <FormControl v-model="form.server" required />
      </FormField>
      <FormField label="Context Name">
        <FormControl v-model="form.contextName" required />
      </FormField>
      <FormField label="User">
        <FormControl v-model="form.user" required />
      </FormField>
      <FormField label="Token">
        <FormControl v-model="form.token" />
      </FormField>
    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiKubernetes" title="KubeConfig" main>
        <BaseButton
          label="Add context"
          color="info"
          rounded-full
          small
          @click="addModalActive = true"
        />
      </SectionTitleLineWithButton>
      <NotificationBar color="info" :icon="mdiKubernetes"> 클러스터 컨텍스트 목록 </NotificationBar>
      <CardBox has-table>
        <TableKubeContexts />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
