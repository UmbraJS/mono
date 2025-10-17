<script setup lang="ts">
import { computed } from 'vue'
import type { Character } from '~~/types'
import PartyBoard from './PartyBoard.vue'
import type { ValueLog } from '../../utils/space/types'

const props = defineProps<{
  health: globalThis.Ref<number>;
  shield: globalThis.Ref<number>;
  healthLog: ValueLog[];
  shieldLog: ValueLog[];
  time: number;
  characters: Character[];
}>()

const healthLogsUpUntilNow = computed(() => {
  return props.healthLog.filter(log => log.timestamp <= props.time)
})

const splinesStore = useSplinesStore()

function functionRef(el: HTMLElement) {
  if (splinesStore.tankCharacter.opponent) return
  splinesStore.addTank('opponent', el);
}

function entryValueLog(log: ValueLog) {
  const isTheSame = log.attemptedChange === log.actualChange
  if (isTheSame) {
    return log.attemptedChange > 0 ? `+${log.attemptedChange}` : `${log.attemptedChange}`
  }
  return log.attemptedChange > 0 ? `+${log.attemptedChange}` : `${log.attemptedChange}`
}


</script>

<template>
  <PartyBoard>
    <div class="location border">
      <!-- <img :src="skeletonKing.field?.image?.default" alt="Location" /> -->
    </div>
    <PlayerCharacter :characters="characters" :health="health" :shield="shield" :reverse="false"
      @character-loaded="functionRef" />
    <div class="location border">
      <!-- <div class="money" /> -->
      <div class="BashLogs">
        <div v-for="value in healthLogsUpUntilNow" :key="value.index" class="BashLog">
          <p>{{ entryValueLog(value) }}</p>
          <p>{{ value.timestamp }}</p>
        </div>
      </div>
    </div>
    <!-- <BashLogs :logs="logs" :player-info-deck="getInfoDeck(user.deck)" :opponent-info-deck="getInfoDeck(bot.deck)"
      :modal-button="true" /> -->
  </PartyBoard>
</template>

<style scoped>
.BashLogs {
  overflow: scroll;
  height: calc(var(--side-size) - var(--space-3));
}

.BashLog {
  display: flex;
  gap: var(--space-2);
  background: var(--base-10);
  padding: var(--space-1);
  border-radius: var(--radius);
}
</style>
