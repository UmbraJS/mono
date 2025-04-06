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
import type { Card } from '../../types'
import AttackIcon from './icons/Attack.vue'
import HealIcon from './icons/Heal.vue'
import ShieldIcon from './icons/Shield.vue'
import BanterIcon from './icons/Banter.vue'

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
          <img :src="card.image?.default" alt="card image" class="dialog-image border" />
        </div>
        <div class="cardMeta">
          <DialogTitle> {{ card.name }} </DialogTitle>
          <DialogDescription>
            {{ card.description }}
          </DialogDescription>
          <div class="bash">
            <div v-if="bash.attack" class="chip base-warning">
              <AttackIcon />Attack: {{ bash.attack }}
            </div>
            <div v-if="bash.heal" class="chip base-success">
              <HealIcon />
              Heal: {{ bash.heal }}
            </div>
            <div v-if="bash.shield" class="chip base-info">
              <ShieldIcon />
              Shield: {{ bash.shield }}
            </div>
            <div v-if="bash.banter" class="chip base-yellow">
              <BanterIcon />
              Banter: {{ bash.banter }}
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
  gap: var(--space-1);
  width: 100%;
}

.dialogWrapper .bash {
  display: flex;
  flex-direction: column;
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
</style>
