import { computed, type Ref } from 'vue'
import { COOLDOWN_STATES, type CooldownStateName } from '../constants/animation'

interface CooldownValues {
  frozen: Ref<number>
  slow: Ref<number>
  haste: Ref<number>
}

interface CooldownStateResult {
  state: CooldownStateName
  colorClass: string
  priority: number
}

/**
 * Composable for managing cooldown state logic with priority-based selection
 */
export function useCooldownState(cooldownValues: CooldownValues) {

  /**
   * Determines the current cooldown state based on active effects
   * Uses priority system: frozen (3) > slow (2) > haste (1) > normal (0)
   */
  const cooldownState = computed<CooldownStateResult>(() => {
    const activeStates = []

    // Check each cooldown type and add to active states if value > 0
    if (cooldownValues.frozen.value > 0) {
      activeStates.push(COOLDOWN_STATES.frozen)
    }
    if (cooldownValues.slow.value > 0) {
      activeStates.push(COOLDOWN_STATES.slow)
    }
    if (cooldownValues.haste.value > 0) {
      activeStates.push(COOLDOWN_STATES.haste)
    }

    // If no active states, return normal
    if (activeStates.length === 0) {
      return COOLDOWN_STATES.normal
    }

    // Return the state with highest priority
    return activeStates.reduce((highest, current) =>
      current.priority > highest.priority ? current : highest
    )
  })

  /**
   * Current state name (frozen, slow, haste, normal)
   */
  const stateName = computed(() => cooldownState.value.state)

  /**
   * CSS class for the current cooldown state
   */
  const colorClass = computed(() => cooldownState.value.colorClass)

  /**
   * Check if a specific state is currently active
   */
  const isState = (state: CooldownStateName) => computed(() =>
    cooldownState.value.state === state
  )

  /**
   * Get all currently active states (useful for debugging)
   */
  const activeStates = computed(() => {
    const states: CooldownStateName[] = []
    if (cooldownValues.frozen.value > 0) states.push('frozen')
    if (cooldownValues.slow.value > 0) states.push('slow')
    if (cooldownValues.haste.value > 0) states.push('haste')
    return states.length > 0 ? states : ['normal']
  })

  return {
    cooldownState,
    stateName,
    colorClass,
    isState,
    activeStates
  }
}
