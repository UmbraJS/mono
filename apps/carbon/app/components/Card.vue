<script setup lang="ts">
import type { Card } from '../../types'

defineProps<{
  card: Card
}>()
</script>

<template>
  <div class="card">
    <img v-if="card.image" :src="card.image.default" alt="Card Image" />
    <div class="stats">
      <div
        v-if="card.stats.attack"
        class="chip base-warning button buttonText buttonHover buttonActive buttonFocus focus"
      >
        {{ card.stats.attack }}
      </div>
      <div
        v-if="card.stats.heal"
        class="chip base-success button buttonText buttonHover buttonActive buttonFocus focus"
      >
        {{ card.stats.heal }}
      </div>
      <div
        v-if="card.stats.shield"
        class="chip base-accent button buttonText buttonHover buttonActive buttonFocus focus"
      >
        {{ card.stats.shield }}
      </div>
      <div
        v-if="card.stats.banter"
        class="chip base-accent button buttonText buttonHover buttonActive buttonFocus focus"
      >
        {{ card.stats.banter }}
      </div>
      <div
        v-if="card.stats.terror"
        class="chip base-warning button buttonText buttonHover buttonActive buttonFocus focus"
      >
        {{ card.stats.terror }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card {
  display: flex;
  justify-content: center;
  align-items: flex-end;

  position: relative;
  height: 100%;
  width: 100%;
}

.card img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  width: 100%;
}

.stats .chip {
  padding: var(--space-quark);
  border-radius: 0;
  cursor: pointer;
}

.stats .chip:first-child {
  border-bottom-left-radius: var(--radius);
}

/* if there are less than 5 chips children inside .stats give the last chip boder radius */
.stats:not(:has(.chip:nth-child(5n))) .chip:last-child {
  border-top-right-radius: var(--radius);
}

.stats:has(.chip:nth-child(5n)) .chip:last-child {
  border-bottom-right-radius: var(--radius);
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: var(--radius);
}
</style>
