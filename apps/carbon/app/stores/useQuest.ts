import type { Card, User } from '../../types'
import { defineStore } from 'pinia'
import { cards } from '../data/cards'
import { createCardCostCalculator } from '../../utils/cardCost'
import { bot } from '../data/character'

export type EventEffect = ShopEffect | MatchEffect

interface EffectBase {
  id: string
  image: string
  description: string
}

export interface ShopEffect extends EffectBase {
  amount: number
  type: 'store' | 'item'
}

export interface MatchEffect extends EffectBase {
  opponent: User
  type: 'match'
}

interface EventImages {
  default: string
  inside: string
}

export interface EventCard {
  id: string
  name: string
  description: string
  shortDescription: string
  quote: string
  images: EventImages
  effects: EventEffect[]
}

interface EventDecision {
  id: string
  description: string
  quote: string
  image: string
  events: [EventCard, EventCard, EventCard]
}

interface Quest {
  id: string
  name: string
  description: string
  quote: string
  acts: [QuestAct, QuestAct, QuestAct]
}

interface QuestAct {
  id: string
  name: string
  description: string
  quote: string
  pilot: EventDecision
  events: [EventDecision, EventDecision, EventDecision, EventDecision, EventDecision]
  finale: EventDecision
}

/**
 * Quest store for managing quest events and shop functionality
 */
export const useQuest = defineStore('quest', () => {
  const quest = ref<Quest>(quest1)

  const progress = ref({
    act: 0,
    day: 1,
  })

  const currentAct = computed(() => {
    return quest.value.acts[progress.value.act]
  })

  const currentEvents = computed<EventDecision>(() => {
    return currentAct.value?.events[progress.value.day - 1] as EventDecision
  })

  const hoveredEvent = ref<EventCard | null>(null)
  const currentEvent = ref<EventCard | null>(null)

  // TODO: Implement current event logic - switching between gift, shop and match
  const gift = useShop(cards)
  const shop = useShop(cards)
  const match = useMatch()

  watch(currentEvent, (newEvent) => {
    const effect = newEvent?.effects[0]
    if (!effect) return
    setCurrentEffect(effect)
  })

  const setCurrentEffect = (effect: EventEffect) => {
    if (effect.type === 'store') {
      shop.setShop(effect)
    } else if (effect.type === 'item') {
      gift.setShop(effect)
    } else if (effect.type === 'match') {
      match.opponent.value = effect.opponent
    }
  }

  function setCurrentEvent(event: EventCard | null) {
    currentEvent.value = event
  }

  function setHoveredEvent(event: EventCard | null) {
    hoveredEvent.value = event
  }

  function passDay() {
    const daysInAct = quest.value.acts[progress.value.act]?.events.length
    if (!daysInAct) return
    if (progress.value.day < daysInAct) {
      progress.value.day++
    } else if (progress.value.act < quest.value.acts.length - 1) {
      progress.value.act++
      progress.value.day = 1
    }
  }

  return {
    shop,
    gift,
    match,
    hoveredEvent,
    currentEvents,
    setHoveredEvent,
    setCurrentEvent,
    passDay,
  }
})


function useMatch() {
  const opponent = ref<User | null>(null)

  function getMatch() {
    if (!opponent.value) return null
    const store = useStore()
    const botStore = usePerson(opponent.value)

    return useSimulationProvider({
      userDeck: store.user.deck,
      botDeck: botStore.deck.value,
      userCharacters: store.user.characters,
      botCharacters: botStore.characters.value
    })
  }

  const match = computed(() => {
    return getMatch()
  })

  return {
    opponent,
    match
  }
}


/**
 * Shop composable for managing shop inventory and purchases
 */
function useShop(bucket: Card[]) {
  const calculateCardCost = createCardCostCalculator('quest')

  function getThreeCardsAtRandom(amount = 3): Card[] {
    const shuffled = [...bucket].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, amount)
  }

  // State
  const current = ref<ShopEffect | null>(null)
  const inventory = ref<Card[] | null>(null)

  const calculatedInventory = computed(() => {
    return inventory.value?.map(calculateCardCost) || []
  })

  /**
   * Resets the shop inventory to a new set of random cards
   */
  function resetInventory() {
    if (!current.value) return
    inventory.value = getThreeCardsAtRandom(current.value.amount)
  }

  /**
   *  Sets the current event for the shop
   * @param event
   */
  function setShop(effect: ShopEffect | null) {
    current.value = effect
    inventory.value = getThreeCardsAtRandom(effect?.amount)
  }

  function leaveShop() {
    current.value = null
    inventory.value = null
  }

  /**
   * Removes a card from the shop inventory when purchased
   * @param card - The card to purchase
   */
  function removeFromShop(card: Card): void {
    if (!inventory.value) return
    const index = inventory.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      inventory.value.splice(index, 1)
    }
  }

  return {
    current,
    inventory: calculatedInventory,
    setShop,
    leaveShop,
    removeFromShop,
    resetInventory,
  }
}

// Event Effects
const FreeItem: ShopEffect = {
  id: 'free-item',
  image: '/swamp.jpg',
  description: 'A free item',
  type: 'item',
  amount: 1
}

const OpensStore: ShopEffect = {
  id: 'opens-store',
  image: '/swanKeep.png',
  description: 'Opens a store',
  type: 'store',
  amount: 3
}

const Match: MatchEffect = {
  id: 'match',
  image: '/match.jpg',
  description: 'Fight a battle',
  type: 'match',
  opponent: bot
}

