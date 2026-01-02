import type { EngineVariant } from '~/types/engine'

export function useEngineControl() {
  // ------------------- 状态数据 -------------------

  // 当前选择的引擎类型
  const currentVariant = ref<EngineVariant>('sealevel')

  // 存储：使用 key 区分不同引擎的序列
  // 这里设计为由外部可以动态扩展，暂时针对两种硬编码，后续可改为动态对象
  const sequences = reactive({
    'sealevel': useLocalStorage<number[][]>('rocket-seq-sealevel', [[]]),
    'vacuum': useLocalStorage<number[][]>('rocket-seq-vacuum', [[]]),
    'cz7a': useLocalStorage<number[][]>('rocket-seq-cz7a', [[]]),
    'cz7a-stage2': useLocalStorage<number[][]>('rocket-seq-cz7a-stage2', [[]]),
  })

  // 当前播放进度
  const currentStepIndex = ref(0)

  // ------------------- 计算属性 -------------------

  // 获取当前类型对应的完整序列
  const currentSequence = computed(() => {
    return sequences[currentVariant.value] || []
  })

  // 获取当前步骤激活的引擎 ID 列表
  const activeEngineIds = computed(() => {
    if (currentStepIndex.value >= currentSequence.value.length)
      return []
    return currentSequence.value[currentStepIndex.value] || []
  })

  // 是否为最后一步
  const isLastStep = computed(() => {
    return currentStepIndex.value >= currentSequence.value.length - 1
  })

  // ------------------- 方法逻辑 -------------------

  // 切换引擎类型（会自动重置进度）
  function setVariant(variant: EngineVariant) {
    currentVariant.value = variant
    currentStepIndex.value = 0
  }

  // 保存序列数据
  function saveSequence(variant: EngineVariant, data: number[][]) {
    sequences[variant] = data
    // 如果正在操作当前类型，重置进度防止越界
    if (variant === currentVariant.value) {
      currentStepIndex.value = 0
    }
  }

  function nextStep() {
    if (!isLastStep.value)
      currentStepIndex.value++
  }

  function reset() {
    currentStepIndex.value = 0
  }

  return {
    currentVariant,
    currentStepIndex,
    currentSequence,
    activeEngineIds,
    isLastStep,
    sequences, // 暴露给编辑器读取初始值
    setVariant,
    saveSequence,
    nextStep,
    reset,
  }
}
