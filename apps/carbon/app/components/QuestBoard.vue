<script setup lang="ts">
import type { EventCard } from '~/stores/useQuest'
// const audio = useAudio()
const quest = useQuest()

function triggerEffects(event: EventCard) {
  const opensStore = event.effects.some(effect => effect.type === 'store')
  const freeItem = event.effects.some(effect => effect.type === 'item')
  const match = event.effects.some(effect => effect.type === 'match')
  quest.setCurrentEvent(event)

  // audio.speakElevenLabs(event.name + event.description, 'germanSage')

  if (opensStore) {
    navigateTo('/shop')
  } else if (freeItem) {
    // quest.openFreeItem()
    navigateTo('/gift')
  } else if (match) {
    // quest.openMatch()
    navigateTo('/match')
  }
}
</script>

<template>
  <div class="quest-events">
    <div v-for="event in quest.currentEvents.events" :key="event.id" class="event"
      @mouseover="quest.setHoveredEvent(event)" @mouseleave="quest.setHoveredEvent(null)"
      @click="() => triggerEffects(event)">
      <img :src="event.images.default" alt="Location">
      <div class="prose">
        <h3>{{ event.name }}</h3>
        <p>{{ event.shortDescription }}</p>
      </div>
      <div v-for="effect in event.effects" :key="effect.id" class="eventEffects">
        <div class="effect base-accent">
          <img :src="effect.image" alt="Location">
          <p>{{ effect.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
  border: solid 1px var(--base);
  transition: var(--slow);
}

.quest-events .event:hover {
  background: var(--base-30);
  cursor: pointer;
  border: solid 1px var(--base-50);
}

.quest-events .event:active {
  background: var(--accent-30);
  color: var(--accent-100);
  border: solid 1px var(--accent-50);
  transition: var(--time);
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
