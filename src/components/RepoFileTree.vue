<script setup>
import { ref, watch, onMounted } from 'vue'
import RepoFileNode from '@/components/RepoFileNode.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  repoUrl: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['file-click'])

const items = ref([])
const loading = ref(false)

const fetchRoot = async () => {
  if (!props.repoUrl) return
  loading.value = true
  try {
    const auth = btoa(`${props.username}:${props.password}`)
    let apiUrl = props.repoUrl
    if (apiUrl.includes('https://github.com/')) {
      apiUrl = apiUrl.replace('https://github.com/', '')
    }
    apiUrl = `https://api.github.com/repos/${apiUrl}/contents`
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    const data = await res.json()
    items.value = data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRoot)
watch(() => [props.repoUrl, props.username, props.password], fetchRoot)
</script>

<template>
  <div>
    <BaseButton label="Reload" color="info" size="small" @click="fetchRoot" class="mb-2" />
    <div v-if="loading" class="text-sm text-gray-500">Loading...</div>
    <div v-else>
      <RepoFileNode
        v-for="item in items"
        :key="item.path"
        :item="item"
        :repo-url="repoUrl"
        :username="username"
        :password="password"
        @file-click="emit('file-click', $event)"
      />
    </div>
  </div>
</template>
