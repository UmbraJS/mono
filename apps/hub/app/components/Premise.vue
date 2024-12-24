<script setup lang="ts"></script>

<template>
  <div class="arguments">
    <div class="argument">
      <div class="meta">Deductive Reasoning</div>
      <div class="conclution card">
        <p>Socrates is a mortal man</p>
      </div>
      <div class="premises">
        <div class="gutter"></div>
        <div class="premise card">
          <div class="id">01</div>
          <p>All men are mortal</p>
        </div>
        <div class="premise card">
          <div class="id">02</div>
          <p>Socrates is a man</p>
        </div>
      </div>
    </div>

    <div class="argument">
      <div class="conclution card">
        <p>Socrates is a mortal man</p>
      </div>
      <div class="inductive premises">
        <div class="premise card">
          <p>All men are mortal</p>
        </div>
        <div class="premise card">
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
  border: solid var(--border-size) var(--base-30);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.argument .card {
  padding: var(--space-2);
  padding-left: var(--space-3);
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-30);
}

.argument .conclution.card {
  /* background: var(--base-30); */
}

.argument .meta {
  position: absolute;
  top: calc(0px - var(--space-2));
  left: calc(var(--space-2));
  left: calc(0px - var(--border-size));
  background: var(--accent-50);
  border-radius: var(--radius);
  padding: var(--space-1);
  width: max-content;
  border: solid var(--border-size) var(--accent-60);
  font-weight: bold;
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

.argument .premises .gutter {
  grid-row: 1 / span 2;
  background-color: var(--base-10);
  width: var(--space-4);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-40);
}

.argument .premises .premise {
  position: relative;
}

.argument .premises .premise .id {
  position: absolute;
  left: calc(0px - var(--block) / 2);

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  outline: solid var(--space-quark) var(--base-20);
  border: solid var(--border-size) var(--base-100);

  background-color: var(--accent);
  color: var(--accent-contrast);

  width: max-content;
  height: var(--block);
  aspect-ratio: 1 / 1;

  font-weight: bold;
  margin-bottom: var(--space-1);
}
</style>
