import { ref, useTemplateRef, type Ref } from 'vue'

interface SplineRefs {
  splinePath: Ref<SVGPathElement | null>
  startPulse: Ref<HTMLElement | null>
  endPulse: Ref<HTMLElement | null>
  cardEl: Ref<HTMLElement | null>
}

/**
 * Composable for managing spline-related template refs with proper typing
 */
export function useSplineRefs() {
  // Use regular refs for spline elements that are set via component events
  const splinePath = ref<SVGPathElement | null>(null)
  const startPulse = ref<HTMLElement | null>(null)
  const endPulse = ref<HTMLElement | null>(null)
  // Use useTemplateRef for the main card element
  const cardEl = useTemplateRef<HTMLElement | null>('cardEl')

  /**
   * Check if all required refs are available for animation
   */
  const allRefsReady = computed(() =>
    splinePath.value !== null &&
    startPulse.value !== null &&
    endPulse.value !== null
  )

  /**
   * Check if card element ref is ready for spline calculations
   */
  const cardElReady = computed(() => cardEl.value !== null)

  /**
   * Get all refs as a single object for easy passing to other composables
   */
  const refs = computed<SplineRefs>(() => ({
    splinePath,
    startPulse,
    endPulse,
    cardEl
  }))

  return {
    splinePath,
    startPulse,
    endPulse,
    cardEl,
    allRefsReady,
    cardElReady,
    refs
  }
}
