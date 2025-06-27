<script setup lang="ts">
import { DialogRoot, DialogTrigger, DialogModal, DialogTitle, DialogDescription } from '@nobel/core'
import type { CardInfo } from '../../../types/card'
import BashLogs from '~/components/BashLog/BashLogs.vue'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'

defineProps<{
  opponentInfoDeck: CardInfo[]
  playerInfoDeck: CardInfo[]
  logs: Pick<SpaceOutput, 'healthLog' | 'shieldLog'>
}>()
</script>

<template>
  <ClientOnly>
    <DialogRoot>
      <DialogTrigger as-child>
        <slot />
      </DialogTrigger>
      <DialogModal variant="accent">
        <div class="BashLogsDialogWrapper">
          <DialogTitle>
            Bash Logs
          </DialogTitle>
          <DialogDescription>
            logs of bash
          </DialogDescription>
          <BashLogs :logs="logs" :player-info-deck="playerInfoDeck" :opponent-info-deck="opponentInfoDeck"
            :modal-button="false" />
        </div>
      </DialogModal>
    </DialogRoot>
    <template #fallback>
      <slot />
    </template>
  </ClientOnly>
</template>

<style>
.BashLogsDialogWrapper {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  height: 70vh;
}

.BashLogsDialogWrapper .BashLogTabs {
  height: 50vh;
}
</style>
