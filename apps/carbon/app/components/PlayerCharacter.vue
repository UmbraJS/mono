<script setup lang="ts">
import type { Character } from '~~/types'

defineProps<{
  character: Character
  reverse: boolean
}>()
</script>

<template>
  <div class="character" :class="{ reverse }">
    <header>
      <div class="character-avatar">
        <img v-if="character.image" :src="character.image.default" alt="Character Image" />
      </div>
      <div class="character-sheet">
        <h2>{{ character.name }}</h2>
        <p>{{ character.description }}</p>
      </div>
    </header>

    <div class="character-health">
      <div class="life">{{ character.health }} / {{ character.maxHealth }}</div>
      <div class="death"></div>
    </div>
  </div>
</template>

<style>
.character {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'avatar'
    'health';

  height: 100%;
  width: 100%;
  max-width: 700px;
}

.character.reverse {
  grid-template-rows: auto 1fr;
  grid-template-areas:
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

.character-health {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--space-1);
  background: var(--base);
  overflow: hidden;
  width: 100%;
  height: var(--block-big);
  padding: var(--space-quark) 0;
  font-weight: 900;
  grid-area: health;
}

.character-health .life {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--warning-50);
  padding: 0px var(--space-quark);
  border-radius: var(--radius);
  height: 100%;
}

.character-health .death {
  background-color: var(--base-20);
  padding: 0px var(--space-quark);
  border-radius: var(--radius);
  height: 100%;
}
</style>
