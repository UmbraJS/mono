<script setup lang="ts">
import {
  Button,
  toast,
  DialogRoot,
  DialogTrigger,
  DialogModal,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@nobel/core'
import type { Card } from '../../../types'
import AttackIcon from '../icons/Attack.vue'
import HealIcon from '../icons/Heal.vue'
import ShieldIcon from '../icons/Shield.vue'
import BanterIcon from '../icons/Banter.vue'

const props = defineProps<{
  card: Card
}>()

const bash = props.card.bash
</script>

<template>
  <DialogRoot>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogModal variant="accent">
      <div class="dialogWrapper">
        <div class="avatar">
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
        <div class="cardMeta">
          <DialogTitle>
            <span>lvl {{ card.level }} - </span>{{ card.name }}
          </DialogTitle>
          <DialogDescription>
            {{ card.description }}
          </DialogDescription>
          <div class="bash">
            <h4>Meta --------------------------</h4>
            <div v-if="bash.cooldown" class="chip">
              <BanterIcon />
              Cooldown: {{ bash.cooldown }}s
            </div>
            <div class="chip"><AttackIcon />Cost: {{ card.cost }}</div>
          </div>

          <div class="tags">
            <p>Aspects:</p>
            <div v-for="aspect in card.aspects" class="chip">
              {{ aspect.name }}
            </div>
          </div>

          <div class="bash">
            <h4>B.A.S.H -----------------------</h4>
            <div v-if="bash.banter" class="chip base-yellow">
              <BanterIcon />
              Banter: {{ bash.banter }}
            </div>
            <div v-if="bash.attack" class="chip base-warning">
              <AttackIcon />Attack: {{ bash.attack }}
            </div>
            <div v-if="bash.shield" class="chip base-info">
              <ShieldIcon />
              Shield: {{ bash.shield }}
            </div>
            <div v-if="bash.heal" class="chip base-success">
              <HealIcon />
              Heal: {{ bash.heal }}
            </div>
          </div>

          <div class="tags">
            <p>Tags:</p>
            <div v-for="tag in card.tags" class="chip">
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
    </DialogModal>
  </DialogRoot>
</template>

<style>
.DialogContent {
  padding: var(--space-1);
  max-width: 850px;
}

.DialogContent .chip {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  border: solid 2px var(--base-60);
  padding: var(--space-quark);
  width: 100%;
  color: var(--base-120);
  background-color: var(--base-20);
  border-radius: var(--radius);
}

.dialogWrapper {
  display: flex;
  gap: 1rem;
}

.dialogWrapper .cardMeta {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-2);
  width: 100%;
  padding-top: var(--space-3);
}

.dialogWrapper .cardMeta span {
  color: var(--base-60);
}

.dialogWrapper h4 {
  color: var(--base-60);
}

.dialogWrapper .bash {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.dialogWrapper .tags {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
}

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
