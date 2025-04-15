<script setup lang="ts">
import type { Character } from '~~/types'
import MeterLines from './ValueBar/MeterLines.vue'
import ValueBar from './ValueBar/ValueBar.vue'

const props = defineProps<{
  reverse: boolean
  character: Character
  health: number
  healthDelayed: number
  morale: number
  shield: number
}>()

const shieldPercentage = computed(() => {
  return (Math.max(0, props.shield) / props.character.maxHealth) * 100
})
</script>

<template>
  <section class="character" :class="{ reverse }">
    <header>
      <div class="character-avatar">
        <img v-if="character.image" :src="character.image.default" alt="Character Image" />
      </div>
      <div class="character-sheet">
        <h2>{{ character.name }}</h2>
        <p>{{ character.description }}</p>
      </div>
    </header>

    <div class="character-shield">
      <MeterLines :value="character.maxHealth" :meter="30" />
      <p class="digits">{{ shield }}</p>
      <div class="shield"></div>
      <div class="open"></div>
    </div>

    <ValueBar :character="character" :health="health" :max-health="character.maxHealth">
      {{ health }} / {{ character.maxHealth }}
    </ValueBar>
  </section>
</template>

<style>
.character {
  display: grid;
  gap: var(--space-quark);
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'avatar'
    'health'
    'shield';

  height: 100%;
  width: 100%;
  max-width: 700px;
}

.character.reverse {
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'shield'
    'health'
    'avatar';
}

.character header {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-area: avatar;
  background: var(--base-10);
  border-radius: var(--radius);
  overflow: hidden;
}

.character-avatar {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.character-avatar img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.character-sheet {
  padding: var(--space-2);
}

.character-shield {
  position: relative;
  display: grid;
  grid-template-columns: calc(v-bind(shieldPercentage) * 1%) 1fr;
  align-items: center;
  gap: var(--space-1);
  background: var(--base);
  overflow: hidden;
  width: 100%;
  height: var(--paragraph);
  font-weight: 900;
  grid-area: shield;
}

.character-shield .digits {
  position: absolute;
  padding: 0 var(--space-1);
  font-variation-settings: var(--font-semibold);
}

.character-shield .shield {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--info-90);
  padding: 0px var(--space-quark);
  border-radius: var(--radius);
  height: 100%;
}

.character-shield .open {
  background-color: var(--base-20);
  padding: 0px var(--space-quark);
  border-radius: var(--radius);
  height: 100%;
}
</style>
