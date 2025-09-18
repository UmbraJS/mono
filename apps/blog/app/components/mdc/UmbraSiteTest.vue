<script lang="ts" setup>
import { computed } from 'vue'

// Accept an optional bag of CSS variables to override, keyed by your token names.
// If omitted, the component will read tokens from the page's CSS (recommended).
const props = withDefaults(defineProps<{
  tokens?: Record<string, string>
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  density?: 'comfortable' | 'compact'
  showPalette?: boolean
  animate?: boolean
  class?: string
}>(), {
  rounded: 'xl',
  density: 'comfortable',
  showPalette: true,
  animate: true,
})

const radiusPx: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', string> = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
}

// Only layout-related vars live here; color vars come from your design tokens.
const cssVars = computed(() => {
  const pad = props.density === 'compact' ? 12 : 20
  const gap = props.density === 'compact' ? 12 : 16
  return {
    '--pad': pad + 'px',
    '--gap': gap + 'px',
    '--radius': radiusPx[props.rounded],
    ...(props.tokens || {}), // allow inline overrides of your token vars
  } as Record<string, string>
})

// Palette order for the strip (edit to taste)
const palette = [
  '--base', '--base-20', '--base-40', '--base-60', '--base-80', '--base-text',
  '--accent-10', '--accent-50', '--accent-80', '--accent-100', '--accent-text',
  '--info-50', '--info-100', '--success-100', '--yellow-100', '--warning-100'
]
</script>

<template>
  <div class="preview" :class="[animate ? 'animate' : '']" :style="cssVars">
    <!-- NAVBAR -->
    <div class="row nav">
      <div class="nav-left">
        <div class="logo"></div>
        <div class="brand-bar"></div>
      </div>
      <div class="nav-right">
        <div class="pill"></div>
        <div class="pill"></div>
        <div class="pill"></div>
        <div class="cta"></div>
      </div>
    </div>
    <!--
    <!-- HERO -->
    <div class="grid hero">
      <div class="panel hero-copy">
        <div class="stack">
          <div class="line strong w-75"></div>
          <div class="line mute w-66"></div>
          <div class="line mute w-50"></div>
          <div class="buttons">
            <div class="btn primary"></div>
            <div class="btn ghost"></div>
          </div>
        </div>
      </div>
      <div class="panel hero-art">
        <div class="art"></div>
      </div>
    </div>

    <!-- CARDS -->
    <div class="grid cards">
      <div v-for="i in 6" :key="i" class="panel card">
        <div class="card-head">
          <div class="avatar accent"></div>
          <div class="meta">
            <div class="line strong w-60"></div>
            <div class="line mute w-70"></div>
          </div>
        </div>
        <div class="media"></div>
        <div class="actions">
          <div class="chip ghost"></div>
          <div class="chip primary"></div>
        </div>
      </div>
    </div>

    <!-- FORM + FEED -->
    <div class="grid formfeed">
      <div class="panel form">
        <div v-for="i in 3" :key="'f' + i" class="field">
          <div class="label"></div>
          <div class="input"></div>
        </div>
        <div class="form-actions">
          <div class="btn ghost small"></div>
          <div class="btn primary small"></div>
        </div>
      </div>
      <div class="panel feed">
        <div v-for="i in 4" :key="'feed' + i" class="post">
          <div class="avatar hollow"></div>
          <div class="post-body">
            <div class="line mute w-30"></div>
            <div class="line strong w-80"></div>
            <div class="line mute w-66"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- STATUS STRIP -->
    <div class="grid status">
      <div class="status-box ok"></div>
      <div class="status-box warn"></div>
      <div class="status-box danger"></div>
    </div> -->

    <!-- PALETTE STRIP -->
    <div v-if="showPalette" class="palette">
      <div v-for="(c, idx) in palette" :key="idx" class="swatch"
        :style="{ background: `var(${c})`, borderColor: `color-mix(in srgb, var(${c}) 30%, transparent)` }"></div>
    </div>
  </div>
</template>


<style scoped>
/* Container mapped to your tokens */
.preview {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  width: 100%;
  max-width: 64rem;
  background: var(--base);
  color: var(--base-text);
  border: 1px solid var(--base-50);
  border-radius: var(--radius);
  padding: var(--pad);
}

.preview.animate,
.preview * {
  transition: background-color 400ms, color 400ms, border-color 400ms, outline-color 400ms;
}

/* Utilities */
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap);
}

.grid {
  display: grid;
  gap: var(--gap);
}

.stack>*+* {
  margin-top: calc(var(--gap) * 0.75);
}

/* Navbar */
.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: calc(var(--gap) * 0.75);
}

