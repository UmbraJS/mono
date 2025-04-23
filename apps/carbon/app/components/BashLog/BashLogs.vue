<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BashLog from '~/components/BashLog/BashLog.vue'
import { Tabs, Button } from '@nobel/core'

import type { UsePlayerReturn } from '../../composables/usePlayer'
import BashLogModal from './BashLogModal.vue'

defineProps<{
  player: UsePlayerReturn
  opponent: UsePlayerReturn
  modalButton: boolean
}>()
</script>

<template>
  <Tabs class="BashLogTabs" ariaLabel="Actions" :tabs="[
    { label: 'Opponent', icon: 'mdi:crosshairs-gps' },
    { label: 'Player', icon: 'mdi:shield' },
  ]">
    <template #buttons v-if="modalButton">
      <BashLogModal :player="player" :opponent="opponent">
        <Button variant="primary" size="small">
          <Icon icon="mdi:history" />
        </Button>
      </BashLogModal>
    </template>
    <template #tab1>
      <BashLog :player="opponent" :opponent="player" :playerDeck="opponent.deck" :opponentDeck="player.deck" />
    </template>
    <template #tab2>
      <BashLog :player="player" :opponent="opponent" :playerDeck="player.deck" :opponentDeck="opponent.deck" />
    </template>
  </Tabs>
</template>

<style>
.BashLogTabs {
  height: var(--side-size)
}
</style>
