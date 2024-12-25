<script setup lang="ts">
const reasons = ref([
  {
    type: 'Deductive Reasoning',
    conclution: 'Socrates is mortal',
    premises: [
      {
        type: 'premise',
        text: 'All men are mortal',
      },
      {
        type: 'premise',
        text: 'Socrates is a man',
      },
    ],
  },
  {
    type: 'Inductive Reasoning',
    conclution: 'Socrates is a mortal',
    premises: [
      {
        type: 'infavor',
        text: 'lol',
      },
      {
        type: 'inopposition',
        text: 'lol',
      },
    ],
  },
])
</script>

<template>
  <div class="arguments">
    <div class="argument">
      <div class="meta"><p>Deductive Reasoning</p></div>
      <div class="conclution card">
        <p>Socrates is a mortal man</p>
      </div>
      <PremisesDeductive />
    </div>

    <div class="argument">
      <div class="meta"><p>Inductive Reasoning</p></div>
      <div class="conclution card">
        <p>Socrates is a mortal man</p>
      </div>
      <div class="inductive premises">
        <div class="premise infavor card">
          <p>All men are mortal</p>
        </div>
        <div class="premise inopposition card">
          <p>Socrates is a man</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.arguments {
  display: grid;
  gap: var(--space-4);
}

.argument {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background-color: var(--base-20);
  border: solid var(--border-size) var(--base-60);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.argument .card {
  padding: var(--space-2);
  padding-left: var(--space-3);
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}

.argument .conclution.card {
  /* background: var(--base-30); */
}

.argument .meta {
  display: flex;
  align-items: center;
  position: absolute;
  top: calc(0px - var(--block-big) + var(--space-2));
  left: calc(var(--space-2));
  left: calc(0px - var(--border-size));
  background: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
  padding: 0px var(--space-1);
  width: max-content;
  height: var(--block-big);
  border: solid var(--border-size) var(--base-60);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom: 0px;
  /* font-weight: bold; */
  transition: color var(--slower);
}

.argument .premises {
  display: grid;
  gap: var(--space-1);
  grid-template-columns: auto 1fr;
}

.argument .premises.inductive {
  display: grid;
  gap: var(--space-1);
  grid-template-columns: 1fr 1fr;
}

.argument .premises.inductive .premise.infavor {
  background: var(--success-40);
  color: var(--success-120);
  border: solid var(--border-size) var(--success-120);
}

.argument .premises.inductive .premise.inopposition {
  background: var(--warning-40);
  color: var(--warning-120);
  border: solid var(--border-size) var(--warning-120);
}

.argument .premises .gutter {
  grid-row: 1 / span 2;
  background-color: var(--base-10);
  width: var(--space-4);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}

.argument .premises .premise {
  position: relative;
  transition: var(--slower);
}

.argument .premises .premise .id {
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
