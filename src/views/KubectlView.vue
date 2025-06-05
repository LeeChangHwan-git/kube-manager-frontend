<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

const terminalEl = ref(null)
let terminal = null
let socket = null

onMounted(() => {
  // 터미널 생성
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    theme: {
      background: '#1e1e1e',
      foreground: '#ffffff',
    },
  })

  terminal.open(terminalEl.value)

  // WebSocket 연결
  socket = new WebSocket('ws://localhost:8080/api/kubectl')

  socket.onopen = () => {
    console.log('WebSocket 연결됨')
    terminal.write('🚀 Terminal connected!\r\n')
  }

  socket.onmessage = (e) => {
    terminal.write(e.data)
  }

  socket.onclose = () => {
    terminal.write('\r\n❌ Connection closed\r\n')
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
    terminal.write('\r\n❌ Connection error\r\n')
  }

  // 터미널 입력을 WebSocket으로 전송 (연결 상태 확인)
  terminal.onData((data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(data)
    }
  })
})

onUnmounted(() => {
  // 정리 작업
  if (socket) {
    socket.close()
  }
  if (terminal) {
    terminal.dispose()
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div ref="terminalEl" class="h-96 bg-black rounded p-2"></div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
