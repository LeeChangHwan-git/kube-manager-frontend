<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import MonacoEditor from '@guolao/vue-monaco-editor'
import { useYamlStore } from '@/stores/yaml.js'

const yamlContent = ref(`apiVersion: v1
kind: Pod
metadata:
  name: example-pod
  namespace: default
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80`)

const namespace = ref('default')
const dryRun = ref(false)
const isLoading = ref(false)
const result = ref('')
const yamlStore = useYamlStore()

watch(
  () => yamlStore.selectedYaml,
  (val) => {
    if (val) {
      yamlContent.value = val
      yamlStore.clear()
    }
  },
)

// Monaco Editor 옵션
const editorOptions = {
  fontSize: 16,
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  lineNumbers: 'on',
  folding: true,
  tabSize: 2,
  insertSpaces: true,
}

const applyYaml = async () => {
  if (!yamlContent.value.trim()) {
    alert('YAML 내용을 입력해주세요.')
    return
  }

  isLoading.value = true
  result.value = ''

  try {
    const response = await axios.post('http://localhost:8080/api/apply', {
      yamlContent: yamlContent.value,
      namespace: namespace.value,
      dryRun: dryRun.value === 'true',
    })

    result.value = `✅ ${response.data.message}`
    console.log('Apply result:', response.data)
  } catch (error) {
    result.value = `❌ 오류: ${error.response?.data || error.message}`
    console.error('Apply error:', error)
  } finally {
    isLoading.value = false
  }
}

const clearEditor = () => {
  yamlContent.value = ''
}

const loadExample = () => {
  yamlContent.value = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80`
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- 헤더 -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">🚀 Kubernetes YAML Editor</h2>
          <div class="flex gap-2">
            <BaseButton label="Clear" color="warning" @click="clearEditor" size="small" />
            <BaseButton label="Load Example" color="info" @click="loadExample" size="small" />
          </div>
        </div>

        <!-- Monaco Editor -->
        <div class="border border-gray-300 rounded-lg overflow-hidden mb-4">
          <MonacoEditor
            v-model:value="yamlContent"
            language="yaml"
            theme="vs-dark"
            height="500px"
            :options="editorOptions"
          />
        </div>

        <!-- 설정 옵션 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormField label="Namespace">
            <FormControl v-model="namespace" placeholder="default" />
          </FormField>

          <FormField label="Dry Run">
            <div class="flex items-center space-x-2 mt-2">
              <FormControl
                v-model="dryRun"
                type="select"
                class="w-32"
                :options="['', 'true', 'false']"
              />
              <span class="text-sm text-gray-600">(테스트 실행, 실제 적용하지 않음)</span>
            </div>
          </FormField>

          <div class="flex items-end">
            <BaseButton
              :label="isLoading ? 'Applying...' : 'Apply YAML'"
              color="success"
              @click="applyYaml"
              :disabled="isLoading"
              class="w-full"
            />
          </div>
        </div>

        <!-- 결과 표시 -->
        <div
          v-if="result"
          class="mt-4 p-3 rounded-lg"
          :class="
            result.startsWith('✅')
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          "
        >
          <pre class="text-sm whitespace-pre-wrap">{{ result }}</pre>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
/* Monaco Editor 컨테이너 스타일 강제 적용 */
:deep(.monaco-editor) {
  min-height: 500px !important;
}

:deep(.overflow-guard) {
  border-radius: 0 !important;
}

/* 추가적인 스타일 보정 */
.monaco-editor-container {
  width: 100%;
  height: 500px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}
</style>
