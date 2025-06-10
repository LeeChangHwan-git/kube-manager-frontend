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
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitle :icon="mdiRobot" title="AI Assistant" />
      <NotificationBar color="info" :icon="mdiRobot" class="mb-4">
        {{ aiConnected ? 'AI 서버 연결됨' : 'AI 서버 연결 안됨' }}
      </NotificationBar>

      <FormField label="Prompt">
        <FormControl v-model="prompt" placeholder="프롬프트를 입력하세요" />
      </FormField>

      <div class="flex gap-2 mb-6">
        <BaseButton
          :label="loading ? 'Loading...' : 'Generate YAML'"
          color="info"
          @click="onGenerate"
          :disabled="loading"
        />
        <BaseButton
          label="Generate & Apply"
          color="success"
          @click="onGenerateApply"
          :disabled="loading"
        />
        <BaseButton label="Ask AI" color="contrast" @click="onAsk" :disabled="loading" />
      </div>

      <div v-if="result" class="p-4 bg-white dark:bg-slate-800 border rounded">
        <pre class="text-sm whitespace-pre-wrap">{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
