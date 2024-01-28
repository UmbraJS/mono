<script setup lang="ts">
interface Props {
  border?: string
  text?: string
  button?: string
  buttonText?: string
  buttonHover?: string
  buttonHoverText?: string
  buttonActive?: string
  buttonActiveText?: string
  buttonDisabled?: string
  buttonDisabledText?: string
  panel?: string
  panelHeader?: string
  panelText?: string
  panelActive?: string
  panelActiveText?: string
}

withDefaults(defineProps<Props>(), {
  border: 'var(--base-40)',
  text: 'var(--base-120)',
  button: 'var(--base-20)',
  buttonText: 'var(--base-120)',
  buttonHover: 'var(--base-30)',
  buttonHoverText: 'var(--base-120)',
  buttonActive: 'var(--base-40)',
  buttonActiveText: 'var(--base-120)',
  buttonDisabled: 'var(--base-10)',
  buttonDisabledText: 'var(--base-120)',
  panel: 'var(--base-20)',
  panelHeader: 'var(--base-30)',
  panelText: 'var(--base-120)',
  panelActive: 'var(--base-40)',
  panelActiveText: 'var(--base-120)'
})
</script>

<template>
  <div class="playground">
    <div>
      <button>Click</button>
    </div>

    <div class="panel">
      <div class="panel__header">
        <h2>Panel</h2>
      </div>
      <div class="panel__body">
        <p>Panel body</p>
      </div>
    </div>

    <div class="panel" :style="{ border: `solid 1px ${border}` }">
      <div class="panel__header">
        <h2>Panel</h2>
      </div>
      <div class="panel__body">
        <p>Panel body</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playground {
  margin-top: 20px;
  display: flex;
  gap: 2rem;
}

.playground button {
  background: v-bind(button);
  color: v-bind(buttonText);
}

.playground button:hover {
  background: v-bind(buttonHover);
  color: v-bind(buttonHoverText);
}

.playground button:active {
  background: v-bind(buttonActive);
  color: v-bind(buttonActiveText);
}

.panel {
  width: 20rem;
  overflow: hidden;
  border-radius: 0.5rem;
  padding-bottom: 1rem;
  background: v-bind(panel);
}

.panel__header {
  background: v-bind(panelHeader);
  padding: 1rem;
  &:hover {
    background: v-bind(panelActive);
  }
}

.panel__body {
  padding: 1rem;
}
</style>
