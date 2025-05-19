import { gsap } from 'gsap'
import type { ChainedCooldownEvent } from '../../utils/generateChainedCooldownEvents'


export function useCooldown(timeline: gsap.core.Timeline, cooldownEvents: ChainedCooldownEvent[]) {
  const cooldown = ref(100)
  const cooldownDuration = ref(0)
  const slow = ref(0)
  const slowSource = ref<string>("slow")
  const haste = ref(0)
  const hasteSource = ref<string>("haste")
  const frozen = ref(0)
  const frozenSource = ref<string>("freeze")

  const cardTimeline = gsap.timeline()
  timeline.add(cardTimeline, 0)

  onMounted(() => {
    cooldownEvents.forEach((event) => {
      animateCooldown(event)
    })
  })

  function animateCooldown(event: ChainedCooldownEvent) {
    const timeChunks = event.chunks

    const modifierTimeline = gsap.timeline()

    const durationTimeline = gsap.timeline()
    const chunkTimeline = gsap.timeline()
    const cooldownTimeline = gsap.timeline({
      onStart: () => {
        cooldown.value = 100
      },
    })

    cooldownTimeline.add(chunkTimeline, 0)
    cooldownTimeline.add(durationTimeline, 0)
    cooldownTimeline.add(modifierTimeline, 0)
    cardTimeline.add(cooldownTimeline)

    durationTimeline.fromTo(cooldownDuration, {
      value: event.lifetime[event.lifetime.length - 1],
    }, {
      value: 0,
      duration: event.lifetime[event.lifetime.length - 1],
      ease: 'none',
      onComplete: () => {
        cooldown.value = 100
      },
    }, 0)

    timeChunks.forEach((chunk) => {
      const duration = chunk.duration
      const toPercent = chunk.to

      const animationProps = {
        toPercent,
        duration,
        sourceName: `${chunk.type}-${chunk.sourceIndex}`,
      }

      if (chunk.type === 'base') {
        gsapBase(animationProps)
      } else if (chunk.type === 'slow') {
        gsapSlow(animationProps)
      } else if (chunk.type === 'haste') {
        gsapHaste(animationProps)
      } else if (chunk.type === "freeze") {
        gsapFreeze(animationProps)
      }
    })

    interface AnimationProp {
      toPercent: number
      duration: number
      sourceName: string
    }

    function gsapBase({
      toPercent,
      duration,
    }: AnimationProp) {
      chunkTimeline.to(cooldown, {
        value: toPercent,
        duration: duration,
        ease: 'none',
      })
    }

    function gsapSlow({
      toPercent,
      duration,
      sourceName,
    }: AnimationProp) {
      chunkTimeline.to(cooldown, {
        value: toPercent,
        duration: duration,
        ease: 'none',
        onStart: () => {
          modifierTimeline.fromTo(slow, {
            value: duration,
          }, {
            value: 0,
            duration: duration,
            ease: 'none',
            onStart: () => {
              slowSource.value = sourceName || "slow"
            },
            onComplete: () => {
              slowSource.value = "slow"
            },
          })
        },
      })
    }

    function gsapHaste({
      toPercent,
      duration,
      sourceName,
    }: AnimationProp) {
      chunkTimeline.to(cooldown, {
        value: toPercent,
        duration: duration,
        ease: 'none',
        onStart: () => {
          modifierTimeline.fromTo(haste, {
            value: duration,
          }, {
            value: 0,
            duration: duration,
            ease: 'none',
            onStart: () => {
              hasteSource.value = sourceName || "haste"
            },
            onComplete: () => {
              hasteSource.value = "haste"
            },
          })
        },
      })
    }

    function gsapFreeze({
      toPercent,
      duration,
      sourceName,
    }: AnimationProp) {
      chunkTimeline.to(cooldown, {
        value: toPercent,
        duration: duration,
        ease: 'none',
        onStart: () => {
          modifierTimeline.fromTo(frozen, {
            value: duration,
          }, {
            value: 0,
            duration: duration,
            ease: 'none',
            onStart: () => {
              frozenSource.value = sourceName || "freeze"
            },
            onComplete: () => {
              frozenSource.value = "freeze"
            },
          })
        },
      })
    }
  }

  return {
    cooldown,
    cooldownDuration,
    slow,
    slowSource,
    haste,
    hasteSource,
    frozen,
    frozenSource,
  }
}
