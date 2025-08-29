import { defineStore } from 'pinia'
import type { OwnerBoard } from '~/../types/index'

export const useSplinesStore = defineStore('splines', () => {
  const tankCharacter = ref<{
    opponent: HTMLElement | null
    player: HTMLElement | null
  }>({
    opponent: null,
    player: null
  })


  const attackSources = ref<{
    player: HTMLElement[]
    opponent: HTMLElement[]
  }>({
    player: [],
    opponent: []
  })

  const attackCounter = ref<{
    player: number[]
    opponent: number[]
  }>({
    player: [],
    opponent: []
  })



  function addTank(source: OwnerBoard, ref: HTMLElement) {
    tankCharacter.value = {
      opponent: source === 'opponent' ? ref : tankCharacter.value.opponent,
      player: source === 'player' ? ref : tankCharacter.value.player
    }
  }

  function addPlayerAttackSource(ref: HTMLElement) {
    if (attackSources.value.player.includes(ref)) return
    attackSources.value.player.push(ref)
  }

  function addOpponentAttackSource(ref: HTMLElement) {
    if (attackSources.value.opponent.includes(ref)) return
    attackSources.value.opponent.push(ref)
  }

  return {
    attackCounter,
    attackSources,
    tankCharacter,
    addOpponentAttackSource,
    addPlayerAttackSource,
    addTank,
  }
})
