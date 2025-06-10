<script setup>
import { mdiRobot } from '@mdi/js'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAi } from '@/composables/useAi'

const { prompt, result, loading, aiConnected, generateYaml, generateAndApply, askAI, handleError } =
  useAi()

const onGenerate = async () => {
  try {
    await generateYaml()
  } catch (err) {
    handleError(err)
  }
}

const onGenerateApply = async () => {
  try {
    await generateAndApply()
  } catch (err) {
    handleError(err)
  }
}

const onAsk = async () => {
  try {
    await askAI(prompt.value)
  } catch (err) {
    handleError(err)
  }
}

// 복사 기능 추가
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('클립보드에 복사되었습니다!')
  } catch (err) {
    console.error('복사 실패:', err)
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitle :icon="mdiRobot" title="AI Assistant" />

      <!-- AI 연결 상태 -->
      <NotificationBar :color="aiConnected ? 'success' : 'danger'" :icon="mdiRobot" class="mb-4">
        {{ aiConnected ? '🟢 AI 서버 연결됨' : '🔴 AI 서버 연결 안됨' }}
      </NotificationBar>

      <!-- 프롬프트 입력 (크기 확대) -->
      <FormField label="AI 프롬프트 / 질문">
        <FormControl
          v-model="prompt"
          type="textarea"
          placeholder="예시:&#10;- nginx 파드 만들어줘, 이름은 web-server&#10;- Deployment 3개 replica로 만들어서 적용해줘&#10;- Pod가 CrashLoopBackOff일 때 어떻게 해결하나요?"
          :rows="4"
          class="min-h-24"
        />
      </FormField>

      <!-- 버튼들 -->
      <div class="flex flex-wrap gap-2 mb-6">
        <BaseButton
          :label="loading ? '생성 중...' : '📝 YAML 생성'"
          color="info"
          @click="onGenerate"
          :disabled="loading || !prompt.trim()"
        />
        <BaseButton
          :label="loading ? '생성 및 적용 중...' : '🚀 생성 + 적용'"
          color="success"
          @click="onGenerateApply"
          :disabled="loading || !prompt.trim()"
        />
        <BaseButton
          :label="loading ? '답변 중...' : '💬 AI에게 질문'"
          color="contrast"
          @click="onAsk"
          :disabled="loading || !prompt.trim()"
        />
      </div>

      <!-- 결과 표시 (개선된 UI) -->
      <div v-if="result" class="space-y-4">
        <!-- 메시지 표시 -->
        <div
          class="p-4 rounded-lg"
          :class="{
            'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800':
              result.success,
            'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800':
              !result.success,
          }"
        >
          <h3
            class="font-semibold mb-2"
            :class="{
              'text-green-800 dark:text-green-200': result.success,
              'text-red-800 dark:text-red-200': !result.success,
            }"
          >
            {{ result.success ? '✅' : '❌' }} {{ result.message }}
          </h3>
        </div>

        <!-- YAML 결과 -->
        <div
          v-if="result.data?.generatedYaml"
          class="bg-gray-50 dark:bg-slate-800 border rounded-lg overflow-hidden"
        >
          <div class="flex justify-between items-center p-3 bg-gray-100 dark:bg-slate-700 border-b">
            <h4 class="font-semibold text-gray-800 dark:text-gray-200">생성된 YAML</h4>
            <BaseButton
              label="📋 복사"
              color="info"
              small
              @click="copyToClipboard(result.data.generatedYaml)"
            />
          </div>
          <pre class="p-4 text-sm overflow-x-auto bg-gray-900 text-green-400">{{
            result.data.generatedYaml
          }}</pre>
        </div>

        <!-- 적용 결과 -->
        <div
          v-if="result.data?.applyResult"
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">🚀 적용 결과</h4>
          <div class="space-y-2">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>출력:</strong> {{ result.data.applyResult.output }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>적용 시간:</strong> {{ result.data.applyResult.appliedTime }}
            </p>
            <div v-if="result.data.applyResult.resources?.length > 0">
              <strong class="text-sm text-blue-700 dark:text-blue-300">생성된 리소스:</strong>
              <ul class="list-disc list-inside ml-4 text-sm text-blue-600 dark:text-blue-400">
                <li v-for="resource in result.data.applyResult.resources" :key="resource">
                  {{ resource }}
                </li>
              </ul>
            </div>
            <p
              v-if="result.data.applyResult.dryRun"
              class="text-sm text-orange-600 dark:text-orange-400"
            >
              💡 이것은 dry-run 결과입니다 (실제로 적용되지 않음)
            </p>
          </div>
        </div>

        <!-- AI 답변 -->
        <div
          v-if="result.data?.answer"
          class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4"
        >
          <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">🤖 AI 답변</h4>
          <div class="prose prose-sm max-w-none text-purple-700 dark:text-purple-300">
            <pre class="whitespace-pre-wrap font-sans">{{ result.data.answer }}</pre>
          </div>
          <div class="mt-3 text-xs text-purple-600 dark:text-purple-400">
            <span>컨텍스트: {{ result.data.context || 'N/A' }}</span> •
            <span>답변 시간: {{ result.data.answeredTime }}</span>
          </div>
        </div>

        <!-- 디버그 정보 (개발 환경에서만) -->
        <details class="bg-gray-100 dark:bg-slate-700 rounded-lg">
          <summary class="p-3 cursor-pointer font-medium text-gray-700 dark:text-gray-300">
            🔍 상세 정보 (개발용)
          </summary>
          <pre class="p-4 text-xs text-gray-600 dark:text-gray-400 border-t overflow-x-auto">{{
            JSON.stringify(result, null, 2)
          }}</pre>
        </details>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex items-center justify-center p-8">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="text-gray-600 dark:text-gray-400">AI가 작업 중입니다...</span>
        </div>
      </div>

      <!-- 사용 예시 -->
      <div
        v-if="!result && !loading"
        class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-3">💡 사용 예시</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong class="text-blue-700 dark:text-blue-300">YAML 생성:</strong>
            <ul class="list-disc list-inside ml-2 text-blue-600 dark:text-blue-400 space-y-1">
              <li>nginx 파드 만들어줘</li>
              <li>redis deployment 3개 replica로</li>
              <li>LoadBalancer service 만들어줘</li>
            </ul>
          </div>
          <div>
            <strong class="text-blue-700 dark:text-blue-300">AI 질문:</strong>
            <ul class="list-disc list-inside ml-2 text-blue-600 dark:text-blue-400 space-y-1">
              <li>Pod가 Pending 상태일 때 해결방법은?</li>
              <li>Ingress와 Service 차이점은?</li>
              <li>ConfigMap 사용법 알려줘</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
/* 코드 블록 스타일링 */
pre {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  line-height: 1.5;
}

/* 스크롤바 스타일 (웹킷 브라우저) */
pre::-webkit-scrollbar {
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .flex-wrap {
    flex-direction: column;
  }

  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
