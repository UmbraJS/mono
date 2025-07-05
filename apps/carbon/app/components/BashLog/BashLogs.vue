<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BashLog from '~/components/BashLog/BashLog.vue'
import { Tabs, Button } from '@nobel/core'
import type { CardInfo } from '../../../types/card'
import BashLogModal from './BashLogModal.vue'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'

defineProps<{
  opponentInfoDeck: CardInfo[]
  playerInfoDeck: CardInfo[]
  modalButton: boolean,
  logs: Pick<SpaceOutput, 'healthLog' | 'shieldLog'>
}>()
</script>

<template>
  <Tabs class="BashLogTabs" aria-label="Actions" :tabs="[
    { label: 'Opponent', icon: 'mdi:crosshairs-gps' },
    { label: 'Player', icon: 'mdi:shield' },
  ]">
    <template v-if="modalButton" #buttons>
      <BashLogModal :logs="logs" :player-info-deck="playerInfoDeck" :opponent-info-deck="opponentInfoDeck">
        <Button variant="primary" size="small">
          <Icon icon="mdi:history" />
        </Button>
      </BashLogModal>
    </template>
    <template #tab1>
      <BashLog :logs="logs" :player-info-deck="playerInfoDeck" :opponent-info-deck="opponentInfoDeck" />
    </template>
    <template #tab2>
      <BashLog :logs="logs" :player-info-deck="playerInfoDeck" :opponent-info-deck="opponentInfoDeck" />
    </template>
  </Tabs>
</template>

<style>
.BashLogTabs {
  height: var(--side-size)
}
</style>
