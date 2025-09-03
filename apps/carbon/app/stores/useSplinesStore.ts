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
    player: {
      id: string
      element: HTMLElement
    }[]
    opponent: {
      id: string
      element: HTMLElement
    }[]
  }>({
    player: [],
    opponent: []
  })

  const attackCounter = ref<{
    player: string[]
    opponent: string[]
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

  function addPlayerAttackSource({
    id,
    element
  }: {
    id: string
    element: HTMLElement
  }) {
    if (attackSources.value.player.find(source => source.id === id)) return
    attackSources.value.player.push({ id, element })
  }

  function addOpponentAttackSource({
    id,
    element
  }: {
    id: string
    element: HTMLElement
  }) {
    if (attackSources.value.opponent.find(source => source.id === id)) return
    attackSources.value.opponent.push({ id, element })
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
