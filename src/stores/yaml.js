import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useYamlStore = defineStore('yaml', () => {
  const selectedYaml = ref('')

  function setYaml(text) {
    selectedYaml.value = text
  }

  function clear() {
    selectedYaml.value = ''
  }

  return { selectedYaml, setYaml, clear }
})
