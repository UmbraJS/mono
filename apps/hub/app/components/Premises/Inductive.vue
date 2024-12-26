<script setup lang="ts"></script>

<template>
  <Premises class="inductive">
    <PremisesPremise type="infavor">
      <p>All men are mortal</p>
    </PremisesPremise>
    <PremisesPremise type="inopposition">
      <p>Socrates is a man</p>
    </PremisesPremise>
  </Premises>
</template>

<style>
.premises.inductive {
  display: grid;
  gap: var(--space-1);
  grid-template-columns: 1fr 1fr;
}
</style>
