<script setup lang="ts">
import type { CardStats } from '../../../types'
import AttackIcon from '../icons/Attack.vue'
import HealIcon from '../icons/Heal.vue'
import ShieldIcon from '../icons/Shield.vue'
import BanterIcon from '../icons/Banter.vue'

const props = defineProps<{
  cardStats: CardStats
}>()

const bash = props.cardStats.bash
</script>

<template>
  <div class="bash">
    <div v-if="bash?.banter" class="chip base-yellow">
      <BanterIcon />
      Banter: {{ bash.banter }}
    </div>
    <div v-if="bash?.attack" class="chip base-warning">
      <AttackIcon />Attack: {{ bash.attack }}
    </div>
    <div v-if="bash?.shield" class="chip base-info">
      <ShieldIcon />
      Shield: {{ bash.shield }}
    </div>
    <div v-if="bash?.heal" class="chip base-success">
      <HealIcon />
      Heal: {{ bash.heal }}
    </div>
  </div>
</template>
