<script setup lang="ts">
const props = defineProps<{
  activeIds: number[]
  interactive: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
}>()

const { getFill, isActive, interactiveClass, handleClick } = useEngineUtils(props, emit)
</script>

<template>
  <g transform="scale(2)" class="transition-colors duration-300">
    <!-- 背景基础 (原逻辑移入) -->
    <circle r="110" cx="0" cy="0" fill="url(#blurGradientMain)" />
    <circle r="115" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="4" />

    <!-- ID 1: 外部喷管扩展段 (控制渐变) -->
    <circle
      r="80" cx="0" cy="0"
      fill="url(#vacuumGradient)"
      class="pointer-events-none transition-opacity duration-300"
      :class="isActive(0) ? 'opacity-100' : 'opacity-0'"
    />
    <!-- 交互轮廓 -->
    <circle
      r="86" cx="0" cy="0"
      fill="transparent"
      stroke="rgba(128,128,128,0.3)"
      stroke-width="2"
      class="transition-all duration-300"
      :class="interactiveClass"
      @click="handleClick(0)"
    />
    <!-- ID 0: 核心 -->
    <circle
      r="21" cx="0" cy="0"
      :fill="getFill(0)"
      class="pointer-events-none transition-all duration-300"
    />
  </g>
</template>
