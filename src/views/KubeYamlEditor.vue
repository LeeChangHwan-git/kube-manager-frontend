<script setup>
import { ref } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { MonacoEditor } from '@guolao/vue-monaco-editor'

const yamlContent = ref('')
const namespace = ref('default')
const dryRun = ref(false)

const applyYaml = async () => {
  await axios.post('http://localhost:8080/api/apply', {
    yamlContent: yamlContent.value,
    namespace: namespace.value,
    dryRun: dryRun.value,
  })
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <MonacoEditor v-model:value="yamlContent" language="yaml" theme="vs-dark" class="h-96" />
      <div class="mt-4 space-y-2">
        <FormField label="Namespace">
          <FormControl v-model="namespace" />
        </FormField>
        <FormField label="Dry Run">
          <FormControl v-model="dryRun" type="checkbox" />
        </FormField>
        <BaseButton label="Apply" color="info" @click="applyYaml" />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
