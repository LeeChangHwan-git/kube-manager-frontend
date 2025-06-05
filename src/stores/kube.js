import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useKubeStore = defineStore('kube', () => {
  const contexts = ref([])

  async function fetchContexts() {
    try {
      const res = await axios.get('http://localhost:8080/api/contexts')
      contexts.value = res?.data?.data || []
    } catch (err) {
      alert(err.message)
    }
  }

  return { contexts, fetchContexts }
})
