<script setup lang="ts">
import { Button, ButtonGroup } from '@nobel/core'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import UserPanelWrapper from './UserPanelWrapper.vue'
import SettingsPanel from './SettingsPanel.vue'

const theme = useUmbra()
const hover = ref(false)
const hazeStrength = computed(() => {
  return hover.value ? '58px' : '28px'
})

type Tab = 'user' | 'settings'

const activeTab = ref<Tab>('user')
const expandedTab = ref(false)

function switchTab(tab: Tab) {
  if (activeTab.value === tab) {
    expandedTab.value = !expandedTab.value
  } else {
    activeTab.value = tab
    expandedTab.value = true
  }
}

function activeVariant(tab: Tab) {
  return activeTab.value === tab ? 'primary' : 'base'
}

const islandMenu = useTemplateRef<HTMLElement>('islandMenu')

onClickOutside(islandMenu, () => (expandedTab.value = false))
</script>

<template>
  <nav id="island-menu" ref="islandMenu" class="inverted-theme border" :class="{ expanded: expandedTab }"
    @mouseover="hover = true" @mouseleave="hover = false">
    <div class="island-panel">
      <UserPanelWrapper v-if="activeTab === 'user'" />
      <SettingsPanel v-if="activeTab === 'settings'" />
    </div>

    <ButtonGroup class="island-actions">
      <Button size="small" :variant="activeVariant('user')" @click="() => switchTab('user')">
        <Icon name="pixelarticons:user" size="1em" />
      </Button>

      <Button size="small" :variant="activeVariant('settings')" @click="() => switchTab('settings')">
        <Icon name="pixelarticons:sliders-2" size="1em" />
      </Button>

      <Button variant="base" size="small" @click="theme.inverse()">
        <Icon name="pixelarticons:card-text" />
      </Button>

      <Button :variant="theme.isDark ? 'primary' : 'base'" size="small" @click="theme.inverse()">
        <Icon name="pixelarticons:paint-bucket" />
      </Button>
    </ButtonGroup>
  </nav>
  <div class="haze island-position"></div>
</template>

<style>
#island-menu {
  z-index: 1000;
  position: fixed;
  width: min-content;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;

  border-radius: var(--radius);
  background-color: var(--base-10);
  border: solid var(--border-size) var(--base-50);
  border-radius: var(--outer-radius);
  overflow: hidden;

  bottom: var(--space-1);
  margin: auto;
  left: 0;
  right: 0;
}

.island-panel {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 0;
  width: 0;
  transition: var(--slow);
  overflow: hidden;
}

#island-menu.expanded .island-panel {
  height: auto;
  width: 30em;
}

#island-menu.expanded {
  gap: var(--space-quark);
}

.island-actions {
  display: flex;
  padding: var(--space-quark);
}

.island-position {
  position: fixed;
  bottom: var(--space-1);
  margin: auto;
  left: 0;
  right: 0;
}

.panel-wrapper {
  padding: var(--space-2);
}

.haze {
  height: var(--block-big);
  width: 123px;
  background: var(--accent);
  box-shadow: -0px 22px 115px v-bind(hazeStrength) var(--accent);
  border-radius: var(--outer-radius);
  z-index: 99;
  opacity: 1;
  transition: var(--slow);
  pointer-events: none;
}
</style>
