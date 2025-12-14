<script setup lang="ts">

</script>

<template>
  <div>
    <svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <!-- 定义渐变效果 -->
      <defs>
        <radialGradient id="blurGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.5" />
          <stop offset="30%" stop-color="#000000" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.05" />
        </radialGradient>
      </defs>

      <!-- 将坐标原点移动到画布中心 -->
      <g transform="translate(125, 125)">
        <!-- 最底部的黑色渐变模糊圆 -->
        <circle r="110" cx="0" cy="0" fill="url(#blurGradient)" />

        <circle r="115" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="3" />

        <!-- 内层圆组：共9个 -->
        <g fill="rgba(255,255,255,0.9)">
          <!-- 中心的一个圆 (半径 21px) -->
          <circle r="21" cx="0" cy="0" />

          <!-- 周围均匀分布的8个圆 -->
          <!-- 距离中心 70px (cy="-70") -->
          <!-- 起始角度 22.5度，递增 45度 -->

          <circle r="21" cx="0" cy="-70" transform="rotate(22.5)" />
          <circle r="21" cx="0" cy="-70" transform="rotate(67.5)" />
          <circle r="21" cx="0" cy="-70" transform="rotate(112.5)" />
          <circle r="21" cx="0" cy="-70" transform="rotate(157.5)" />
          <circle r="21" cx="0" cy="-70" transform="rotate(202.5)" />
          <circle r="21" cx="0" cy="-70" transform="rotate(247.5)" />
          <circle r="21" cx="0" cy="-70" transform="rotate(292.5)" />
          <circle r="21" cx="0" cy="-70" transform="rotate(337.5)" />
        </g>
      </g>
    </svg>
  </div>
</template>
