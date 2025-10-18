<script setup lang="ts">
import { useSimulationInject } from '~/composables/useSimulationProvider'

const props = defineProps<{
  maxSlots: number;
}>()

const store = useUser()

const simulation = useSimulationInject()

const opponentTimeline = simulation.cardTimeline.opponent
const playerTimeline = simulation.cardTimeline.player

const maxUserSlots = computed(() => store.user.maxSlots)
const maxBotSlots = computed(() => props.maxSlots)

const splinesStore = useSplinesStore()

function addOpponentAttackSource({ id, element }: { id: string; element: HTMLElement | null }) {
  if (!element) return
  splinesStore.addOpponentAttackSource({ id, element });
}

function addPlayerAttackSource({ id, element }: { id: string; element: HTMLElement | null }) {
  if (!element) return
  splinesStore.addPlayerAttackSource({ id, element });
}
</script>

<template>
  <div class="MatchBoard">
    <CardBoard board="deck" :max-slots="maxBotSlots">
      <CardModal v-for="card in opponentTimeline" :key="card.id" :card="card">
        <CardHeader :card="card">
          <CardCooldown :card="card" @function-ref="(el) => addOpponentAttackSource({ id: card.id, element: el })"
            @card-attack="() => {
              splinesStore.attackCounter.opponent.push(card.id)
            }" />
        </CardHeader>
      </CardModal>
    </CardBoard>
    <TimeControls />
    <CardBoard board="deck" :max-slots="maxUserSlots">
      <CardModal v-for="card in playerTimeline" :key="card.id" :card="card" :chunks="card.simulation.chunks">
        <CardHeader :card="card">
          <CardCooldown :card="card" @function-ref="(el) => addPlayerAttackSource({ id: card.id, element: el })"
            @card-attack="() => {
              splinesStore.attackCounter.player.push(card.id)
            }" />
        </CardHeader>
      </CardModal>
    </CardBoard>
  </div>
</template>

<style>
#DeckPanels {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
}


#DeckPanel {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background-color: var(--base-10);
  padding: var(--space-1);
  border-radius: var(--radius);
}

#DeckPanel.player {
  transform: translate(0%, var(--space-1));
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

#DeckPanel.opponent {
  transform: translate(0%, calc(-1 * var(--space-1)));
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.MatchBoard {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  gap: var(--space-1);
  grid-column: 1 / -1;
}
</style>
