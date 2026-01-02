<script setup lang="ts">
import type { EngineVariant } from '~/types/engine'

interface Props {
  variant?: EngineVariant
  activeIds?: number[]
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'sealevel',
  activeIds: () => [],
  interactive: false,
})

const emit = defineEmits<{
  (e: 'toggle', id: number): void
}>()

// 颜色常量
const COLOR_ON = 'rgba(255,255,255,0.9)'
const COLOR_OFF = 'rgba(128,128,128,0.3)'

// 海平面版：周围一圈角度 (ID 1-8)
const SURROUNDING_ANGLES = Array.from({ length: 8 }, (_, i) => 22.5 + i * 45)

// 获取颜色
function getFill(id: number) {
  return props.activeIds.includes(id) ? COLOR_ON : COLOR_OFF
}

// 检查某个 ID 是否激活
function isActive(id: number) {
  return props.activeIds.includes(id)
}

// 点击处理
function handleClick(id: number) {
  if (props.interactive) {
    emit('toggle', id)
  }
}

// 交互样式类
const interactiveClass = computed(() =>
  props.interactive
    ? 'cursor-pointer hover:stroke-2 hover:stroke-teal-400'
    : 'pointer-events-none',
)
</script>

<template>
  <svg width="300" height="300" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
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

    <g transform="translate(125, 125)">
      <!-- 背景基础 -->
      <circle r="110" cx="0" cy="0" fill="url(#blurGradientMain)" />
      <circle r="115" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />

      <!-- 变体 A: Merlin 1D Sea Level (9发并联) -->
      <g v-if="variant === 'sealevel'" class="transition-colors duration-300">
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

      <!-- 变体 B: Merlin 1D Vacuum (单发真空版) -->
      <g v-else-if="variant === 'vacuum'" class="transition-colors duration-300">
        <!-- ID 1: 外部喷管扩展段 (控制渐变) -->
        <!-- 1. 渐变填充层 (状态激活时显示，未激活时隐藏) -->
        <circle
          r="80" cx="0" cy="0"
          fill="url(#vacuumGradient)"
          class="pointer-events-none transition-opacity duration-300"
          :class="isActive(1) ? 'opacity-100' : 'opacity-0'"
        />

        <!-- 2. 半径86的圈 (交互目标 & 轮廓) -->
        <!-- 点击此区域切换 ID 1 -->
        <circle
          r="86" cx="0" cy="0"
          fill="transparent"
          stroke="rgba(128,128,128,0.3)"
          stroke-width="3"
          class="transition-all duration-300"
          :class="interactiveClass"
          @click="handleClick(1)"
        />

        <!-- ID 0: 核心 (控制中心圆) -->
        <!-- 3. 中心21半径的圆 (核心) -->
        <!-- 注意：放在最后绘制以处于最上层，确保点击中心优先触发 ID 0 -->
        <circle
          r="21" cx="0" cy="0"
          :fill="getFill(0)"
          class="transition-all duration-300"
          :class="interactiveClass"
          @click="handleClick(0)"
        />
      </g>
    </g>
  </svg>
</template>
