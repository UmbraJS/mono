<script setup lang="ts">
import ChipPassive from './ChipPassive.vue'
const store = useStore()
</script>

<template>
  <div id="ChipPassiveFinance">
    <ChipPassive>
      <Icon name="carbon:money" size="1.5em" />
      <p>{{ store.money.value }}</p>
      <p>(+{{ store.money.income }})</p>
    </ChipPassive>
    <ChipPassive v-if="store.money.totalValue > 0">
      <Icon name="carbon:money" size="1.5em" />
      <p>{{ store.money.totalValue }}</p>
    </ChipPassive>
    <ButtonBuyback v-if="store.money.soldCards.length > 0" />
  </div>
</template>

<style scoped>
#ChipPassiveFinance {
  display: flex;
  gap: var(--space-1);
}

#ChipPassiveFinance>*:last-child {
  flex: 1;
}

#ChipPassiveFinance> :first-child {
  flex: 1 1 auto;
}
</style>
