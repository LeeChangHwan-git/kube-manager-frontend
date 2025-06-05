<script setup>
import { ref } from 'vue'
import MonacoEditor from '@guolao/vue-monaco-editor'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'

const repoUrl = ref('')
const username = ref('')
const password = ref('')
const fileList = ref([])
const fileContent = ref('')
const currentPath = ref('')
const loading = ref(false)

const fetchRepo = async () => {
  fileContent.value = ''
  fileList.value = []
  loading.value = true
  try {
    const auth = btoa(`${username.value}:${password.value}`)
    let apiUrl = repoUrl.value
    if (apiUrl.includes('https://github.com/')) {
      apiUrl = apiUrl.replace('https://github.com/', '')
    }
    apiUrl = `https://api.github.com/repos/${apiUrl}/contents`
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }
    const data = await res.json()
    fileList.value = data
    currentPath.value = ''
  } catch (err) {
    fileContent.value = `Error: ${err.message}`
  } finally {
    loading.value = false
  }
}

const fetchContents = async (path) => {
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
    if (Array.isArray(data)) {
      fileList.value = data
      currentPath.value = path
    } else {
      fileContent.value = atob(data.content)
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
      <form @submit.prevent="fetchRepo" class="space-y-4">
        <FormField label="Repository URL">
          <FormControl v-model="repoUrl" placeholder="https://github.com/user/repo" />
        </FormField>
        <FormField label="Username">
          <FormControl v-model="username" />
        </FormField>
        <FormField label="Password">
          <FormControl v-model="password" type="password" />
        </FormField>
        <BaseButton type="submit" :disabled="loading" label="Load Repository" />
      </form>

      <div v-if="fileList.length" class="mt-4">
        <div class="mb-2" v-if="currentPath">
          <BaseButton
            label="⬅ Back"
            color="info"
            size="small"
            @click="fetchContents(currentPath.split('/').slice(0, -1).join('/'))"
          />
        </div>
        <ul class="space-y-1">
          <li v-for="item in fileList" :key="item.path" class="cursor-pointer">
            <span v-if="item.type === 'dir'" class="text-blue-600" @click="fetchContents(item.path)"
              >{{ item.name }}/</span
            >
            <span v-else @click="fetchContents(item.path)">{{ item.name }}</span>
          </li>
        </ul>
      </div>

      <div v-if="fileContent" class="mt-4">
        <MonacoEditor
          v-model:value="fileContent"
          language="plaintext"
          theme="vs-dark"
          height="400px"
          :options="{ readOnly: true, scrollBeyondLastLine: false }"
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
