<template>
  <section class="PartyBoard">
    <slot/>
  </section>
</template>

<style>
section.PartyBoard {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 12;
  gap: var(--space-1);
}

section.PartyBoard>* {
  grid-column: span 4;
}
</style>
