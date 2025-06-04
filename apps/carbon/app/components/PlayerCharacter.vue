<script setup lang="ts">
import type { Character, User } from '~~/types'
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
    <header>
      <div class="character-avatar" v-for="character in characters">
        <img v-if="character.image" :src="character.image.default" alt="Character Image" />
      </div>
      <div class="character-sheet">
        <!-- <h2>{{ character.name }}</h2>
        <p>{{ character.description }}</p> -->
      </div>
      <div class="healthImpact">
        <FrostLayer :reversed="reverse" :health="health" :maxHealth="maxHealth" />
      </div>
    </header>

    <ValueBar :value="shield" :maxValue="Math.max(maxHealth, shield)" barColor="var(--info-90)"
      delayColor="var(--info-50)" gridArea="shield">
      {{ Math.abs(shield) }}
    </ValueBar>

    <ValueBar :value="health" :maxValue="maxHealth" barColor="var(--success-50)" delayColor="var(--warning-50)"
      gridArea="health">
      {{ Math.abs(health) }} / {{ maxHealth }}
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

.character-sheet {
  padding: var(--space-2);
}
</style>
