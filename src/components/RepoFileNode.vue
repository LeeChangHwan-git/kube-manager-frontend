<script setup>
defineOptions({ name: 'RepoFileNode' })
import { ref, computed } from 'vue'
import { mdiChevronRight, mdiChevronDown, mdiFolderOutline, mdiFileOutline } from '@mdi/js'
import BaseIcon from '@/components/BaseIcon.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
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

const children = ref([])
const expanded = ref(false)
const loading = ref(false)

const isDir = computed(() => props.item.type === 'dir')

const toggle = async () => {
  if (!isDir.value) {
    emit('file-click', props.item.path)
    return
  }
  if (expanded.value) {
    expanded.value = false
    return
  }
  if (!children.value.length) {
    loading.value = true
    try {
      const auth = btoa(`${props.username}:${props.password}`)
      let apiUrl = props.repoUrl
      if (apiUrl.includes('https://github.com/')) {
        apiUrl = apiUrl.replace('https://github.com/', '')
      }
      apiUrl = `https://api.github.com/repos/${apiUrl}/contents/${props.item.path}`
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      })
      const data = await res.json()
      children.value = data
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  expanded.value = true
}
</script>

<template>
  <div class="ml-4">
    <div @click="toggle" class="cursor-pointer select-none flex items-center space-x-1">
      <BaseIcon
        :path="isDir ? (expanded ? mdiChevronDown : mdiChevronRight) : mdiFileOutline"
        size="14"
      />
      <BaseIcon v-if="isDir" :path="mdiFolderOutline" size="14" />
      <span>{{ item.name }}</span>
    </div>
    <div v-if="expanded" class="ml-4">
      <div v-if="loading" class="text-sm text-gray-500">Loading...</div>
      <RepoFileNode
        v-for="child in children"
        :key="child.path"
        :item="child"
        :repo-url="repoUrl"
        :username="username"
        :password="password"
        @file-click="emit('file-click', $event)"
      />
    </div>
  </div>
</template>
