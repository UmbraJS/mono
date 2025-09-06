<script setup lang="ts">
import { Button } from 'umbraco'
</script>

<template>
  <div class="wrapper">
    <div class="sizes">
      <div class="size" style="height: var(--space-1)"></div>
      <div class="size" style="height: var(--space-2)"></div>
      <div class="size" style="height: var(--space-3)"></div>
      <div class="size" style="height: var(--space-4)"></div>
      <div class="size" style="height: var(--space-5)"></div>
      <div class="size" style="height: var(--space-6)"></div>
      <div class="size" style="height: var(--space-7)"></div>
      <div class="size" style="height: var(--space-8)"></div>
      <div class="size" style="height: var(--space-9)"></div>
      <div class="size" style="height: var(--space-10)"></div>
    </div>
    <div class="blocks">
      <div class="block" style="height: var(--block-shell)"></div>
      <div class="block" style="height: var(--block-big)"></div>
      <div class="block" style="height: var(--block)"></div>
    </div>
    <div class="test">
      <div class="fig">
        <div class="cap"></div>
        <div class="m">
          <p>text height + space-s * 2</p>
        </div>
        <div class="cap"></div>
      </div>
      <Button>Block</Button>
    </div>
    <div class="radius">
      <div class="outer">
        <div class="inner"></div>
      </div>
    </div>
  </div>
</template>

<style>
.radius {
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  background-color: var(--accent-40);
  height: var(--block-shell);
  aspect-ratio: 1 / 1;

  border-radius: var(--outer-radius);
}

.radius .outer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--block-big);
  aspect-ratio: 1 / 1;
  background-color: var(--accent-60);
  border-radius: var(--radius);
}

.radius .inner {
  height: var(--block);
  aspect-ratio: 1 / 1;
  background-color: var(--accent-40);
  border-radius: var(--inner-radius);
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
}

.sizes {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  align-items: flex-end;
  height: min-content;
}

.size {
  width: var(--space-3);
  height: var(--space-3);
  background-color: var(--accent-60);
  border-radius: var(--inner-radius);
}

.blocks {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

.block {
  background-color: var(--accent-60);
  width: var(--space-3);
  border-radius: var(--inner-radius);
}

.test {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.fig {
  display: flex;
  flex-direction: column;
  border: solid var(--border-size) var(--accent-40);
  border-radius: var(--radius);
  overflow: hidden;
}

.fig .cap {
  width: 100%;
  height: var(--space-atom);
  background-color: var(--base-10);
}

.m {
  background-color: var(--accent-40);
  padding: 0px var(--space-1);
}

.m p {
  line-height: 1;
}
</style>
