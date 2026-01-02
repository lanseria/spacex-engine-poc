<script setup lang="ts">
const props = defineProps<{
  activeIds: number[]
  interactive: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
}>()

const { getFill, interactiveClass, handleClick } = useEngineUtils(props, emit)

const BOOSTER_ANGLES = [45, 135, 225, 315]
</script>

<template>
  <g class="transition-colors duration-300">
    <!-- 背景基础 -->
    <circle r="230" cx="0" cy="0" fill="url(#blurGradientMain)" />

    <circle r="100" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />
    <!-- 芯一级引擎 (ID: 0, 1) -->
    <circle
      r="40" cx="-50" cy="0"
      :fill="getFill(0)"
      class="transition-all duration-300"
      :class="interactiveClass"
      @click="handleClick(0)"
    />
    <circle
      r="40" cx="50" cy="0"
      :fill="getFill(1)"
      class="transition-all duration-300"
      :class="interactiveClass"
      @click="handleClick(1)"
    />
    <!-- 助推器 (ID: 2-5) -->
    <g v-for="(angle, idx) in BOOSTER_ANGLES" :key="idx" :transform="`rotate(${angle}) translate(0, -164)`">
      <circle r="60" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />
      <circle
        r="40" cx="0" cy="0"
        :fill="getFill(idx + 2)"
        class="transition-all duration-300"
        :class="interactiveClass"
        @click="handleClick(idx + 2)"
      />
    </g>
  </g>
</template>
