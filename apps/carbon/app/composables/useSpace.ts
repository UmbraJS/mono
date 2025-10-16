import { gsap } from 'gsap'
import type { SpaceOutput } from '../../utils/matchSimulator'
import type { Character } from '../../types'

//TODO: We need to add some sort of health and shield change log system so that we can display number changes in the UI
//TODO: Once we have these change numbers we can more easily debug and verify that the health and shield changes are working correctly

export function useSpace(timeline: gsap.core.Timeline, space: Pick<SpaceOutput, 'healthLog' | 'shieldLog'>, characters: Character[]) {
  const maxHealth = characters.reduce((total, character) => total + character.maxHealth, 0)

  const health = ref(maxHealth)
  const healthDelayed = ref(0)
  const healthTimeline = gsap.timeline()
  timeline.add(healthTimeline, 0)

  const shield = ref(0)
  const shieldDelayed = ref(0)
  const shieldTimeline = gsap.timeline()
  timeline.add(shieldTimeline, 0)

  const morale = ref(0)
  const moraleDelayed = ref(0)

  space.healthLog.forEach(({ timestamp, newValue }) => {
    healthTimeline.to(health, {
      duration: 0.1,
      ease: 'power2.inOut',
      value: newValue,
      onStart: () => {
        healthTimeline.to(healthDelayed, {
          duration: 0.5,
          ease: 'power2.inOut',
          value: newValue,
        }, timestamp)
      }
    }, timestamp)
  })

  space.shieldLog.forEach(({ timestamp, newValue }) => {
    shieldTimeline.to(shield, {
      duration: 0.1,
      ease: 'power2.inOut',
      value: newValue,
      onStart: () => {
        shieldTimeline.to(shieldDelayed, {
          duration: 0.5,
          ease: 'power2.inOut',
          value: newValue,
        }, timestamp)
      }
    }, timestamp)
  })

  return {
    health,
    healthDelayed,
    shield,
    shieldDelayed,
    morale,
    moraleDelayed,
  }
}