.logo {
  width: 2rem;
  height: 2rem;
  border-radius: 12px;
  background: var(--accent-100, var(--accent));
}

.brand-bar {
  width: 4rem;
  height: 0.5rem;
  border-radius: 6px;
  background: color-mix(in srgb, var(--base-text) 70%, transparent);
}

.pill {
  width: 2.5rem;
  height: 1.5rem;
  border-radius: 8px;
  background: var(--base-20);
  border: 1px solid var(--base-50);
}

.cta {
  width: 4rem;
  height: 1.5rem;
  border-radius: 8px;
  background: var(--info-100, var(--info));
}

/* Hero */
.hero {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .hero {
    grid-template-columns: 1fr 1fr;
  }
}

.panel {
  background: var(--base-10);
  border: 1px solid var(--base-50);
  border-radius: var(--radius);
  padding: calc(var(--pad) * 0.8);
}

.hero-art {
  display: flex;
  align-items: center;
  justify-content: center;
}

.art {
  width: 100%;
  height: 10rem;
  border-radius: var(--radius);
  background: var(--base-20);
  border: 2px dashed var(--base-50);
}

@media (min-width: 768px) {
  .art {
    height: 12rem;
  }
}

/* Lines / textless blocks */
.line {
  height: 0.6rem;
  border-radius: 6px;
  background: color-mix(in srgb, var(--base-80) 70%, transparent);
}

.line.strong {
  background: color-mix(in srgb, var(--base-text) 80%, transparent);
}

.line.mute {
  background: color-mix(in srgb, var(--base-80) 60%, transparent);
}

.w-80 {
  width: 80%;
}

.w-75 {
  width: 75%;
}

.w-70 {
  width: 70%;
}

.w-66 {
  width: 66%;
}

.w-60 {
  width: 60%;
}

.w-50 {
  width: 50%;
}

.w-30 {
  width: 30%;
}

/* Buttons */
.buttons {
  display: flex;
  gap: calc(var(--gap) * 0.75);
  padding-top: calc(var(--gap) * 0.5);
}

.btn {
  height: 2rem;
  width: 6rem;
  border-radius: 10px;
}

.btn.primary {
  background: var(--accent-100, var(--accent));
  color: var(--accent-text);
}

.btn.ghost {
  background: var(--base-20);
  border: 1px solid var(--base-50);
}

.btn.small {
  height: 2.25rem;
  width: 5.5rem;
}

/* Cards */
.cards {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.card {
  padding: 1rem;
}

.card-head {
  display: flex;
  align-items: flex-start;
  gap: var(--gap);
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
}

.avatar.accent {
  background: var(--info-100, var(--info));
}

.avatar.hollow {
  border-radius: 9999px;
  background: var(--base-20);
  border: 1px solid var(--base-50);
  width: 2.5rem;
  height: 2.5rem;
}

.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.media {
  margin-top: 1rem;
  width: 100%;
  height: 6rem;
  border-radius: 10px;
  background: var(--base-20);
  border: 2px dashed var(--base-50);
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.chip {
  height: 1.75rem;
  width: 4rem;
  border-radius: 8px;
}

.chip.ghost {
  background: var(--base-20);
  border: 1px solid var(--base-50);
}

.chip.primary {
  background: var(--accent-100, var(--accent));
  color: var(--accent-text);
}

/* Form + Feed */
.formfeed {
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .formfeed {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.label {
  width: 6rem;
  height: 0.5rem;
  border-radius: 6px;
  background: color-mix(in srgb, var(--base-80) 70%, transparent);
}

.input {
  height: 2.25rem;
  border-radius: 10px;
  background: var(--base-20);
  border: 1px solid var(--base-50);
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
}

.feed {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post {
  display: flex;
  gap: var(--gap);
}

.post-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Status strip - mapped to your semantic colors */
.status {
  grid-template-columns: 1fr 1fr 1fr;
}

.status-box {
  height: 2rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
}

.status-box.ok {
  background: color-mix(in srgb, var(--success-100, var(--success)) 20%, transparent);
  border-color: color-mix(in srgb, var(--success-100, var(--success)) 40%, transparent);
}

.status-box.warn {
  background: color-mix(in srgb, var(--yellow-100, var(--yellow)) 20%, transparent);
  border-color: color-mix(in srgb, var(--yellow-100, var(--yellow)) 40%, transparent);
}

.status-box.danger {
  background: color-mix(in srgb, var(--warning-100, var(--warning)) 20%, transparent);
  border-color: color-mix(in srgb, var(--warning-100, var(--warning)) 40%, transparent);
}

/* Palette */
.palette {
  margin-top: var(--gap);
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  gap: 6px;
}

.swatch {
  height: 1.25rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--base-50) 40%, transparent);
}
</style>
