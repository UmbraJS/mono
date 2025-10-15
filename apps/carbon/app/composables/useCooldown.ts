import { gsap } from 'gsap'
import type { OutputChunk } from '../../utils/time/types';
import { useAudio } from '../stores/useAudio'
import { useSimulationInject } from '~/composables/useSimulationProvider'
// import { GSDevTools } from 'gsap/GSDevTools';

// gsap.registerPlugin(GSDevTools);

interface UseCooldownOptions {
  attackTimelineFactory: () => {
    timeline: gsap.core.Timeline
    totalDuration: number
  }
  onAttack: () => void
}

export function useCooldown(cardSimulation: OutputChunk[], callbackOrOptions: UseCooldownOptions) {
  const audio = useAudio()

  const cooldownValue = ref(100)
  const castStart = ref(0)
  const cooldownDuration = ref(0)
  const slow = ref(0)
  const slowSource = ref<string>('slow')
  const haste = ref(0)
  const hasteSource = ref<string>('haste')
  const frozen = ref(0)
  const frozenSource = ref<string>('freeze')

  const simulation = useSimulationInject()

  const cardTimeline = gsap.timeline()


  if (simulation) {
    simulation.timeline.add(cardTimeline, 0)
  }

  onMounted(() => {
    const segments = getSegments(cardSimulation)

    // const firstSegment = segments[0]
    // if (!firstSegment) return
    // animateCooldown(firstSegment)

    segments.forEach((segment) => {
      animateCooldown(segment)
    })

    // GSDevTools.create({ animation: cardTimeline });
  })

  function animateCooldown(segment: Segment) {
    const timelineChunks = segment.chunks

    const durationTimeline = gsap.timeline()
    const chunkTimeline = gsap.timeline()
    const cooldownTimeline = gsap.timeline({
      onStart: () => {
        cooldownValue.value = 100
      },
    })

    cooldownTimeline.add(chunkTimeline, 0)
    cooldownTimeline.add(durationTimeline, 0)

    cardTimeline.add(cooldownTimeline)

    durationTimeline.fromTo(cooldownDuration, {
      value: segment.duration,
    }, {
      value: 0,
      duration: segment.duration,
      ease: 'none',
      onStart: () => {
        // Get attack timeline BEFORE creating the duration timeline so we can position it correctly
        const atk = callbackOrOptions.attackTimelineFactory?.()
        if (atk) {
          // Position attack timeline so it ends exactly when cooldown ends
          const attackStartTime = Math.max(0, segment.duration - atk.totalDuration)
          cooldownTimeline.add(atk.timeline, attackStartTime)
          cooldownTimeline.addLabel('CastStart', attackStartTime)
          const totalDuration = segment.duration
          const castStartAsAPercentageOfTotalDuration = (attackStartTime / totalDuration) * 100
          castStart.value = castStartAsAPercentageOfTotalDuration
        }
      },
      onComplete: () => {
        cooldownValue.value = 100
        audio.playPunchSound()
        callbackOrOptions.onAttack()
        cooldownTimeline.addLabel('CastComplete', '>')
      },
    }, 0)

    durationTimeline.addLabel('CooldownStart', 0)
    durationTimeline.addLabel('CooldownEnd', segment.duration)

    timelineChunks.forEach((chunk) => {
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
      } else if (chunk.type === 'freeze') {
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
      chunkTimeline.to(cooldownValue, {
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
      const slowTimeline = gsap.timeline()

      chunkTimeline.to(cooldownValue, {
        value: toPercent,
        duration: duration,
        ease: 'none',
        onStart: () => {
          slowTimeline.fromTo(slow, {
            value: duration,
          }, {
            value: 0,
            duration: duration,
            ease: 'none',
            onStart: () => {
              audio.playCardFlip()
              slowSource.value = sourceName || 'slow'
            },
            onComplete: () => {
              slowSource.value = 'slow'
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
      const hasteTimeline = gsap.timeline()

      chunkTimeline.to(cooldownValue, {
        value: toPercent,
        duration: duration,
        ease: 'none',
        onStart: () => {
          hasteTimeline.fromTo(haste, {
            value: duration,
          }, {
            value: 0,
            duration: duration,
            ease: 'none',
            onStart: () => {
              audio.playCardFlip()
              hasteSource.value = sourceName || 'haste'
            },
            onComplete: () => {
              hasteSource.value = 'haste'
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
      const freezeTimeline = gsap.timeline()

      chunkTimeline.to(cooldownValue, {
        value: toPercent,
        duration: duration,
        ease: 'none',
        onStart: () => {
          freezeTimeline.fromTo(frozen, {
            value: duration,
          }, {
            value: 0,
            duration: duration,
            ease: 'none',
            onStart: () => {
              audio.playCardFlip()
              frozenSource.value = sourceName || 'freeze'
            },
            onComplete: () => {
              frozenSource.value = 'freeze'
            },
          })
        },
      })
    }
  }

  return {
    master: cardTimeline,
    cooldownValue,
    castStart,
    cooldownDuration,
    slow,
    slowSource,
    haste,
    hasteSource,
    frozen,
    frozenSource,
  }
}


interface Segment extends Pick<OutputChunk, 'start' | 'end' | 'duration'> {
  chunks: OutputChunk[]
}

function getSegments(chunks: OutputChunk[]): Segment[] {
  const segments: Segment[] = [];

  if (chunks.length === 0) return segments;

  const sortedChunks = [...chunks].sort((a, b) => a.start - b.start);
  let currentSegmentStartIndex = 0;

  for (let i = 1; i <= sortedChunks.length; i++) {
    const currentChunk = sortedChunks[i];

    // Check if this is the end of a segment
    const isEndOfSegment =
      i === sortedChunks.length || (currentChunk && currentChunk.from === 100);

    if (isEndOfSegment) {
      const segmentChunks = sortedChunks.slice(currentSegmentStartIndex, i);
      const first = segmentChunks[0];
      const last = segmentChunks[segmentChunks.length - 1];

      if (!first || !last) continue;

      const totalDuration = segmentChunks.reduce((sum, c) => sum + c.duration, 0);
      segments.push({
        start: first.start,
        end: last.end,
        duration: totalDuration,
        chunks: segmentChunks,
      });

      currentSegmentStartIndex = i;
    }
  }

  return segments;
}

