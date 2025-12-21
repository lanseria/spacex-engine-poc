<script setup lang="ts">
import type { EngineVariant } from '~/components/RocketEngine.vue'

// ------------------- 状态数据 -------------------

// 引擎类型选择
const engineVariant = ref<EngineVariant>('sealevel')

// 分别存储不同引擎的序列
const sequenceSealevel = useLocalStorage<number[][]>('rocket-launch-sequence-sealevel', [[]])
const sequenceVacuum = useLocalStorage<number[][]>('rocket-launch-sequence-vacuum', [[]])

// 根据当前引擎类型获取对应的序列引用
const sequence = computed({
  get: () => engineVariant.value === 'sealevel' ? sequenceSealevel.value : sequenceVacuum.value,
  set: (val) => {
    if (engineVariant.value === 'sealevel')
      sequenceSealevel.value = val
    else
      sequenceVacuum.value = val
  },
})

// 当前播放进度（不同引擎类型切换时，重置进度还是保留？这里选择重置以防越界）
const currentStepIndex = ref(0)

// 监听引擎切换，重置进度
watch(engineVariant, () => {
  currentStepIndex.value = 0
})

// 弹窗控制
const isConfigOpen = ref(false)

// 编辑态数据（深拷贝用于编辑，不直接修改原序列）
const tempSequence = ref<number[][]>([])
const editingStepIndex = ref(0)

// ------------------- 计算属性 -------------------

// 当前展示的激活引擎列表（主界面用）
const currentActiveEngines = computed(() => {
  if (currentStepIndex.value >= sequence.value.length) {
    return []
  }
  return sequence.value[currentStepIndex.value] || []
})

// 编辑态展示的激活引擎列表（配置弹窗用）
const editingActiveEngines = computed(() => {
  return tempSequence.value[editingStepIndex.value] || []
})

// 是否为最后一步
const isLastStep = computed(() => currentStepIndex.value >= sequence.value.length - 1)

// ------------------- 方法逻辑 -------------------

// 下一步
function nextStep() {
  if (!isLastStep.value) {
    currentStepIndex.value++
  }
}

// 重置回第一步
function resetSequence() {
  currentStepIndex.value = 0
}

// 打开配置弹窗
function openConfig() {
  // 深拷贝当前序列到临时变量
  tempSequence.value = JSON.parse(JSON.stringify(sequence.value))
  editingStepIndex.value = 0
  isConfigOpen.value = true
}

// 关闭/取消配置
function closeConfig() {
  isConfigOpen.value = false
}

// 保存配置
function saveConfig() {
  sequence.value = JSON.parse(JSON.stringify(tempSequence.value))
  // 如果当前播放进度超过了新序列长度，重置
  if (currentStepIndex.value >= sequence.value.length) {
    currentStepIndex.value = 0
  }
  closeConfig()
}

// 编辑：切换某个步骤中某个引擎的状态
function toggleEngineState(engineId: number) {
  const step = tempSequence.value[editingStepIndex.value]
  const index = step!.indexOf(engineId)
  if (index > -1) {
    step!.splice(index, 1) // 关闭
  }
  else {
    step!.push(engineId) // 开启
  }
}

// 编辑：添加新步骤
function addStep() {
  // 默认复制上一步的状态，如果没有则全关
  const lastStep = tempSequence.value[tempSequence.value.length - 1] || []
  tempSequence.value.push([...lastStep])
  editingStepIndex.value = tempSequence.value.length - 1 // 自动选中新步骤
}

// 编辑：删除当前步骤
function removeStep(index: number) {
  if (tempSequence.value.length <= 1)
    return // 至少保留一步

  tempSequence.value.splice(index, 1)
  // 修正选中索引
  if (editingStepIndex.value >= tempSequence.value.length) {
    editingStepIndex.value = tempSequence.value.length - 1
  }
}
</script>

