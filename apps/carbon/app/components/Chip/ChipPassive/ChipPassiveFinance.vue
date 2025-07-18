<script setup lang="ts">
const store = useStore()
</script>

<template>
  <ChipPassive>
    <Icon name="carbon:money" size="1.5em" />
    <p>{{ store.money.value }}</p>
    <p>(+{{ store.money.income }})</p>
  </ChipPassive>
</template>
