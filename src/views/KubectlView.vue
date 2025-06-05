<script setup>
import { onMounted, ref } from 'vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

const terminalEl = ref(null)

onMounted(() => {
  const term = new Terminal()
  term.open(terminalEl.value)
  const socket = new WebSocket('ws://localhost:8080/api/kubectl')
  socket.onmessage = (e) => term.write(e.data)
  term.onData((d) => socket.send(d))
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div ref="terminalEl" class="h-96"></div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
