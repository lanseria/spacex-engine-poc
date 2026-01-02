<script setup lang="ts">
const props = defineProps<{
  activeIds: number[]
  interactive: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
}>()

const { getFill, interactiveClass, handleClick } = useEngineUtils(props, emit)

const SURROUNDING_ANGLES = Array.from({ length: 8 }, (_, i) => 22.5 + i * 45)
</script>

<template>
  <!-- 原画布是250，现在是500，放大2倍以适配 -->
  <g transform="scale(2)" class="transition-colors duration-300">
    <!-- 背景基础 (原逻辑移入) -->
    <circle r="110" cx="0" cy="0" fill="url(#blurGradientMain)" />
    <circle r="115" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="4" />

    <!-- 中心引擎 (ID: 0) -->
    <circle
      r="21" cx="0" cy="0"
      :fill="getFill(0)"
      class="transition-all duration-300"
      :class="interactiveClass"
      @click="handleClick(0)"
    />

    <!-- 周围8个引擎 (ID: 1-8) -->
    <g v-for="(angle, index) in SURROUNDING_ANGLES" :key="index">
      <circle
        r="21" cx="0" cy="-70"
        :transform="`rotate(${angle})`"
        :fill="getFill(index + 1)"
        class="transition-all duration-300"
        :class="interactiveClass"
        @click="handleClick(index + 1)"
      />
    </g>
  </g>
</template>
