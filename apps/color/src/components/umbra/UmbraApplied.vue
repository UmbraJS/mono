<script setup lang="ts">
import { ref, onBeforeUpdate } from 'vue';
import { umbra } from '@umbrajs/core';
import type { ComponentPublicInstance } from 'vue';
import { useUmbra } from '../../stores/useUmbra';

const umbraStore = useUmbra();

const themes = [
  {
    name: "Starfish",
    background: "#0B1A2D",
    foreground: "#FFFFFF",
    accents: ["#FF6F61", "#6B5B95", "#88B04B"],
  },
  {
    name: "Sunset",
    background: "#310000",
    foreground: "#d3bcfe",
    accents: ["#fe10d6", "#FFD97D", "#FF6F91"],
  },
  {
    name: "Forest",
    background: "#1B2A20",
    foreground: "#E6F2E1",
    accents: ["#A3CFA0", "#6B8E23", "#C4DFAA"],
  },
  {
    name: "Starfish L",
    background: "#FFFFFF",
    foreground: "#0B1A2D",
    accents: ["#FF6F61", "#6B5B95", "#88B04B"],
  },
  {
    name: "Sunset L",
    background: "#d3bcfe",
    foreground: "#310000",
    accents: ["#fe10d6", "#FFD97D", "#FF6F91"],
  },
  {
    name: "Forest L",
    background: "#E6F2E1",
    foreground: "#1B2A20",
    accents: ["#A3CFA0", "#6B8E23", "#C4DFAA"],
  }
]

const themeRefs = ref<HTMLButtonElement[]>([])

onBeforeUpdate(() => {
  themeRefs.value = []
})

async function applyThemeToElement(index: number) {
  const element = themeRefs.value[index]
  const themeInput = themes[index]
  if (!element || !themeInput) return

  await umbra({
    background: themeInput.background,
    foreground: themeInput.foreground,
    accents: themeInput.accents,
  }).apply({
    target: element,
  })
}

function setThemeRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!(el instanceof HTMLButtonElement)) return
  themeRefs.value[index] = el
  applyThemeToElement(index)
}

async function applyTheme(themeName: string) {
  const themeIndex = themes.findIndex((t) => t.name === themeName)
  if (themeIndex === -1) return

  const selectedTheme = themes[themeIndex]
  if (!selectedTheme) return

  umbraStore.setActiveTheme(selectedTheme.name)
  themeRefs.value[themeIndex]?.focus()

  await umbraStore.apply({
    scheme: {
      background: selectedTheme.background,
      foreground: selectedTheme.foreground,
      accents: selectedTheme.accents,
    }
  })
}
</script>

<template>
  <div class="SpacingTokens">
    <div class="AliasedWrapper">
      <div class="MyUmbraActions">
        <button v-for="(value, index) in themes" :key="value.name" :ref="(el) => setThemeRef(el, index)"
          :class="['Theme', { active: umbraStore.activeThemeName === value.name }]"
          :aria-pressed="umbraStore.activeThemeName === value.name" @click="applyTheme(value.name)">
          <div class="AccentRange">
            <div class="PrimaryAccent"></div>
            <div class="AccentShade1"></div>
            <div class="AccentShade2"></div>
            <div class="AccentShade3"></div>
          </div>
          <div class="ThemeInfo">
            <p class=""><span>{{ value.name }}</span></p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
}

.AliasedWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  justify-content: center;
  align-items: center;
  width: 100%;
}

.section-title {
  margin: 0;
  color: var(--base-text);
  font-size: var(--font-size-5);
}

.MyUmbraActions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
  width: 100%;
  max-width: 800px;
  justify-content: center;
  align-items: center;
}

button.Theme {
  background-color: var(--base);
  border: 1px solid var(--base-40);
  color: var(--base-120);
  border-radius: var(--radius);
  cursor: pointer;
  overflow: hidden;
  width: 100%;
  transition: all 0.2s ease;
}

button.Theme:hover {
  border-color: var(--accent-100);
  transform: translateY(-2px);
}

button.Theme:active {
  border-color: var(--accent-120);
}

button.Theme.active {
  outline: solid 4px var(--accent-100);
  box-shadow: 0 0 0 2px var(--accent-80);
}

.ThemeInfo {
  display: flex;
  padding: var(--space-2);
}

.ThemeInfo p {
  color: var(--base-120);
  margin: 0;
}

.AccentRange {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  height: 40px;
  width: 100%;
}

.PrimaryAccent {
  background-color: var(--accent-100);
}

.AccentShade1 {
  background-color: var(--accent-80);
}

.AccentShade2 {
  background-color: var(--accent-60);
}

.AccentShade3 {
  background-color: var(--accent-40);
}
</style>
