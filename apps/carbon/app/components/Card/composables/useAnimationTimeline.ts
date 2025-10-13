import { gsap } from 'gsap'
import { DASH_ANIMATION } from '../constants/animation'
import { GSDevTools } from 'gsap/GSDevTools';

gsap.registerPlugin(GSDevTools);
interface AnimationRefs {
  splinePath: Ref<SVGPathElement | null>
  startPulse: Ref<HTMLElement | null>
  endPulse: Ref<HTMLElement | null>
}

interface AnimationTimelineResult {
  timeline: gsap.core.Timeline
  totalDuration: number
}

/**
 * Composable for managing dash animation timeline with proper phase separation
 */
export function useAnimationTimeline(refs: AnimationRefs) {

  /**
   * Creates a GSAP timeline for the dash animation effect
   * Phases: Growth (0-30%) -> Travel (30-70%) -> Shrink (70-100%)
   */
  function buildDashTimeline(): AnimationTimelineResult {
    const { splinePath, startPulse, endPulse } = refs

    const durations = calculatePhaseDurations()
    const timeline = gsap.timeline({
      defaults: { ease: 'none' }
    })

    if (!splinePath.value || !startPulse.value || !endPulse.value) {
      return {
        timeline,
        totalDuration: 0
      }
    }

    // Reset all elements to their initial state before creating the timeline
    gsap.set(splinePath.value, { drawSVG: '0% 0%' })
    gsap.set(startPulse.value, { scale: DASH_ANIMATION.PULSE_SIZE, autoAlpha: 0 })
    gsap.set(endPulse.value, { scale: 0, autoAlpha: 1 })


    // Phase 1: Initial growth and path drawing start
    addGrowthPhase(timeline, durations, { startPulse: startPulse.value, splinePath: splinePath.value })

    // Phase 2: Path travels across the screen
    addTravelPhase(timeline, durations, splinePath.value)

    // Phase 3: Path shrinks and end pulse appears
    addShrinkPhase(timeline, durations, { endPulse: endPulse.value, splinePath: splinePath.value })

    // GSDevTools removed to prevent conflicts when multiple timelines are created
    // GSDevTools.create({ animation: timeline });

    return {
      timeline,
      totalDuration: DASH_ANIMATION.TOTAL_DURATION - durations.shrink
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
   * Add growth phase animations (pulse grows, path starts drawing)
   */
  function addGrowthPhase(
    timeline: gsap.core.Timeline,
    durations: ReturnType<typeof calculatePhaseDurations>,
    elements: { startPulse: HTMLElement; splinePath: SVGPathElement }
  ) {
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
          console.log('Dash animation growth phase started')
        },
      },
      0
    )

    timeline.fromTo(
      elements.splinePath,
      { drawSVG: '0% 0%' },
      {
        duration: durations.growth,
        drawSVG: `0% ${DASH_ANIMATION.GROWTH_DRAW_PERCENT}%`
      },
      0
    )
  }

  /**
   * Add travel phase animation (path moves across screen)
   */
  function addTravelPhase(
    timeline: gsap.core.Timeline,
    durations: ReturnType<typeof calculatePhaseDurations>,
    splinePath: SVGPathElement
  ) {
    timeline.fromTo(
      splinePath,
      { drawSVG: `0% ${DASH_ANIMATION.GROWTH_DRAW_PERCENT}%` },
      {
        duration: durations.travel,
        drawSVG: `${DASH_ANIMATION.SHRINK_START_PERCENT}% 100%`
      },
      durations.growth
    )
  }

  /**
   * Add shrink phase animations (path completes, end pulse appears)
   */
  function addShrinkPhase(
    timeline: gsap.core.Timeline,
    durations: ReturnType<typeof calculatePhaseDurations>,
    elements: { endPulse: HTMLElement; splinePath: SVGPathElement }
  ) {
    const shrinkStartTime = durations.growth + durations.travel

    timeline.fromTo(
      elements.splinePath,
      { drawSVG: `${DASH_ANIMATION.SHRINK_START_PERCENT}% 100%` },
      {
        duration: durations.shrink,
        drawSVG: '100% 100%'
      },
      shrinkStartTime
    )

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
  }

  return {
    buildDashTimeline
  }
}