<template>
  <div class="text-white flex flex-col h-full w-full relative overflow-hidden">
    <!-- 顶部工具栏：Tab 切换与配置按钮 -->
    <!-- flex-none 占据空间，pt-4 提供顶部内边距 -->
    <div class="pt-4 flex flex-none w-full items-start justify-center relative z-20">
      <!-- Tab 切换 -->
      <div class="p-1 rounded-lg bg-black/30 flex shadow-lg backdrop-blur-md">
        <button
          class="text-sm font-medium px-4 py-1.5 rounded transition-all"
          :class="engineVariant === 'sealevel' ? 'bg-teal-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'"
          @click="engineVariant = 'sealevel'"
        >
          Merlin 1D 海平面
        </button>
        <button
          class="text-sm font-medium px-4 py-1.5 rounded transition-all"
          :class="engineVariant === 'vacuum' ? 'bg-teal-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'"
          @click="engineVariant = 'vacuum'"
        >
          Merlin 1D 真空版
        </button>
      </div>

      <!-- 右上角：序列配置按钮 (绝对定位在工具栏容器内) -->
      <div class="right-4 top-4 absolute">
        <button
          class="btn bg-gray-700 flex gap-2 items-center hover:bg-gray-600"
          @click="openConfig"
        >
          <div i-carbon-settings />
          序列配置
        </button>
      </div>
    </div>

    <!-- 主内容区域：可视化 -->
    <!-- flex-1 自动占据剩余空间 -->
    <div class="flex flex-1 min-h-0 w-full items-center justify-center relative z-0">
      <div class="transition-all duration-500">
        <!-- 使用提取后的组件 -->
        <RocketEngine
          :variant="engineVariant"
          :active-ids="currentActiveEngines"
        />
      </div>
    </div>

    <!-- 底部控制按钮 -->
    <div class="pb-12 pt-4 bg-inherit flex flex-none flex-col gap-4 w-full items-center z-10">
      <div class="text-xl font-mono opacity-80">
        Step: {{ currentStepIndex + 1 }} / {{ sequence.length }}
      </div>

      <div class="flex gap-4">
        <button
          v-if="currentStepIndex > 0"
          class="btn bg-gray-600 hover:bg-gray-500"
          @click="resetSequence"
        >
          重置
        </button>

        <button
          class="text-lg btn font-bold px-8 py-2"
          :class="isLastStep ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-teal-600 hover:bg-teal-500'"
          :disabled="isLastStep"
          @click="nextStep"
        >
          {{ isLastStep ? '已结束' : '下一步' }}
        </button>
      </div>
    </div>

    <!-- 弹窗：序列配置 Dialog -->
    <div v-if="isConfigOpen" class="bg-black/60 flex items-center inset-0 justify-center fixed z-50 backdrop-blur-sm">
      <div class="border border-gray-600 rounded-xl bg-[#3a4563] flex h-140 w-200 shadow-2xl overflow-hidden">
        <!-- 左侧：步骤列表 -->
        <div class="border-r border-gray-600 bg-[#2d364d] flex flex-col w-1/3">
          <div class="text-lg font-bold p-4 border-b border-gray-600 flex items-center justify-between">
            <span class="flex flex-col">
              <span>节点序列</span>
              <span class="text-xs text-gray-400 font-normal mt-0.5">
                {{ engineVariant === 'sealevel' ? 'Merlin 1D' : 'Merlin Vacuum' }}
              </span>
            </span>
            <button class="text-sm icon-btn" title="添加节点" @click="addStep">
              <div i-carbon-add-filled class="text-xl text-teal-400" />
            </button>
          </div>

          <div class="p-2 flex-1 overflow-y-auto space-y-2">
            <div
              v-for="(step, idx) in tempSequence"
              :key="idx"
              class="p-3 rounded flex cursor-pointer transition-colors items-center justify-between"
              :class="editingStepIndex === idx ? 'bg-teal-700 text-white' : 'bg-gray-700/50 hover:bg-gray-700'"
              @click="editingStepIndex = idx"
            >
              <span class="font-mono">Step {{ idx + 1 }}</span>
              <button
                v-if="tempSequence.length > 1"
                class="text-gray-400 px-2 hover:text-red-400"
                @click.stop="removeStep(idx)"
              >
                <div i-carbon-trash-can />
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：编辑器 -->
        <div class="flex flex-col w-2/3 relative">
          <div class="font-bold p-4 text-center border-b border-gray-600">
            配置 Step {{ editingStepIndex + 1 }} 状态
            <span class="text-xs text-gray-400 font-normal mt-1 block">点击圆圈切换开启/关闭</span>
          </div>

          <div class="bg-[#3a4563] flex flex-1 items-center justify-center">
            <!-- 可交互的 SVG 组件 -->
            <div class="scale-90">
              <RocketEngine
                :variant="engineVariant"
                :active-ids="editingActiveEngines"
                interactive
                @toggle="toggleEngineState"
              />
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div class="p-4 border-t border-gray-600 bg-[#2d364d] flex gap-3 justify-end">
            <button class="btn bg-gray-600 hover:bg-gray-500" @click="closeConfig">
              取消
            </button>
            <button class="btn" @click="saveConfig">
              保存序列
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
