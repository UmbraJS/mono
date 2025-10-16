import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { DASH_ANIMATION } from '../constants/animation'

gsap.registerPlugin(MotionPathPlugin)

interface AnimationRefs {
  splinePath: Ref<SVGPathElement | null>
  startPulse: Ref<HTMLElement | null>
  endPulse: Ref<HTMLElement | null>
  maskElement: Ref<SVGRectElement | null>
}

interface AnimationTimelineResult {
  timeline: gsap.core.Timeline
  totalDuration: number
}

/**
 * Composable for managing motion path animation timeline with gradient mask
 */
export function useMotionPathTimeline(refs: AnimationRefs) {

  /**
   * Creates a GSAP timeline for the motion path animation effect
   * Phases: Growth (0-30%) -> Travel (30-70%) -> Shrink (70-100%)
   */
  function buildMotionPathTimeline(): AnimationTimelineResult {
    const { splinePath, startPulse, endPulse, maskElement } = refs

    const durations = calculatePhaseDurations()
    const timeline = gsap.timeline({
      defaults: { ease: 'none' }
    })

    if (!splinePath.value || !startPulse.value || !endPulse.value || !maskElement.value) {
      return {
        timeline,
        totalDuration: 0
      }
    }

    // Reset all elements to their initial state
    gsap.set(startPulse.value, { scale: DASH_ANIMATION.PULSE_SIZE, autoAlpha: 0 })
    gsap.set(endPulse.value, { scale: 0, autoAlpha: 1 })

    // Position mask at start of path (it will be animated along the path)
    gsap.set(maskElement.value, {
      x: 0,
      y: 0,
      transformOrigin: '50% 50%'
    })

    // Phase 1: Initial growth and mask animation start
    addGrowthPhase(timeline, durations, {
      startPulse: startPulse.value,
      maskElement: maskElement.value
    })

    // Phase 2: Mask travels along the path
    addTravelPhase(timeline, durations, {
      maskElement: maskElement.value,
      splinePath: splinePath.value
    })

    // Phase 3: End pulse appears
    addShrinkPhase(timeline, durations, {
      endPulse: endPulse.value
    })

    return {
      timeline,
      totalDuration: DASH_ANIMATION.TOTAL_DURATION
    }
  }

  /**
   * Calculate phase durations based on configuration
   */
  function calculatePhaseDurations() {
    const growthDuration = (DASH_ANIMATION.TOTAL_DURATION * DASH_ANIMATION.PULSE_PERCENT) / 100
    const travelDuration = ((100 - DASH_ANIMATION.PULSE_PERCENT * 2) / 100) * DASH_ANIMATION.TOTAL_DURATION
    const shrinkDuration = growthDuration // Symmetric timing

    return { growth: growthDuration, travel: travelDuration, shrink: shrinkDuration }
  }

  /**
   * Add growth phase animations (pulse grows, mask starts at beginning)
   */
  function addGrowthPhase(
    timeline: gsap.core.Timeline,
    durations: ReturnType<typeof calculatePhaseDurations>,
    elements: { startPulse: HTMLElement; maskElement: SVGRectElement }
  ) {
    // Start pulse animation
    timeline.fromTo(
      elements.startPulse,
      {
        scale: DASH_ANIMATION.PULSE_SIZE,
        autoAlpha: 0,
        transformOrigin: '50% 50%',
      },
      {
        scale: 0,
        autoAlpha: 1,
        duration: durations.growth,
        onStart: () => {
          console.log('Motion path animation growth phase started')
        },
      },
      0
    )

    // Mask appears at start
    timeline.fromTo(
      elements.maskElement,
      {
        opacity: 0,
        scale: 0.5
      },
      {
        opacity: 1,
        scale: 1,
        duration: durations.growth * 0.5,
      },
      0
    )

    timeline.addLabel('GrowthEnd', durations.growth)
  }

  /**
   * Add travel phase animation (mask moves along path using template refs)
   */
  function addTravelPhase(
    timeline: gsap.core.Timeline,
    durations: ReturnType<typeof calculatePhaseDurations>,
    elements: { maskElement: SVGRectElement; splinePath: SVGPathElement }
  ) {
    // Animate mask along the path using direct element references (no IDs needed!)
    timeline.to(
      elements.maskElement,
      {
        duration: durations.travel,
        motionPath: {
          path: elements.splinePath,
          autoRotate: true,
          alignOrigin: [0.5, 0.5] // Center the mask on the path
        }
      },
      durations.growth
    )

    timeline.addLabel('TravelEnd', durations.growth + durations.travel)
  }

  /**
   * Add shrink phase animations (end pulse appears, mask fades)
   */
  function addShrinkPhase(
    timeline: gsap.core.Timeline,
    durations: ReturnType<typeof calculatePhaseDurations>,
    elements: { endPulse: HTMLElement }
  ) {
    const shrinkStartTime = durations.growth + durations.travel

    // End pulse animation
    timeline.fromTo(
      elements.endPulse,
      {
        scale: 0,
        autoAlpha: 1,
        transformOrigin: '50% 50%'
      },
      {
        scale: DASH_ANIMATION.PULSE_SIZE,
        autoAlpha: 0,
        duration: durations.shrink
      },
      shrinkStartTime
    )

    timeline.addLabel('ShrinkEnd', DASH_ANIMATION.TOTAL_DURATION)
  }

  return {
    buildMotionPathTimeline
  }
}
