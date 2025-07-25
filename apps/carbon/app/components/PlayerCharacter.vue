<script setup lang="ts">
import type { Character } from '~~/types'
import ValueBar from './ValueBar/ValueBar.vue'
import FrostLayer from './FrostLayer.vue'

const props = defineProps<{
  reverse: boolean
  characters: Character[]
  health: number
  shield: number
}>()
const maxHealth = getMaxHealth()

function getMaxHealth(): number {
  return props.characters.reduce((max, character) => {
    return Math.max(max, character.maxHealth)
  }, 0)
}
</script>

<template>
  <section class="character" :class="{ reverse }">
    <header id="Party">
      <div v-for="character in characters" :key="character.id" class="character-avatar">
        <NuxtImg v-if="character.image" :src="character.image.default" alt="Character Image" placeholder />
      </div>
      <div class="healthImpact">
        <FrostLayer :reversed="reverse" :health="health" :max-health="maxHealth" />
      </div>
    </header>

    <ValueBar :value="shield" :max-value="Math.max(maxHealth, shield)" bar-color="var(--info-90)"
      delay-color="var(--info-50)" grid-area="shield">
      {{ Math.floor(shield) }}
    </ValueBar>

    <ValueBar :value="health" :max-value="maxHealth" bar-color="var(--success-50)" delay-color="var(--warning-50)"
      grid-area="health">
      {{ Math.floor(health) }} / {{ maxHealth }}
    </ValueBar>
  </section>
</template>

<style>
.healthImpact {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  overflow: hidden;
  z-index: 1;
  display: grid;
  overflow: hidden;
  pointer-events: none;
}

#Party {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-1);
  grid-area: avatar;
  padding: var(--space-quark);
}

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
</style>
