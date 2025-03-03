<script setup lang="ts">
import {
  Select,
  Button,
  ButtonGroup,
  Toggle,
  Chip,
  Radio,
  Slider,
  IconHome,
  IconPaint,
  ButtonToggle,
} from '@nobel/core'
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

    <!-- <Select /> -->

    <section class="buttons">
      <Button variant="primary" size="mini">
        <IconHome size="mini" />
      </Button>
      <Button variant="secondary" size="small">
        <IconHome size="small" />
      </Button>
      <Button>
        <IconHome size="medium" />
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

    <ButtonGroup>
      <Button size="mini">
        <IconHome size="mini"></IconHome>
      </Button>
      <Button size="mini">
        <IconHome size="mini"></IconHome>
      </Button>
      <Button size="mini">
        <IconHome size="mini"></IconHome>
      </Button>
    </ButtonGroup>

    <section>
      <ButtonToggle>
        <template #active>
          <IconHome />
        </template>
        <template #inactive>
          <IconPaint />
        </template>
      </ButtonToggle>
      <Toggle variant="primary" />
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
