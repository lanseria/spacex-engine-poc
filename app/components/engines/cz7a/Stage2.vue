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
  <g class="transition-colors duration-300">
    <!-- 背景基础 -->
    <circle r="230" cx="0" cy="0" fill="url(#blurGradientMain)" />

    <!-- 箭体轮廓 -->
    <circle r="200" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="5" />

    <!-- 左引擎 ID: 0, 右引擎 ID: 1 -->
    <g v-for="(offset, idx) in [-100, 100]" :key="idx">
      <!-- 渐变喷管 (随状态显示/隐藏) -->
      <circle
        :r="80" :cx="offset" cy="0"
        fill="url(#vacuumGradient)"
        class="pointer-events-none transition-opacity duration-300"
        :class="isActive(idx) ? 'opacity-100' : 'opacity-0'"
      />
      <!-- 轮廓 & 交互区 -->
      <circle
        :r="86" :cx="offset" cy="0"
        fill="transparent"
        stroke="rgba(128,128,128,0.3)"
        stroke-width="3"
        class="transition-all duration-300"
        :class="interactiveClass"
        @click="handleClick(idx)"
      />
      <!-- 引擎核心 -->
      <circle
        :r="21" :cx="offset" cy="0"
        :fill="getFill(idx)"
        class="pointer-events-none transition-all duration-300"
      />
    </g>
  </g>
</template>
