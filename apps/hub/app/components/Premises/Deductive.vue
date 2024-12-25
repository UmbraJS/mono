<script setup lang="ts"></script>

<template>
  <Premises>
    <div class="gutter"></div>
    <PremisesPremise>
      <div class="id">01</div>
      <p>All men are mortal</p>
    </PremisesPremise>
    <PremisesPremise>
      <div class="id">02</div>
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

.id {
  position: absolute;
  left: calc(0px - var(--block) / 2);

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;

  background-color: var(--accent-60);
  color: var(--accent-120);
  outline: solid var(--space-quark) var(--base-20);
  border: solid var(--border-size) var(--accent-120);

  width: max-content;
  height: var(--block);
  aspect-ratio: 1 / 1;

  font-weight: bold;
  margin-bottom: var(--space-1);
}
</style>
