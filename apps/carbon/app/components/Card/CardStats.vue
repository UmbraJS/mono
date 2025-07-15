<script setup lang="ts">
import type { CardStats } from '../../../types'
import BanterIcon from '../icons/Banter.vue'
import AttackIcon from '../icons/Attack.vue'
import HealIcon from '../icons/Heal.vue'
import ShieldIcon from '../icons/Shield.vue'

defineProps<{
  cardStats: CardStats
}>()
</script>

<template>
  <div class="topRowStats">


    <div v-if="cardStats.cost" class="PillChip border">
      <Icon name="carbon:purchase" size="1rem" />
      <p class="caption">
        <strong>{{ cardStats.cost }}</strong>
      </p>
    </div>

    <!-- <p class="caption">{{ view.getCardStats(card).cost }}</p> -->

    <div v-if="cardStats.bash?.actionCount && cardStats.bash.actionCount > 1" class="PillChip border">
      <p class="caption">
        <strong>x{{ cardStats.bash.actionCount }}</strong>
      </p>
    </div>

    <div v-if="cardStats.bash?.cooldown" class="PillChip border">
      <Icon name="carbon:timer" size="1rem" />
      <p class="caption">
        <strong>{{ cardStats.bash.cooldown }}</strong>
      </p>
    </div>
  </div>
  <div class="stats">
    <div v-if="cardStats.bash?.attack"
      class="chip base-warning button buttonText buttonHover buttonActive buttonFocus focus">
      <AttackIcon />
      <p class="caption">
        <strong>{{ cardStats.bash.attack }}</strong>
      </p>
    </div>
    <div v-if="cardStats.bash?.heal"
      class="chip base-success button buttonText buttonHover buttonActive buttonFocus focus">
      <HealIcon />
      <p class="caption">
        <strong>{{ cardStats.bash.heal }}</strong>
      </p>
    </div>
    <div v-if="cardStats.bash?.shield"
      class="chip base-info button buttonText buttonHover buttonActive buttonFocus focus">
      <ShieldIcon />
      <p class="caption">
        <strong>{{ cardStats.bash.shield }}</strong>
      </p>
    </div>
    <div v-if="cardStats.bash?.banter"
      class="chip base-yellow button buttonText buttonHover buttonActive buttonFocus focus">
      <BanterIcon />
      <p class="caption">
        <strong>{{ cardStats.bash.banter }}</strong>
      </p>
    </div>
  </div>
</template>

<style>
.topRowStats {
  position: absolute;
  top: 0;
  width: min-content;
  display: flex;
  justify-self: flex-end;
}

.PillChip {
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 0;
  cursor: pointer;
  min-width: max-content;
  padding: calc(var(--space-quark) / 2);
  margin: calc(var(--space-quark) / 2);

  border-color: var(--base-120);
  background-color: var(--base-10);

  border-radius: var(--radius);
}

.stats {
  grid-row: bottom;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  position: relative;
  width: 100%;
  z-index: 1;
}

.stats .chip svg {
  position: absolute;
  z-index: 0;
  color: var(--base-10);
  --paragraph: var(--space-5);
  --svg-color: var(--base-50);
}

.stats .chip strong {
  position: relative;
  z-index: 1;
}

.stats .chip {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;

  border-radius: 0;
  cursor: pointer;
  padding: 0px;
  min-width: max-content;
  border-color: var(--base-120);
  padding: 0px var(--space-1);

  border-bottom: 0px;
  border-left: 0px;
  border-right: 0px;
}

.stats .chip:first-child {
  border-bottom-left-radius: var(--radius);
}

.stats:has(.chip:nth-child(4n)) .chip:last-child {
  border-bottom-right-radius: var(--radius);
}

/* if there are less than 5 chips children inside .stats give the last chip border radius */
.stats:not(:has(.chip:nth-child(4n))) .chip:last-child {
  border-top-right-radius: var(--radius);
  border-right: var(--border);
  border-color: var(--base-120);
}
</style>
