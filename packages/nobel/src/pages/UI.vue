<script setup lang="ts">
import ButtonGroup from '../components/ui/Button/ButtonGroup.vue'
import Button from '../components/ui/Button/Button.vue'
import ButtonToggle from '../components/ui/Button/Toggle.vue'
import Chip from '../components/ui/Chip/Chip.vue'
import Radio from '../components/ui/Radio/Radio.vue'
import IconHome from '../components/Icons/IconHome.vue'
import IconPaint from '../components/Icons/IconPaint.vue'
import Slider from '../components/ui/Slider/Slider.vue'
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
      <ButtonToggle>
        <template #active>
          <IconHome />
        </template>
        <template #inactive>
          <IconPaint />
        </template>
      </ButtonToggle>
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
  height: var(--block);
  border: solid var(--border-size) var(--base-50);
}

section#radio {
  flex-direction: column;
  padding: var(--space-quark);
  border: solid var(--border-size) var(--base-50);
}
</style>
