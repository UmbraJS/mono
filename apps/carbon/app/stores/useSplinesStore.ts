import { defineStore } from 'pinia'

export const useSplinesStore = defineStore('splines', () => {
  const tankCharacter = ref<HTMLElement | null>(null)
  const attackSource = ref<HTMLElement[]>([])

  function addTank(ref: HTMLElement) {
    tankCharacter.value = ref
  }

  function addAttackSource(ref: HTMLElement) {
    if (attackSource.value.includes(ref)) return
    attackSource.value.push(ref)
  }

  return {
    tankCharacter,
    attackSource,
    addTank,
    addAttackSource
  }
})
