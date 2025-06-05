<script setup>
import { ref } from 'vue'
import MonacoEditor from '@guolao/vue-monaco-editor'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import RepoFileTree from '@/components/RepoFileTree.vue'

const repoUrl = ref('')
const username = ref('')
const password = ref('')
const repoLoaded = ref(false)
const fileContent = ref('')
const loading = ref(false)

const loadRepo = () => {
  repoLoaded.value = true
  fileContent.value = ''
}

const fetchFileContent = async (path) => {
  fileContent.value = ''
  loading.value = true
  try {
    const auth = btoa(`${username.value}:${password.value}`)
    let apiUrl = repoUrl.value
    if (apiUrl.includes('https://github.com/')) {
      apiUrl = apiUrl.replace('https://github.com/', '')
    }
    apiUrl = `https://api.github.com/repos/${apiUrl}/contents/${path}`
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }
    const data = await res.json()
    if (data && !Array.isArray(data)) {
      const binary = atob(data.content)
      const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
      fileContent.value = new TextDecoder('utf-8').decode(bytes)
    }
  } catch (err) {
    fileContent.value = `Error: ${err.message}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitle title="GitHub Repository" />
      <form @submit.prevent="loadRepo" class="space-y-4">
        <FormField label="Repository URL">
          <FormControl v-model="repoUrl" placeholder="https://github.com/user/repo" />
        </FormField>
        <FormField label="Username">
          <FormControl v-model="username" />
        </FormField>
        <FormField label="Password">
          <FormControl v-model="password" type="password" />
        </FormField>
        <BaseButton type="submit" label="Load Repository" />
      </form>
      <div v-if="repoLoaded" class="mt-4 flex space-x-4">
        <div class="w-1/3 overflow-auto">
          <RepoFileTree
            :repo-url="repoUrl"
            :username="username"
            :password="password"
            @file-click="fetchFileContent"
          />
        </div>

        <div v-if="fileContent" class="w-2/3">
          <MonacoEditor
            v-model:value="fileContent"
            language="plaintext"
            theme="vs-dark"
            height="800px"
            :options="{ readOnly: true, scrollBeyondLastLine: false }"
          />
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
