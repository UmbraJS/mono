import { defineStore } from 'pinia'
import type { Card } from '../../types'
import { gauntletOfSigmar, glimmerCloak, viking } from '../data/cards'

export const useQuest = defineStore('quest', () => {
  const currentEvents = ref([Ormond, SaintDenis, BorgBog])
  const currentShop = ref<Card[] | null>([
    gauntletOfSigmar,
    glimmerCloak,
    viking,
  ])

  return {
    currentEvents,
    currentShop
  }
})

interface EventEffect {
  id: string;
  image: string;
  description: string;
}

interface EventCard {
  id: string;
  image: string;
  name: string;
  description: string;
  effects: EventEffect[];
}

const FreeItem: EventEffect = {
  id: 'swamp-effect',
  image: '/swamp.jpg',
  description: 'A free item'
}

const OpensStore: EventEffect = {
  id: 'swamp-effect',
  image: '/village.jpg',
  description: 'Opens a store'
}

const Ormond: EventCard = {
  id: 'Ormond',
  image: '/village.jpg',
  name: 'Ormond',
  description: 'A peaceful village where you can rest and gather supplies.',
  effects: [OpensStore],
}

const SaintDenis: EventCard = {
  id: 'Saint Denis',
  image: '/burial.jpg',
  name: 'Saint Denis',
  description: 'A solemn burial ground where you can pay your respects.',
  effects: [OpensStore],
}

const BorgBog: EventCard = {
  id: 'Borg Bog',
  image: '/swamp.jpg',
  name: 'Borg Bog',
  description: 'A murky swamp filled with dangers and hidden treasures.',
  effects: [FreeItem],
}
