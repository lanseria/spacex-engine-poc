<script setup lang="ts">
import type { EngineVariant } from '~/types/engine'

// 引入逻辑 Composable
const {
  currentVariant,
  currentStepIndex,
  currentSequence,
  activeEngineIds,
  isLastStep,
  sequences,
  setVariant,
  saveSequence,
  nextStep,
  reset,
} = useEngineControl()

// 弹窗控制
const isConfigOpen = ref(false)

// 弹窗数据获取辅助函数
function getSequenceData(variant: EngineVariant) {
  return sequences[variant] || []
}

// 弹窗保存回调
function onConfigSave(payload: { variant: EngineVariant, sequence: number[][] }) {
  saveSequence(payload.variant, payload.sequence)
  setVariant(payload.variant)
}
</script>

<template>
  <div class="text-white flex flex-col h-full w-full relative overflow-hidden">
    <!-- 全局背景网格装饰 -->
    <!-- pointer-events-none 确保不阻挡点击，z-0 设为最底层 -->
    <div class="opacity-10 pointer-events-none inset-0 absolute z-0" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;" />

    <!-- 顶部工具栏 -->
    <div class="px-6 pt-6 flex flex-none w-full items-start justify-end relative z-20">
      <button
        class="btn border border-gray-600 bg-gray-700/50 flex flex gap-2 items-center backdrop-blur-md hover:bg-gray-600"
        @click="isConfigOpen = true"
      >
        <div class="i-carbon-settings" />
        配置
      </button>
    </div>

    <!-- 主内容区域：可视化 -->
    <!-- z-10 确保位于背景之上 -->
    <div class="flex flex-1 min-h-0 w-full items-center justify-center relative z-10">
      <div class="transition-all duration-500">
        <RocketEngine
          :variant="currentVariant"
          :active-ids="activeEngineIds"
        />
      </div>
    </div>

    <!-- 底部控制按钮 -->
    <div class="pb-12 pt-4 bg-inherit flex flex-none flex-col gap-4 w-full items-center z-20">
      <div class="text-xl font-mono opacity-80">
        Step: {{ currentStepIndex + 1 }} / {{ currentSequence.length }}
      </div>

      <div class="flex gap-4">
        <button
          v-if="currentStepIndex > 0"
          class="btn bg-gray-600 hover:bg-gray-500"
          @click="reset"
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

    <!-- 配置弹窗组件 -->
    <EngineConfigModal
      v-model="isConfigOpen"
      :initial-variant="currentVariant"
      :get-sequence-data="getSequenceData"
      @save="onConfigSave"
    />
  </div>
</template>
