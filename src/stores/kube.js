import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useKubeStore = defineStore('kube', () => {
  const contexts = ref([])
  const contextDetails = ref({})

  async function fetchContexts() {
    try {
      const res = await axios.get('http://localhost:8080/api/contexts')
      contexts.value = res?.data?.data || []
    } catch (err) {
      alert(err.message)
    }
  }

  async function fetchContextDetail(name) {
    try {
      const res = await axios.get(`http://localhost:8080/api/context/${name}`)
      contextDetails.value[name] = res?.data?.data || null
    } catch (err) {
      alert(err.message)
    }
  }

  async function deleteContext(name) {
    try {
      await axios.delete('http://localhost:8080/api/context', {
        data: { contextName: name },
      })
      contexts.value = contexts.value.filter((c) => c.name !== name)
      delete contextDetails.value[name]
    } catch (err) {
      alert(err.message)
    }
  }

  async function addConfig(payload) {
    try {
      await axios.post('http://localhost:8080/api/config', payload)
      fetchContexts()
    } catch (err) {
      alert(err.message)
    }
  }

  async function useContext(name) {
    try {
      await axios.post('http://localhost:8080/api/context/use', {
        contextName: name,
      })
      await fetchContexts()
    } catch (err) {
      alert(err.message)
    }
  }

  return {
    contexts,
    contextDetails,
    fetchContexts,
    fetchContextDetail,
    deleteContext,
    addConfig,
    useContext,
  }
})
