<script setup lang="ts">
import { DialogRoot, DialogTrigger, DialogModal, DialogTitle, DialogDescription } from '@nobel/core'

import BashLogs from '~/components/BashLog/BashLogs.vue'
import type { UsePlayerReturn } from '../../composables/usePlayer'

defineProps<{
  player: UsePlayerReturn
  opponent: UsePlayerReturn
}>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger asChild>
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
        <BashLogs :player="player" :opponent="opponent" :modal-button="false" />
      </div>
    </DialogModal>
  </DialogRoot>
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
