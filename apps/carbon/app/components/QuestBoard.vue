<script setup lang="ts">
import { user, bot } from '../data/character'
import { gsap } from 'gsap'
import { spaceTimeSimulation } from '../../utils/spaceTimeSimulation'
import { useSpace } from '~/composables/useSpace'

const time = ref(0)

const timeline = gsap.timeline({
  paused: true,
  onUpdate: () => {
    time.value = timeline.time()
  },
})

const cardTimeline = spaceTimeSimulation({
  player: user,
  opponent: bot,
  matchDuration: 30
})

const us = useSpace(timeline, cardTimeline.space.player, user.characters)

interface EventCard {
  id: string;
  image: string;
  name: string;
  description: string;
  effects: {
    image: string;
    description: string;
  }[];
}

const events = [
  {
    id: 'village',
    image: '/village.jpg',
    name: 'Village',
    description: 'A peaceful village where you can rest and gather supplies.',
    effects: [
      {
        id: 'swamp-effect',
        image: '/village.jpg',
        description: 'Opens a store'
      }
    ],
  }, {
    id: 'burial',
    image: '/burial.jpg',
    name: 'Burial',
    description: 'A solemn burial ground where you can pay your respects.',
    effects: [
      {
        id: 'swamp-effect',
        image: '/burial.jpg',
        description: 'Opens a store'
      }
    ],
  }, {
    id: 'swamp',
    image: '/swamp.jpg',
    name: 'Swamp',
    description: 'A murky swamp filled with dangers and hidden treasures.',
    effects: [
      {
        id: 'swamp-effect',
        image: '/swamp.jpg',
        description: 'A free item'
      }
    ],
  }
]

</script>

<template>
  <main class="quest-wrapper">
    <div class="quest-events">

      <div v-for="event in events" :key="event.id" class="event">
        <img :src="event.image" alt="Location" />
        <div class="prose">
          <h3>{{ event.name }}</h3>
          <p>{{ event.description }}</p>
        </div>
        <div v-for="effect in event.effects" :key="effect.id" class="eventEffects">
          <div class="effect base-accent">
            <img :src="effect.image" alt="Location" />
            <p>{{ effect.description }}</p>
          </div>
        </div>
      </div>

    </div>

    <PlayerHeader :userCharacters="user.characters" :health="us.health.value" :shield="us.shield.value" />
  </main>
</template>

<style>
main.quest-wrapper {
  --side-size: 17vh;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr var(--side-size);
  gap: var(--space-1);

  height: 100vh;

  padding: var(--space-1);
}

.quest-events {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-3);
  grid-column: 1 / -1;
}

.quest-events .event {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  width: 220px;
  aspect-ratio: 1 / 1;
  padding: var(--space-1);
  background: var(--base-20);
  border-radius: var(--radius);
}

.quest-events .event img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}

.quest-events .event .eventEffects {
  display: flex;
  gap: var(--space-1);
}

.quest-events .event .eventEffects .effect {
  display: flex;
  align-items: center;
  gap: var(--space-1);

  background: var(--base-10);
  color: var(--base-100);

  padding: var(--space-1);
  border-radius: var(--radius);
  width: 100%;
}

.quest-events .event .eventEffects .effect img {
  --size: 30px;
  height: var(--size);
  width: var(--size);

  object-fit: cover;
  border-radius: var(--radius);
}

.quest-events .event .prose {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
