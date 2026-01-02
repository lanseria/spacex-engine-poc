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

// SVG 配置：根据不同变体调整视口和中心偏移
const svgConfig = computed(() => {
  if (['cz7a', 'cz7a-stage2'].includes(props.variant || '')) {
    return {
      viewBox: '0 0 500 500',
      cx: 250,
      cy: 250,
      bgRadius: 230,
    }
  }
  return {
    viewBox: '0 0 250 250',
    cx: 125,
    cy: 125,
    bgRadius: 110,
  }
})

// CZ-7A 助推器角度: 45, 135, 225, 315
const BOOSTER_ANGLES = [45, 135, 225, 315]
</script>

<template>
  <svg :width="300" :height="300" :viewBox="svgConfig.viewBox" xmlns="http://www.w3.org/2000/svg">
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

    <g :transform="`translate(${svgConfig.cx}, ${svgConfig.cy})`">
      <!-- 背景基础 -->
      <circle :r="svgConfig.bgRadius" cx="0" cy="0" fill="url(#blurGradientMain)" />
      <circle v-if="!['cz7a', 'cz7a-stage2'].includes(variant || '')" :r="svgConfig.bgRadius + 5" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />

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
        <circle
          r="80" cx="0" cy="0"
          fill="url(#vacuumGradient)"
          class="pointer-events-none transition-opacity duration-300"
          :class="isActive(1) ? 'opacity-100' : 'opacity-0'"
        />
        <!-- 交互轮廓 -->
        <circle
          r="86" cx="0" cy="0"
          fill="transparent"
          stroke="rgba(128,128,128,0.3)"
          stroke-width="3"
          class="transition-all duration-300"
          :class="interactiveClass"
          @click="handleClick(1)"
        />
        <!-- ID 0: 核心 -->
        <circle
          r="21" cx="0" cy="0"
          :fill="getFill(0)"
          class="transition-all duration-300"
          :class="interactiveClass"
          @click="handleClick(0)"
        />
      </g>

      <!-- 变体 C: CZ-7A Stage 1 (芯一级 + 4助推) -->
      <g v-else-if="variant === 'cz7a'" class="transition-colors duration-300">
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
        <g v-for="(angle, idx) in BOOSTER_ANGLES" :key="idx" :transform="`rotate(${angle}) translate(0, -160)`">
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

      <!-- 变体 D: CZ-7A Stage 2 (二级双发真空版) -->
      <g v-else-if="variant === 'cz7a-stage2'" class="transition-colors duration-300">
        <!-- 箭体轮廓 -->
        <circle r="200" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />

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
    </g>
  </svg>
</template>
