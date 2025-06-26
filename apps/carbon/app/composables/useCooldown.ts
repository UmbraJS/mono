import { gsap } from 'gsap'
import type { OutputChunk } from '../../utils/time/types';

export function useCooldown(timeline: gsap.core.Timeline, chunks: OutputChunk[]) {
  const cooldown = ref(100)
  const cooldownDuration = ref(0)
  const slow = ref(0)
  const slowSource = ref<string>('slow')
  const haste = ref(0)
  const hasteSource = ref<string>('haste')
  const frozen = ref(0)
  const frozenSource = ref<string>('freeze')

  const cardTimeline = gsap.timeline()
  timeline.add(cardTimeline, 0)

  const cardSimulation = chunks

  onMounted(() => {
    const segments = getSegments(cardSimulation)
    segments.forEach((segment) => {
      animateCooldown(segment)
    })
  })

  function animateCooldown(segment: Segment) {
    const timelineChunks = segment.chunks

    const durationTimeline = gsap.timeline()
    const chunkTimeline = gsap.timeline()
    const cooldownTimeline = gsap.timeline({
      onStart: () => {
        cooldown.value = 100
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
      onComplete: () => {
        cooldown.value = 100
      },
    }, 0)

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
      const slowTimeline = gsap.timeline()

      chunkTimeline.to(cooldown, {
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
      // cooldownTimeline.add(hasteTimeline, 0)

      chunkTimeline.to(cooldown, {
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

      chunkTimeline.to(cooldown, {
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
    const prevChunk = sortedChunks[i - 1];

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

