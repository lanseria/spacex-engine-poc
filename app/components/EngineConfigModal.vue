<script setup lang="ts">
import type { EngineVariant } from '~/types/engine'
import { ENGINE_LAYOUTS } from '~/types/engine'

const props = defineProps<{
  modelValue: boolean
  initialVariant: EngineVariant
  // 传入一个函数来获取某类型的初始序列，避免深拷贝逻辑散落在外
  getSequenceData: (variant: EngineVariant) => number[][]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'save', payload: { variant: EngineVariant, sequence: number[][] }): void
}>()

// 编辑态状态
const tempVariant = ref<EngineVariant>('sealevel')
const tempSequence = ref<number[][]>([])
const editingStepIndex = ref(0)

// 监听弹窗打开，初始化数据
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    tempVariant.value = props.initialVariant
    loadSequenceForVariant(tempVariant.value)
  }
})

// 监听内部布局切换
watch(tempVariant, (newVal) => {
  if (props.modelValue)
    loadSequenceForVariant(newVal)
})

function loadSequenceForVariant(variant: EngineVariant) {
  // 深拷贝
  const data = props.getSequenceData(variant)
  tempSequence.value = JSON.parse(JSON.stringify(data))
  editingStepIndex.value = 0
}

const editingActiveEngines = computed(() => {
  return tempSequence.value[editingStepIndex.value] || []
})

// 编辑逻辑
function toggleEngineState(engineId: number) {
  const step = tempSequence.value[editingStepIndex.value]
  if (!step)
    return
  const index = step.indexOf(engineId)
  if (index > -1)
    step.splice(index, 1)
  else
    step.push(engineId)
}

function addStep() {
  const lastStep = tempSequence.value[tempSequence.value.length - 1] || []
  tempSequence.value.push([...lastStep])
  editingStepIndex.value = tempSequence.value.length - 1
}

function removeStep(index: number) {
  if (tempSequence.value.length <= 1)
    return
  tempSequence.value.splice(index, 1)
  if (editingStepIndex.value >= tempSequence.value.length)
    editingStepIndex.value = tempSequence.value.length - 1
}

function handleClose() {
  emit('update:modelValue', false)
}

function handleSave() {
  // 深拷贝传出
  emit('save', {
    variant: tempVariant.value,
    sequence: JSON.parse(JSON.stringify(tempSequence.value)),
  })
  handleClose()
}
</script>

<template>
  <div v-if="modelValue" class="bg-black/60 flex items-center inset-0 justify-center fixed z-50 backdrop-blur-sm">
    <div class="border border-gray-600 rounded-xl bg-[#3a4563] flex flex-row h-140 w-220 shadow-2xl overflow-hidden">
      <!-- 左侧：设置面板 -->
      <div class="border-r border-gray-600 bg-[#2d364d] flex flex-none flex-col w-80">
        <!-- 1. 布局选择 -->
        <div class="p-4 border-b border-gray-600">
          <label class="text-xs text-gray-400 tracking-wider font-bold mb-2 block uppercase">
            发动机布局
          </label>
          <div class="space-y-2">
            <label
              v-for="layout in ENGINE_LAYOUTS" :key="layout.id"
              class="p-2 border rounded flex gap-3 cursor-pointer transition-all items-center"
              :class="tempVariant === layout.id ? 'bg-teal-900/30 border-teal-500' : 'border-gray-600 hover:bg-gray-700'"
            >
              <input v-model="tempVariant" type="radio" :value="layout.id" class="hidden">
              <div class="border rounded-full flex h-4 w-4 items-center justify-center" :class="tempVariant === layout.id ? 'border-teal-400' : 'border-gray-500'">
                <div v-if="tempVariant === layout.id" class="rounded-full bg-teal-400 h-2 w-2" />
              </div>
              <span class="text-sm">{{ layout.name }}</span>
            </label>
          </div>
        </div>

        <!-- 2. 序列列表标题 -->
        <div class="px-4 py-3 border-b border-gray-600 bg-[#252b3d] flex items-center justify-between">
          <span class="text-sm text-gray-300 font-bold">点火序列步骤</span>
          <button class="text-xs icon-btn flex gap-1 items-center hover:text-teal-400" @click="addStep">
            <div i-carbon-add-filled />
            添加
          </button>
        </div>

        <!-- 3. 序列列表内容 -->
        <div class="p-2 flex-1 overflow-y-auto space-y-1">
          <div
            v-for="(step, idx) in tempSequence"
            :key="idx"
            class="group px-3 py-2 rounded flex cursor-pointer transition-colors items-center justify-between"
            :class="editingStepIndex === idx ? 'bg-teal-700 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'"
            @click="editingStepIndex = idx"
          >
            <div class="flex gap-3 items-center">
              <span class="text-xs font-mono opacity-50 w-4">{{ idx + 1 }}</span>
              <span class="text-sm font-medium">Step {{ idx + 1 }}</span>
            </div>
            <button
              v-if="tempSequence.length > 1"
              class="text-gray-400 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
              @click.stop="removeStep(idx)"
            >
              <div i-carbon-trash-can />
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：可视化编辑器 -->
      <div class="bg-[#3a4563] flex flex-1 flex-col relative">
        <div class="px-6 border-b border-gray-600 flex h-12 items-center justify-between">
          <span class="text-gray-200 font-bold">
            配置 Step {{ editingStepIndex + 1 }}
          </span>
          <span class="text-xs text-teal-400 flex gap-1 items-center">
            <div i-carbon-touch-1 />
            点击部分以切换状态
          </span>
        </div>

        <div class="bg-black/20 flex flex-1 items-center justify-center relative overflow-hidden">
          <!-- 背景网格装饰 -->
          <div class="opacity-10 inset-0 absolute" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;" />

          <!-- 可交互的 SVG 组件 -->
          <div class="scale-100 transition-all duration-300">
            <RocketEngine
              :variant="tempVariant"
              :active-ids="editingActiveEngines"
              interactive
              @toggle="toggleEngineState"
            />
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="p-4 border-t border-gray-600 bg-[#2d364d] flex gap-3 justify-end z-10">
          <button class="btn bg-gray-600 hover:bg-gray-500" @click="handleClose">
            取消
          </button>
          <button class="btn font-bold pl-3 pr-5 flex gap-2 items-center" @click="handleSave">
            <div i-carbon-checkmark />
            保存并测试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
