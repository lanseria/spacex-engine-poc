<script setup lang="ts">
import type { EngineVariant } from '~/types/engine'

interface Props {
  variant?: EngineVariant
  activeIds?: number[]
  interactive?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'falcon9b5-stage1',
  activeIds: () => [],
  interactive: false,
})

const emit = defineEmits<{
  (e: 'toggle', id: number): void
}>()

function onToggle(id: number) {
  emit('toggle', id)
}
</script>

<template>
  <svg width="300" height="300" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="blurGradientMain" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.5" />
        <stop offset="30%" stop-color="#000000" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.05" />
      </radialGradient>
      <!-- 真空版专用渐变：中心白色到边缘透明 -->
      <radialGradient id="vacuumGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- 统一坐标系中心：(250, 250) -->
    <g transform="translate(250, 250)">
      <!-- 猎鹰9号 -->
      <EnginesFalcon9Stage1
        v-if="variant === 'falcon9b5-stage1'"
        :active-ids="activeIds" :interactive="interactive" @toggle="onToggle"
      />
      <EnginesFalcon9Stage2
        v-else-if="variant === 'falcon9b5-stage2'"
        :active-ids="activeIds" :interactive="interactive" @toggle="onToggle"
      />

      <!-- 长征7号A -->
      <EnginesCz7aStage1
        v-else-if="variant === 'cz7a-stage1'"
        :active-ids="activeIds" :interactive="interactive" @toggle="onToggle"
      />
      <EnginesCz7aStage2
        v-else-if="variant === 'cz7a-stage2'"
        :active-ids="activeIds" :interactive="interactive" @toggle="onToggle"
      />
    </g>
  </svg>
</template>
