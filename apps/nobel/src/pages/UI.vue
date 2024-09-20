<script setup lang="ts">
import { Button, ButtonGroup, Toggle, Chip, Radio, Slider, IconHome, IconPaint } from '@nobel/core'
</script>

<template>
  <div class="ui-wrapper">
    <section id="chips">
      <h2>Chip</h2>
      <Chip />
      <Chip />
    </section>
    <section id="radio">
      <Radio> condition </Radio>
      <Radio> condition </Radio>
      <Radio> condition </Radio>
    </section>
    <Button variant="primary">
      <IconHome />
      <p>Primary</p>
    </Button>
    <Button variant="secondary">
      <IconHome />
      <p>Secondary</p>
    </Button>
    <Button>
      <IconHome />
      <p>Base</p>
    </Button>
    <Button disabled>
      <IconHome />
      <p>Disabled</p>
    </Button>

    <section class="buttons">
      <Button variant="primary" size="small">
        <IconHome />
      </Button>
      <Button variant="secondary">
        <IconHome />
      </Button>
      <Button>
        <IconHome />
      </Button>
    </section>

    <ButtonGroup>
      <Button size="small">
        <IconHome />
      </Button>
      <Button size="small">
        <IconHome />
      </Button>
      <Button size="small">
        <IconHome />
      </Button>
    </ButtonGroup>

    <section>
      <Toggle>
        <template #active>
          <IconHome />
        </template>
        <template #inactive>
          <IconPaint />
        </template>
      </Toggle>
    </section>

    <Slider />
  </div>
</template>

<style>
.ui-wrapper {
  display: flex;
  gap: var(--space-1);
  flex-direction: column;
  padding: var(--space-1);
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-quark);
  padding: 0 var(--space-quark);
  border-radius: var(--radius);
  background-color: var(--base-10);
}

section#chips {
  height: var(--block-big);
  border: solid var(--border-size) var(--base-50);
}

section#radio {
  flex-direction: column;
  padding: var(--space-quark);
  border: solid var(--border-size) var(--base-50);
}
</style>
