import { ref, onMounted } from 'vue'

export function useAi() {
  // ===== 반응형 데이터 =====
  const prompt = ref('')
  const result = ref(null)
  const loading = ref(false)
  const aiConnected = ref(false)
  const contexts = ref([])
  const currentContext = ref('')

  // ===== API 설정 - 프록시 사용 =====
  const API_BASE = '/api' // Vite 프록시를 통해 Go 서버로 전달

  // ===== 1. AI 상태 확인 =====
  const checkAIHealth = async () => {
    try {
      console.log('AI Health Check URL:', `${API_BASE}/ai/health`)

      const response = await fetch(`${API_BASE}/ai/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('AI Health Response Status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('AI Health Data:', data)

      aiConnected.value = data.data?.isConnected || false
      return data
    } catch (error) {
      console.error('AI 상태 확인 실패:', error)
      aiConnected.value = false
      throw error
    }
  }

  // ===== 2. AI YAML 생성만 (요구사항 1) =====
  const generateYaml = async () => {
    if (!prompt.value.trim()) {
      throw new Error('프롬프트를 입력해주세요!')
    }

    loading.value = true
    try {
      console.log('Generate YAML URL:', `${API_BASE}/ai/generate-yaml`)

      const response = await fetch(`${API_BASE}/ai/generate-yaml`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.value,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      result.value = data
      return data
    } catch (error) {
      console.error('YAML 생성 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ===== 3. AI YAML 생성 + 적용 (요구사항 2) =====
  const generateAndApply = async (namespace = 'default', dryRun = false) => {
    if (!prompt.value.trim()) {
      throw new Error('프롬프트를 입력해주세요!')
    }

    loading.value = true
    try {
      const response = await fetch(`${API_BASE}/ai/generate-apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.value,
          namespace: namespace,
          dryRun: dryRun,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      result.value = data
      return data
    } catch (error) {
      console.error('YAML 생성 및 적용 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ===== 4. AI에게 질문하기 =====
  const askAI = async (question) => {
    if (!question.trim()) {
      throw new Error('질문을 입력해주세요!')
    }

    loading.value = true
    try {
      const response = await fetch(`${API_BASE}/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      result.value = data
      return data
    } catch (error) {
      console.error('AI 질문 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ===== 4-1. Git 레포지토리와 연동 =====
  const gitIntegration = async () => {
    if (!prompt.value.trim()) {
      throw new Error('프롬프트를 입력해주세요!')
    }

    loading.value = true
    try {
      const response = await fetch(`${API_BASE}/git/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.value,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      result.value = data
      return data
    } catch (error) {
      console.error('Git 연동 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ===== 5. 템플릿 기반 생성 =====
  const generateWithTemplate = async (
    templateType,
    parameters,
    namespace = 'default',
    apply = false,
  ) => {
    loading.value = true
    try {
      const response = await fetch(`${API_BASE}/ai/template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          templateType: templateType,
          parameters: {
            ...parameters,
            apply: apply,
          },
          namespace: namespace,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      result.value = data
      return data
    } catch (error) {
      console.error('템플릿 생성 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ===== 6. YAML 검증 =====
  const validateYaml = async (yamlContent) => {
    try {
      const response = await fetch(`${API_BASE}/ai/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          yamlContent: yamlContent,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('YAML 검증 실패:', error)
      throw error
    }
  }

  // ===== 7. AI 사용 예제 조회 =====
  const getAIExamples = async () => {
    try {
      const response = await fetch(`${API_BASE}/ai/examples`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('예제 조회 실패:', error)
      throw error
    }
  }

  // ===== 8. 컨텍스트 관련 =====
  const getContexts = async () => {
    try {
      const response = await fetch(`${API_BASE}/contexts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      contexts.value = data.data

      const current = data.data.find((ctx) => ctx.isCurrent)
      if (current) {
        currentContext.value = current.name
      }

      return data
    } catch (error) {
      console.error('컨텍스트 조회 실패:', error)
      throw error
    }
  }

  const useContext = async (contextName) => {
    try {
      const response = await fetch(`${API_BASE}/context/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          contextName: contextName,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      currentContext.value = contextName
      await getContexts()
      return data
    } catch (error) {
      console.error('컨텍스트 변경 실패:', error)
      throw error
    }
  }

  // ===== 9. 직접 YAML 적용 =====
  const applyYaml = async (yamlContent, namespace = 'default', dryRun = false) => {
    try {
      const response = await fetch(`${API_BASE}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          yamlContent: yamlContent,
          namespace: namespace,
          dryRun: dryRun,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('YAML 적용 실패:', error)
      throw error
    }
  }

  // ===== 10. 서버 상태 확인 - 프록시 사용 =====
  const checkServerHealth = async () => {
    try {
      // Vite 프록시를 통해 Go 서버의 health 엔드포인트 호출
      const response = await fetch('/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Server Health Response Status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Server Health Data:', data)
      return data
    } catch (error) {
      console.error('서버 상태 확인 실패:', error)
      throw error
    }
  }

  // ===== 편의 함수들 =====
  const createDeployment = async (name, image, replicas = 1, apply = false) => {
    return await generateWithTemplate(
      'deployment',
      {
        name: name,
        image: image,
        replicas: replicas,
      },
      'default',
      apply,
    )
  }

  const createService = async (name, type = 'ClusterIP', port = 80, apply = false) => {
    return await generateWithTemplate(
      'service',
      {
        name: name,
        type: type,
        port: port,
        targetPort: port,
      },
      'default',
      apply,
    )
  }

  const createPod = async (name, image, apply = false) => {
    return await generateWithTemplate(
      'pod',
      {
        name: name,
        image: image,
      },
      'default',
      apply,
    )
  }

  const handleError = (error, showAlert = true) => {
    console.error('API 에러:', error)

    if (showAlert) {
      alert(error.message || '요청 처리 중 오류가 발생했습니다.')
    }

    return {
      success: false,
      error: error.message || '알 수 없는 오류',
    }
  }

  // ===== 디버그 함수 수정 =====
  const debugApiConnection = async () => {
    console.log('=== API 연결 디버그 ===')
    console.log('API_BASE:', API_BASE)
    console.log('Current URL:', window.location.href)
    console.log('Base Path:', '/admin-one-vue-tailwind/')

    try {
      // 1. 서버 health 체크
      console.log('1. 서버 Health 체크... (프록시 사용)')
      await checkServerHealth()
      console.log('✅ 서버 연결 성공')
    } catch (error) {
      console.log('❌ 서버 연결 실패:', error.message)
    }

    try {
      // 2. AI health 체크
      console.log('2. AI Health 체크... (프록시 사용)')
      await checkAIHealth()
      console.log('✅ AI 연결 성공')
    } catch (error) {
      console.log('❌ AI 연결 실패:', error.message)
    }
  }

  onMounted(async () => {
    try {
      console.log('useAi 초기화 시작...')
      console.log('API_BASE:', API_BASE)
      console.log('프록시를 통한 API 호출 방식 사용')

      // 디버그 모드에서 연결 상태 체크
      if (import.meta.env.DEV) {
        await debugApiConnection()
      }

      await checkServerHealth()
      console.log('✅ 서버 상태 확인 완료')

      await checkAIHealth()
      console.log('✅ AI 상태 확인 완료')

      await getContexts()
      console.log('✅ 컨텍스트 조회 완료')

      // 5초마다 AI 상태 확인
      setInterval(checkAIHealth, 5000)
    } catch (error) {
      console.error('초기화 실패:', error)
    }
  })

  return {
    prompt,
    result,
    loading,
    aiConnected,
    contexts,
    currentContext,
    generateYaml,
    generateAndApply,
    askAI,
    generateWithTemplate,
    validateYaml,
    getAIExamples,
    getContexts,
    useContext,
    applyYaml,
    createDeployment,
    createService,
    createPod,
    gitIntegration,
    checkAIHealth,
    checkServerHealth,
    handleError,
    debugApiConnection, // 디버그 함수 추가
  }
}
