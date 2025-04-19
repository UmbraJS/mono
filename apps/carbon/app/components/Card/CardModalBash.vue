<script setup lang="ts">
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
</template>
