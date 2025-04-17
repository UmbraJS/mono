<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, ButtonGroup, Toggle, Chip, Radio, Slider, ButtonToggle, Tabs } from '@nobel/core'
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
          name: 'tab1',
          icon: 'pixelarticons:home',
        },
        {
          name: 'tab2',
          icon: 'pixelarticons:home',
        },

      ]">
        <template #tab1>
          <h2>Tab 1</h2>
          <p>Content for Tab 1</p>
        </template>

        <template #tab2>
          <h2>Tab 2</h2>
          <p>Content for Tab 2</p>
        </template>
      </Tabs>

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
