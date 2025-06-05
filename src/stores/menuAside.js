import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useMenuAsideStore = defineStore('menuAside', () => {
  const open = reactive({})

  function setOpen(label, value) {
    open[label] = value
  }

  function toggle(label) {
    open[label] = !open[label]
  }

  function isOpen(label) {
    return !!open[label]
  }

  return { open, setOpen, toggle, isOpen }
})
