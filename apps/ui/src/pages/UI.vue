<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import {
  Button,
  ButtonGroup,
  Toggle,
  Chip,
  Radio,
  Slider,
  ButtonToggle,
  Tabs,
  Graph,
  Drawer,
} from "umbraco";
import Select from "../components/Select.vue";

const open = ref(false);
</script>

<template>
  <div class="ui-wrapper">
    <section id="radio" class="column">
      <h2>Slider</h2>
      <Slider />
    </section>
    <section id="chips">
      <h2>Chip</h2>
      <Chip />
      <Chip />
    </section>

    <section id="chips">
      <h2>Select</h2>
      <Select
        size="medium"
        placeholder="Choose an option"
        :options="[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
          { label: 'Option 4', value: 'option4' },
          { label: 'Option 5', value: 'option5' },
          { label: 'Option 6', value: 'option6' },
          { label: 'Option 7', value: 'option7' },
          { label: 'Option 8', value: 'option8' },
          { label: 'Option 9', value: 'option9' },
          { label: 'Option 10', value: 'option10' },
        ]"
      />
    </section>

    <section id="radio" class="column">
      <h2>Radio</h2>
      <Radio> condition </Radio>
      <Radio> condition </Radio>
      <Radio> condition </Radio>
    </section>

    <section class="column">
      <h2>Buttons</h2>
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
    </section>

    <section>
      <h2>Button Toggle</h2>
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

    <section class="column">
      <h2>Tabs</h2>
      <Tabs
        ariaLabel="Tabs example"
        :tabs="[
          {
            label: 'Some tab',
            icon: 'pixelarticons:home',
          },
          {
            label: 'Some other tab',
            icon: 'pixelarticons:home',
          },
        ]"
      >
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

    <section class="column">
      <h2>Drawer</h2>
      <Drawer>
        <template #trigger>
          <div variant="primary">
            <Icon icon="pixelarticons:home" />
          </div>
        </template>

        <template #content>
          <h2>Drawer Content</h2>
          <p>This is the content inside the drawer.</p>
          <Button variant="secondary">Close Drawer</Button>
        </template>
      </Drawer>
    </section>

    <section class="graph column">
      <h2>Graph</h2>
      <Graph
        :data="[
          { x: 1, y: 2, y1: 3, y2: 4 },
          { x: 20, y: 5, y1: 6, y2: 6 },
          { x: 30, y: 4, y1: 5, y2: 8 },
          { x: 40, y: 6, y1: 6, y2: 7 },
          { x: 50, y: 6, y1: 7, y2: 8 },
          { x: 60, y: 7, y1: 8, y2: 6 },
          { x: 70, y: 5, y1: 4, y2: 10 },
          { x: 80, y: 9, y1: 10, y2: 11 },
          { x: 90, y: 8, y1: 11, y2: 10 },
          { x: 100, y: 11, y1: 12, y2: 13 },
          { x: 110, y: 12, y1: 14, y2: 12 },
        ]"
      />
    </section>
  </div>
</template>

<style scoped>
.ui-wrapper {
  display: flex;
  gap: var(--space-2);
  flex-direction: column;
  max-width: 40em;
}

section.column {
  flex-direction: column;
}

section {
  display: flex;
  gap: var(--space-quark);
  padding: var(--space-1);
  border-radius: var(--radius);
  background-color: var(--base-10);
}

section h2 {
  margin-right: var(--space-1);
}
</style>
