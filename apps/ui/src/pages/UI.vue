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

const options = [
  {
    name: "Fruit",
    children: [
      { name: "Apple" },
      { name: "Banana" },
      { name: "Orange" },
      { name: "Honeydew" },
      { name: "Grapes" },
      { name: "Watermelon" },
      { name: "Cantaloupe" },
      { name: "Pear" },
    ],
  },
  {
    name: "Vegetable",
    children: [
      { name: "Cabbage" },
      { name: "Broccoli" },
      { name: "Carrots" },
      { name: "Lettuce" },
      { name: "Spinach" },
      { name: "Bok Choy" },
      { name: "Cauliflower" },
      { name: "Potatoes" },
    ],
  },
];
</script>

<template>
  <div class="ui-wrapper">
    <header class="ui-hero">
      <h1>Umbraco Storybook</h1>
      <p>
        Umbraco is a collection of component built using the umbra theme management. Umbraco means allen wrench which is
        a tool that can be used for many purposes. Umbraco can also be a combination of the words umbra and components.
      </p>
    </header>

    <section id="radio" class="column">
      <h2>Slider</h2>
      <Slider />
    </section>

    <section id="chips">
      <h2>Chip</h2>
      <Chip size="mini">
        <p class="mini caption">Name Cvor</p>
      </Chip>
      <Chip>
        <p>Name Avor</p>
      </Chip>
      <Chip size="medium">
        <p>Name Bvor</p>
      </Chip>
    </section>

    <section id="chips">
      <h2>Select</h2>
      <Select size="medium" placeholder="Choose an option" :options="options" />
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
        <h3>Button Sizes</h3>
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

      <section class="column">
        <h3>Button groups</h3>

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
      <Graph :data="[
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
      ]" />
    </section>
  </div>
</template>

<style scoped>
.ui-hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
  padding: var(--space-2);
  border-radius: var(--radius);
  background-color: var(--base-10);
}

.ui-hero h1 {
  text-align: left;
}

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
