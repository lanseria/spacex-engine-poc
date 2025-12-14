<script setup lang="ts">
// 引擎状态颜色定义
const COLOR_ON = 'rgba(255,255,255,0.9)'
const COLOR_OFF = 'rgba(128,128,128,0.3)'

// 引擎定义：0为中心，1-8为周围一圈
const SURROUNDING_ANGLES = Array.from({ length: 8 }, (_, i) => 22.5 + i * 45)

// ------------------- 状态数据 -------------------

// 序列数据：使用 useLocalStorage 持久化存储
// 每个元素是一个包含激活引擎ID的数组
const sequence = useLocalStorage<number[][]>('rocket-launch-sequence', [[]])
const currentStepIndex = ref(0)

// 弹窗控制
const isConfigOpen = ref(false)

// 编辑态数据（深拷贝用于编辑，不直接修改原序列）
const tempSequence = ref<number[][]>([])
const editingStepIndex = ref(0)

// ------------------- 计算属性 -------------------

// 当前展示的激活引擎列表（主界面用）
const currentActiveEngines = computed(() => {
  // 防止越界（当本地存储的序列变短时）
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

// 获取某个引擎的填充颜色
function getEngineColor(engineId: number, activeList: number[]) {
  return activeList.includes(engineId) ? COLOR_ON : COLOR_OFF
}

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
    <!-- 右上角：序列配置按钮 (保持绝对定位，浮动在最上层) -->
    <div class="right-4 top-4 absolute z-20">
      <button
        class="btn bg-gray-700 flex gap-2 items-center hover:bg-gray-600"
        @click="openConfig"
      >
        <div i-carbon-settings />
        序列配置
      </button>
    </div>

    <!-- 主内容区域：Flex 布局 -->
    <!-- 上半部分：火箭引擎可视化 (自动占据剩余空间并居中) -->
    <div class="flex flex-1 min-h-0 w-full items-center justify-center relative z-0">
      <div class="transition-all duration-500">
        <svg width="300" height="300" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="blurGradientMain" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stop-color="#000000" stop-opacity="0.5" />
              <stop offset="30%" stop-color="#000000" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.05" />
            </radialGradient>
          </defs>

          <g transform="translate(125, 125)">
            <!-- 背景圆 -->
            <circle r="110" cx="0" cy="0" fill="url(#blurGradientMain)" />
            <circle r="115" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />

            <!-- 引擎组 -->
            <g class="transition-colors duration-300">
              <!-- 中心引擎 (ID: 0) -->
              <circle
                r="21" cx="0" cy="0"
                :fill="getEngineColor(0, currentActiveEngines)"
                class="transition-all duration-300"
              />

              <!-- 周围8个引擎 (ID: 1-8) -->
              <g v-for="(angle, index) in SURROUNDING_ANGLES" :key="index">
                <circle
                  r="21" cx="0" cy="-70"
                  :transform="`rotate(${angle})`"
                  :fill="getEngineColor(index + 1, currentActiveEngines)"
                  class="transition-all duration-300"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>

    <!-- 下半部分：底部控制按钮 (作为 Flex 项目存在，不再重叠) -->
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
            <span>节点序列</span>
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
            <!-- 可交互的 SVG -->
            <svg width="220" height="220" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(125, 125)">
                <circle r="110" cx="0" cy="0" fill="rgba(0,0,0,0.2)" />
                <circle r="115" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />

                <!-- 中心引擎 (点击切换) -->
                <circle
                  r="21" cx="0" cy="0"
                  :fill="getEngineColor(0, editingActiveEngines)"
                  class="cursor-pointer hover:stroke-2 hover:stroke-teal-400"
                  @click="toggleEngineState(0)"
                />

                <!-- 周围引擎 (点击切换) -->
                <g v-for="(angle, index) in SURROUNDING_ANGLES" :key="index">
                  <circle
                    r="21" cx="0" cy="-70"
                    :transform="`rotate(${angle})`"
                    :fill="getEngineColor(index + 1, editingActiveEngines)"
                    class="cursor-pointer hover:stroke-2 hover:stroke-teal-400"
                    @click="toggleEngineState(index + 1)"
                  />
                  <!-- 添加索引文字辅助辨识 -->
                  <text
                    y="-70"
                    :transform="`rotate(${angle})`"
                    text-anchor="middle"
                    alignment-baseline="middle"
                    fill="#333"
                    font-size="10"
                    class="pointer-events-none select-none"
                  >
                    {{ index + 1 }}
                  </text>
                </g>
                <text x="0" y="0" text-anchor="middle" alignment-baseline="middle" fill="#333" font-size="10" class="pointer-events-none select-none">0</text>
              </g>
            </svg>
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
