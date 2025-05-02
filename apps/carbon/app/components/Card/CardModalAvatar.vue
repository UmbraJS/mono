<script setup lang="ts">
import CardCooldown from './CardCooldown.vue'
import type { SimCard } from '../../../types'
import BanterIcon from '../icons/Banter.vue'

defineProps<{
  card: SimCard
  time: number
  timeline: gsap.core.Timeline;
}>()
</script>

<template>
  <div class="avatar">
    <CardCooldown v-if="card.bash.cooldown" :time="time" :timeline="timeline"
      :cooldownEvents="card.simulation.cooldownEvents" />
    <div class="chips">
      <div v-if="card.rarity" class="chip base-yellow">
        <BanterIcon />
        Rarity: {{ card.rarity }}
      </div>
      <div v-if="card.unique" class="chip base-yellow">
        <BanterIcon />
        Unique
      </div>
    </div>
    <img :src="card.image?.default" alt="card image" class="dialog-image border" />
  </div>
</template>

<style>
.DialogContent .avatar {
  position: relative;
  height: 600px;
}

.DialogContent .avatar img {
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
}

.DialogContent .avatar .chips {
  position: absolute;
  top: var(--space-1);
  left: var(--space-1);
  display: flex;
  gap: var(--space-1);
}

.DialogContent .avatar .chips .chip {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px var(--space-quark);
  width: max-content;
}
</style>
