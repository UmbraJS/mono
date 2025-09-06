<script setup lang="ts">
import SidebarList from './SidebarList.vue'

const projects = [
  { name: "Moonbow", href: undefined, description: "A simpler API for webGPU.", status: "v1.1.0", type: "library" },
  { name: "Umbra", href: undefined, description: "A color theme management function", status: "v0.3.0", type: "library" },
  { name: "Carbon Bizarre", href: undefined, description: "An open world roguelike card game inspired by the bazaar", status: "private", type: "game" },
  { name: "Bifrost", href: undefined, description: "A tool to let you draw SVG lines between elements", status: "private", type: "library" },
  { name: "Formula", href: undefined, description: "A no-nonsense form hook for managing dirty state", status: "planning", type: "library" },
]

function getIconForType(type?: string) {
  switch (type) {
    case 'game':
      return 'carbon:game-console'
    case 'library':
      return 'carbon:code'
    default:
      return 'carbon:folder'
  }
}

function statusKind(status?: string) {
  const s = status?.toLowerCase().trim()
  if (!s) return ''
  if (s === 'private' || s === 'planning') return s
  if (s.startsWith('v')) {
    const match = s.slice(1).match(/^(\d+)/)
    if (match && match[1] && match[1][0] === '0') return 'v-zero'
    return 'v'
  }
  return s
}
</script>

<template>
  <SidebarList :title="'Projects'" :count="projects.length">
    <NuxtLink v-for="project in projects" :key="project.name" class="project-item border" :to="project.href ?? ''"
      tabindex="0" role="link" aria-label="Project card">
      <div class="project-row">
        <div class="MetaHeader">
          <Icon :name="getIconForType(project.type)" size="1.2em" class="icon" />
          <p class="project-name">{{ project.name }}</p>
        </div>
        <span class="project-status" :data-kind="statusKind(project.status)">{{ project.status }}</span>
      </div>
      <p class="project-description caption">{{ project.description }}</p>
    </NuxtLink>
  </SidebarList>
</template>

<style scoped>
.MetaHeader {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.project-item {
  display: grid;
  gap: var(--space-quark);
  background: var(--base);
  border-radius: var(--radius);
  border-color: var(--base-20);
  padding: var(--space-1);
  padding-bottom: var(--space-2);
  padding-left: var(--space-2);
  cursor: pointer;
}

.project-item:hover {
  border-color: var(--accent-80);
  background: var(--base-10);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.project-item:active {
  background: var(--accent-100);
  color: var(--accent);
}

.project-item:focus-visible {
  outline: 2px solid var(--accent-80);
  outline-offset: 2px;
}

.project-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-1);
}

.project-status {
  font-size: 0.75rem;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid var(--base-30);
  background: var(--base-10);
  color: var(--base-120);
  transition: background-color var(--fast), color var(--fast), border-color var(--fast);
}

/* simple status tints */
.project-status[data-kind='v'] {
  border-color: var(--success-80);
  background: var(--success-20);
  color: var(--success-120);
}

.project-status[data-kind='v-zero'] {
  border-color: var(--yellow-80);
  background: var(--yellow-20);
  color: var(--yellow-120);
}

.project-status[data-kind='private'] {
  border-color: var(--warning-80);
  background: var(--warning-20);
  color: var(--warning-120);
}

.project-status[data-kind='planning'] {
  border-color: var(--accent-80);
  background: var(--accent-20);
  color: var(--accent-120);
}
</style>
