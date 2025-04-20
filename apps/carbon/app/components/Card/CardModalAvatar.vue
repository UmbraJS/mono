<script setup lang="ts">
import CardCooldown from './CardCooldown.vue'
import type { Card } from '../../../types'
import BanterIcon from '../icons/Banter.vue'
import { gsap } from 'gsap/gsap-core'

defineProps<{
  card: Card
  timeline: gsap.core.Timeline
  delay: number
}>()
</script>

<template>
  <div class="avatar">
    <CardCooldown v-if="card.bash.cooldown" :card="card" :timeline="timeline" :delay="delay" />
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
