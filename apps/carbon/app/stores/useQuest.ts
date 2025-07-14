import type { Card } from '../../types'
import { defineStore } from 'pinia'
import { gauntletOfSigmar, glimmerCloak, viking, saintDenis } from '../data/cards'
import { createCardCostCalculator } from '../../utils/cardCost'

// Types
interface EventEffect {
  id: string
  image: string
  description: string
}

interface EventCard {
  id: string
  images: {
    default: string
    inside?: string
  }
  name: string
  description: string
  shortDescription: string
  quote?: string
  effects: EventEffect[]
}

/**
 * Quest store for managing quest events and shop functionality
 */
export const useQuest = defineStore('quest', () => {
  // State
  const currentEvents = ref<EventCard[]>([Ormond, SaintDenis, BorgBog])
  const hoveredEvent = ref<EventCard | null>(null)
  const shop = useShop()

  // Actions
  const setHoveredEvent = (event: EventCard | null) => {
    hoveredEvent.value = event
  }

  return {
    shop,
    hoveredEvent,
    currentEvents,
    setHoveredEvent,
  }
})

/**
 * Shop composable for managing shop inventory and purchases
 */
function useShop() {
  const view = useView()

  // Create a card cost calculator for the current realm
  const calculateCardCost = createCardCostCalculator(view.realm)

  // State
  const current = ref<EventCard | null>(Ormond)
  const shopInventory = ref<Card[] | null>([
    calculateCardCost(gauntletOfSigmar),
    calculateCardCost(glimmerCloak),
    calculateCardCost(saintDenis),
    calculateCardCost(viking),
  ])

  /**
   * Removes a card from the shop inventory when purchased
   * @param card - The card to purchase
   */
  function buyCard(card: Card): void {
    if (!shopInventory.value) return

    const index = shopInventory.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      shopInventory.value.splice(index, 1)
    }
  }

  return {
    current,
    shopInventory,
    buyCard,
  }
}

// Event Effects
const FreeItem: EventEffect = {
  id: 'free-item',
  image: '/swamp.jpg',
  description: 'A free item',
}

const OpensStore: EventEffect = {
  id: 'opens-store',
  image: '/swanKeep.png',
  description: 'Opens a store',
}

const Match: EventEffect = {
  id: 'match',
  image: '/match.jpg',
  description: 'Fight a battle',
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


