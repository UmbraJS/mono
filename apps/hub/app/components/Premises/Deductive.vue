<script setup lang="ts"></script>

<template>
  <Premises>
    <div class="gutter"></div>
    <PremisesPremise>
      <PremisesPremiseId id="01" />
      <p>All men are mortal</p>
    </PremisesPremise>
    <PremisesPremise>
      <PremisesPremiseId id="02" />
      <p>Socrates is a man</p>
    </PremisesPremise>
  </Premises>
</template>

<style>
.gutter {
  grid-row: 1 / span 2;
  background-color: var(--base-10);
  width: var(--space-4);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}
</style>
