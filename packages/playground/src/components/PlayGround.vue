<script setup lang="ts">
import PlayComponents from './PlayComponents.vue'

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
  text: 'var(--foreground)',
  button: 'var(--base-20)',
  buttonText: 'var(--foreground)',
  buttonHover: 'var(--base-30)',
  buttonHoverText: 'var(--foreground)',
  buttonActive: 'var(--base-40)',
  buttonActiveText: 'var(--foreground)',
  buttonDisabled: 'var(--base-10)',
  buttonDisabledText: 'var(--foreground)',
  panel: 'var(--base-20)',
  panelHeader: 'var(--base-30)',
  panelText: 'var(--foreground)',
  panelActive: 'var(--base-40)',
  panelActiveText: 'var(--foreground)'
})
</script>

<template>
  <div class="test">
    <PlayComponents border="var(--base-40)" text="var(--foreground)" button="var(--base-20)" />
    <PlayComponents
      border="var(--accent-40)"
      text="var(--accent-contrast)"
      button="var(--accent-20)"
      buttonText="var(--accent-constrast)"
      buttonHover="var(--accent-30)"
      buttonHoverText="var(--accent-constrast)"
      buttonActive="var(--accent-40)"
      buttonActiveText="var(--accent-constrast)"
      buttonDisabled="var(--accent-10)"
      buttonDisabledText="var(--accent-constrast)"
      panel="var(--accent-20)"
      panelHeader="var(--accent-30)"
      panelText="var(--accent-constrast)"
      panelActive="var(--accent-40)"
      panelActiveText="var(--accent-constrast)"
    />

    <PlayComponents
      border="var(--accent2-40)"
      text="var(--accent2-contrast)"
      button="var(--accent2-20)"
      buttonText="var(--accent2-constrast)"
      buttonHover="var(--accent2-30)"
      buttonHoverText="var(--accent2-constrast)"
      buttonActive="var(--accent2-40)"
      buttonActiveText="var(--accent2-constrast)"
      buttonDisabled="var(--accent2-10)"
      buttonDisabledText="var(--accent2-constrast)"
      panel="var(--accent2-20)"
      panelHeader="var(--accent2-30)"
      panelText="var(--accent2-constrast)"
      panelActive="var(--accent2-40)"
      panelActiveText="var(--accent2-constrast)"
    />

    <PlayComponents
      border="var(--success-40)"
      text="var(--success-contrast)"
      button="var(--success-20)"
      buttonText="var(--success-constrast)"
      buttonHover="var(--success-30)"
      buttonHoverText="var(--success-constrast)"
      buttonActive="var(--success-40)"
      buttonActiveText="var(--success-constrast)"
      buttonDisabled="var(--success-10)"
      buttonDisabledText="var(--success-constrast)"
      panel="var(--success-20)"
      panelHeader="var(--success-30)"
      panelText="var(--success-constrast)"
      panelActive="var(--success-40)"
      panelActiveText="var(--success-constrast)"
    />
  </div>
</template>

<style>
.test {
  padding: 100px 0px;
}
</style>
