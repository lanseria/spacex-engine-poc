export function useEngineUtils(
  props: { activeIds: number[], interactive: boolean },
  emit: (e: 'toggle', id: number) => void,
) {
  // 颜色常量
  const COLOR_ON = 'rgba(255,255,255,0.9)'
  const COLOR_OFF = 'rgba(128,128,128,0.3)'

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

  return {
    getFill,
    isActive,
    handleClick,
    interactiveClass,
  }
}