const Ormond: EventCard = {
  id: 'Ormond',
  images: {
    default: '/village.jpg',
    inside: '/swanKeep2.png',
  },
  name: 'Ormond',
  description: 'A peaceful village where you can rest and gather supplies.',
  shortDescription: 'A tranquil village with a welcoming atmosphere.',
  quote: '"Welcome to Ormond, traveler. Rest your weary feet and gather your strength." — Villager',
  effects: [OpensStore],
}

const SaintDenisDescription = `
For 117 days, he led a dwindling column of refugees—wounded soldiers, children, mothers, and elders—through the frostbitten highlands. He wore the tattered robes of a priest, and the people treated him as their father. It was only later learned that he was not a priest at all—only a man who had taken the garments from a frozen corpse for warmth.

But as people looked to him for aid, he gave it without question.
He rationed food he could have hoarded.
He gave up his boots for a limping boy.
He carried two children across the avalanche path, and lost three toes to frostbite for it.

Word of his service spread swiftly through the camp. Though he rarely spoke, the children loved to play in his presence. Though he never smiled, others always smiled at him.

Denis kept no journal. He left behind no sermons or scripture. Only the memories of those who survived because he led them through the mountain passes—repairing carts, digging graves, melting snow into water by candlelight. It was said he hardly slept. They would find him in service at midnight, and still in service come morning.

When at last they reached the southern valleys, few even knew his name. As the people wept with joy at the sight of green fields and fertile land, he quietly collapsed onto the grass, as if his task had simply concluded.

They buried him beneath a cairn of mountain stone at the mouth of the valley, and planted roses in thanks. At his grave, they named him Denis.

Years later, those he had saved returned to that spot, unable to forget him. They built a shrine atop the cairn—not in worship, but in gratitude.

They did not call him prophet.
They did not call him miracle-worker.
Only: Saint Denis — who rests at last, in the peace of his people’s safety.
`


const SaintDenis: EventCard = {
  id: 'Saint Denis',
  images: {
    default: '/burial.jpg',
    inside: '/saintDenis.png',
  },
  name: 'Saint Denis',
  description: SaintDenisDescription,
  shortDescription: 'A place of rest and reflection.',
  quote: '"I am not hungry." — Saint Denis, comforting a child crying for him to eat',
  effects: [FreeItem],
}

const BorgBogDescription = `
Borg Bog was not always a festering mire—it was once the seat of Borg, a lonely castle. A place that rarely hosted two visitors at once, and barely had the room to house them if it did. It was home to the forgotten shaman-lord Yrul, an exile from his village, plagued by madness and swallowed by solitude.
As Yrul's mind frayed and his body decayed, the stench of his ruin seeped beyond the veil—and something in the Warp took notice. Nurgle, Lord of Rot, whispered sweet delusions into Yrul’s ears. He fed Yrul’s madness, guided his hands, and led him to open a portal—deep beneath his keep—into the heart of a diseased swamp in Nurgle’s own realm.
The ground trembled. The walls wept. And the castle of Borg sank, slowly and screaming, into another world.
Now, the bog remembers. Trees weep sap like blood. Shadows move without form. Sometimes, the water speaks—offering promises, bargains… or names. Nothing dies in the Borg Bog. It just transforms. Nurgle invites more guests to join Yrul. And Yrul lies at the bottom, eternally clinging to the roots of a living swamp. Never alone again.
`

const BorgBog: EventCard = {
  id: 'Borg Bog',
  images: {
    default: '/swamp.jpg',
    inside: '/borgBog.png',
  },
  name: 'Borg Bog',
  description: BorgBogDescription,
  shortDescription: 'A cursed swamp where the dead never rest.',
  quote: '"In the Borg Bog, you either sink, or you settle in." — Old Swamp Saying',
  effects: [Match],
}

const act1: QuestAct = {
  id: 'act1',
  name: 'The Journey Begins',
  description: 'Set out on your quest to find Eldoria.',
  quote: '"Every journey begins with a single step."',
  pilot: {
    id: 'pilot1',
    description: 'Choose your path wisely.',
    quote: '"The choices you make will shape your destiny."',
    image: '/path.jpg',
    events: [
      Ormond,
      SaintDenis,
      BorgBog,
    ],
  },
  events: [
    {
      id: 'event1',
      description: 'Encounter a mysterious traveler.',
      quote: '"Not all who wander are lost."',
      image: '/traveler.jpg',
      events: [Ormond, SaintDenis, BorgBog],
    },
    {
      id: 'event2',
      description: 'Discover an ancient ruin.',
      quote: '"History is written by those who dare to explore."',
      image: '/ruin.jpg',
      events: [Ormond, SaintDenis, BorgBog],
    },
    {
      id: 'event3',
      description: 'midpoint - Face a dangerous beast.',
      quote: '"Courage is not the absence of fear, but the triumph over it."',
      image: '/beast.jpg',
      events: [Ormond, SaintDenis, BorgBog],
    },
    {
      id: 'event4',
      description: 'Encounter a mysterious traveler.',
      quote: '"Not all who wander are lost."',
      image: '/traveler.jpg',
      events: [Ormond, SaintDenis, BorgBog],
    },
    {
      id: 'event5',
      description: 'Discover an ancient ruin.',
      quote: '"History is written by those who dare to explore."',
      image: '/ruin.jpg',
      events: [Ormond, SaintDenis, BorgBog],
    },
  ],
  finale: {
    id: 'finale1',
    description: 'Face a player',
    quote: '"Eldoria awaits those who are brave enough to seek it."',
    image: '/eldoria.jpg',
    events: [Ormond, SaintDenis, BorgBog],
  },
}

const quest1: Quest = {
  id: 'quest1',
  name: 'The Lost Village',
  description: 'A journey to find the lost village of Eldoria.',
  quote: '"The path to Eldoria is fraught with danger, but the rewards are great."',
  acts: [act1, act1, act1],
}
