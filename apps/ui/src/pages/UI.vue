<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, ButtonGroup, Toggle, Chip, Radio, Slider, ButtonToggle, Tabs, Graph } from '@nobel/core'
</script>

<template>
  <div class="ui-wrapper">
    <Slider />

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
      <Icon icon="pixelarticons:home" />
      <p>Primary</p>
    </Button>
    <Button variant="secondary">
      <Icon icon="pixelarticons:home" />
      <p>Secondary</p>
    </Button>
    <Button>
      <Icon icon="pixelarticons:home" />

      <p>Base</p>
    </Button>
    <Button disabled>
      <Icon icon="pixelarticons:home" />

      <p>Disabled</p>
    </Button>

    <!-- <Select /> -->

    <section class="buttons">
      <Button variant="primary" size="mini">
        <Icon icon="pixelarticons:home" />
      </Button>
      <Button variant="secondary" size="small">
        <Icon icon="pixelarticons:home" />
      </Button>
      <Button>
        <Icon icon="pixelarticons:home" />
      </Button>
    </section>

    <ButtonGroup>
      <Button size="small">
        <Icon icon="pixelarticons:home" />
      </Button>
      <Button size="small">
        <Icon icon="pixelarticons:home" />
      </Button>
      <Button size="small">
        <Icon icon="pixelarticons:home" />
      </Button>
    </ButtonGroup>

    <ButtonGroup>
      <Button size="mini">
        <Icon icon="pixelarticons:home" />
      </Button>
      <Button size="mini">
        <Icon icon="pixelarticons:home" />
      </Button>
      <Button size="mini">
        <Icon icon="pixelarticons:home" />
      </Button>
    </ButtonGroup>

    <section>
      <ButtonToggle>
        <template #active>
          <Icon icon="pixelarticons:home" />
        </template>
        <template #inactive>
          <Icon icon="pixelarticons:paint-bucket" />
        </template>
      </ButtonToggle>
      <Toggle :value="false" />
    </section>

    <section>

      <Tabs ariaLabel="Tabs example" :tabs="[
        {
          label: 'Some tab',
          icon: 'pixelarticons:home',
        },
        {
          label: 'Some other tab',
          icon: 'pixelarticons:home',
        },

      ]">
        <template #tab1="props">
          <h2>{{ props.label }}</h2>
          <p>Content for Tab 1</p>
        </template>

        <template #tab2="props">
          <h2>{{ props.label }}</h2>
          <p>Content for Tab 2</p>
        </template>
      </Tabs>

    </section>

    <section class="graph">
      <h2>Graph</h2>
      <Graph :data="[
        { x: 1, y: 2, y1: 3, y2: 4 },
        { x: 20, y: 3, y1: 4, y2: 5 },
        { x: 30, y: 4, y1: 5, y2: 6 },
        { x: 40, y: 5, y1: 6, y2: 7 },
        { x: 50, y: 6, y1: 7, y2: 8 },
        { x: 60, y: 7, y1: 8, y2: 9 },
        { x: 70, y: 8, y1: 9, y2: 10 },
        { x: 80, y: 9, y1: 10, y2: 11 },
        { x: 90, y: 10, y1: 11, y2: 12 },
        { x: 100, y: 11, y1: 12, y2: 13 },
        { x: 110, y: 12, y1: 13, y2: 14 },
      ]" />

    </section>
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

section.graph {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
  padding: var(--space-4);
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
