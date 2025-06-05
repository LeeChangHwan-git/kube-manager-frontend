<script setup>
import { ref } from 'vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'

const repoUrl = ref('')
const username = ref('')
const password = ref('')
const repoContents = ref('')
const loading = ref(false)

const fetchRepo = async () => {
  repoContents.value = ''
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
    repoContents.value = JSON.stringify(data, null, 2)
  } catch (err) {
    repoContents.value = `Error: ${err.message}`
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
      <div v-if="repoContents" class="mt-4">
        <pre class="whitespace-pre-wrap text-sm">{{ repoContents }}</pre>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
