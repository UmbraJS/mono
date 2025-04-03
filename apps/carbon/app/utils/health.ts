export function terminalHealth(
  healthBars: globalThis.Ref<number, number>[],
  options?: {
    tickAmount?: number
    tickRate?: number
  },
) {
  const tickRate = options?.tickRate ?? 100
  const tickAmount = options?.tickAmount ?? 0.1
  return setInterval(() => {
    healthBars.forEach((healthBar) => (healthBar.value -= tickAmount))
  }, tickRate)
}
