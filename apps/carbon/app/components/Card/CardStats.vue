<script setup lang="ts">
import type { CardBash } from '../../../types'

defineProps<{
  bash?: CardBash
}>()
</script>

<template>
  <div class="stats">
    <div v-if="bash?.attack" class="chip base-warning button buttonText buttonHover buttonActive buttonFocus focus">
      {{ bash.attack }}
    </div>
    <div v-if="bash?.heal" class="chip base-success button buttonText buttonHover buttonActive buttonFocus focus">
      {{ bash.heal }}
    </div>
    <div v-if="bash?.shield" class="chip base-info button buttonText buttonHover buttonActive buttonFocus focus">
      {{ bash.shield }}
    </div>
    <div v-if="bash?.banter" class="chip base-yellow button buttonText buttonHover buttonActive buttonFocus focus">
      {{ bash.banter }}
    </div>
  </div>
</template>

<style>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  position: relative;
  width: 100%;
  z-index: 1;
}

.stats .chip {
  border-radius: 0;
  cursor: pointer;
  padding: 0px;
  min-width: max-content;
}

.stats .chip:first-child {
  border-bottom-left-radius: var(--radius);
}

/* if there are less than 5 chips children inside .stats give the last chip border radius */
.stats:not(:has(.chip:nth-child(4n))) .chip:last-child {
  border-top-right-radius: var(--radius);
}

.stats:has(.chip:nth-child(4n)) .chip:last-child {
  border-bottom-right-radius: var(--radius);
}
</style>
