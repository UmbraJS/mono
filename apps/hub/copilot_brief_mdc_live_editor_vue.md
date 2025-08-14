# Fenrir — Live MDC Editor for Vue (MVP)

**Goal:** Build an Obsidian-style, in-place WYSIWYG editor for Nuxt MDC content where the source of truth is plain text (MDC), the preview renders components inline, and raw MDC is revealed only where the caret/selection is active.

You’ll get:
- `FenrirEditor` - the editor component.
- `MDCProvider`, `MDCContent`, `MDCProp`, `useMDCNode` - tiny runtime markers authors put inside their own MDC components so the editor can map slots/props back to MDC source ranges.
- A minimal demo with `components/mdc/Alert.vue` and `components/mdc/Badge.vue`.

> Keep it simple for MVP: basic parse, anchors, caret/selection/clipboard semantics.

---

## Project structure (Nuxt)

```
.
├─ nuxt.config.ts
├─ pages/
│  └─ index.vue
├─ components/
│  └─ mdc/
│     ├─ Alert.vue
│     └─ Badge.vue
└─ lib/
   └─ fenrir/
      ├─ runtime/
      │  ├─ index.ts
      │  ├─ MDCProvider.vue
      │  ├─ MDCContent.vue
      │  └─ MDCProp.vue
      └─ editor/
         ├─ index.ts
         ├─ FenrirEditor.vue
         └─ node-indexer.ts
```

**Dependencies to add**
```
pnpm add unified remark-parse remark-mdc unist-util-visit
# Types (optional)
pnpm add -D @types/unist
```

**nuxt.config.ts**
```ts
// nuxt.config.ts
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/components/mdc', pathPrefix: false }
  ],
  alias: {
    '@fenrir': fileURLToPath(new URL('./lib/fenrir', import.meta.url))
  },
  experimental: {
    // improves contenteditable behavior in dev HMR scenarios
    payloadExtraction: false
  }
})
```

---

## Runtime API (what MDC component authors use)

- `<MDCProvider>` - wraps an MDC component instance so the editor can pass context.
- `<MDCContent slot="default" unwrap="p" />` - declares where the default (or named) slot’s text goes.
- `<MDCProp name="title" />` - declares where a textual prop renders.
- `useMDCNode()` - opt-in helpers to enter/exit edit for a slot/prop.

Outside the editor, these behave like plain slots/strings (zero editor coupling).

---

## Editor behavior - caret, selection & clipboard (critical UX)

**Model:** One MDC source string. Each slot/prop becomes an **anchor** with `[data-from][data-to]` absolute offsets into that string. Preview mode hides MDC markers; edit mode shows raw MDC for the active region.

**Arrow keys**
- Left/Right - normal within a region; crossing a boundary flips preview/edit as needed.
- Down at end of a region → caret jumps to the start of the nearest region on the next visual line.  
  Up at start → caret jumps to the end of the nearest region on the previous visual line.
- Keep a “preferred X” column so repeated Up/Down stays aligned.
- If no region on that visual line, fall back to next/previous region in document order.

**Shift + arrows**
- Extends selection across regions seamlessly. The **model selection** becomes a single `[from, to]` over the MDC string, regardless of DOM splits.

**Word/line/document**
- Opt/Alt+Left/Right - word jumps within current region; may cross region boundaries.
- Cmd/Ctrl+Left/Right (or Home/End) - visual line start/end (can cross regions).
- Cmd/Ctrl+Up/Down - start/end of document.

**Copy/Cut/Paste**
- Copy: if selection touches any anchor, intercept and set clipboard to the exact MDC slice(s). Select-All → Copy returns the entire MDC string.
- Cut: same as Copy, then remove that slice from source.
- Paste: always insert as **plain text** at caret; reparse.

**Edit mode**
- Enter when caret enters a region (click, arrow, double-click).
- Exit when caret leaves, on Esc, or selection collapses elsewhere.
- Lock to region during IME (`compositionstart`..`compositionend`) to avoid jumps.

**Line map for Up/Down**
- Debounced after render, capture each anchor’s rect with `getBoundingClientRect()`.
- Bucket anchors by rounded Y; when moving Up/Down, pick closest X in adjacent bucket; else fallback to document order.

**Edge cases**
- Caret exactly between two anchors: bias to the one we came from (track last move direction).
- Hidden markers (like `::`) are part of the slot’s raw range; when the slot is in edit, markers become visible and selectable.
- Inline expressions `:Badge[Text]{...}` behave as a single region. Word moves inside when editing; skipped over when previewed.

**Acceptance**
- Down at end of region lands in next region below; Up at start lands in previous region above.
- Shift+Down across boundaries yields a contiguous MDC slice on Copy.
- Select-All copies the entire MDC string verbatim.
- IME doesn’t cause unexpected mode flips.

---

## Copilot tasks (run these in order)

1. **Create folders and files** exactly as in the tree above.
2. Paste the code stubs below into the matching files.
3. Wire `pages/index.vue` to `FenrirEditor` with `v-model`.
4. Implement `node-indexer.ts` to parse MDC and return node/region offsets.
5. In `FenrirEditor.vue`, render anchors with `data-from/data-to`, and implement:
   - `selectionchange` mapping DOM → model offsets,
   - keydown for Up/Down jumps,
   - copy/cut/paste interception that uses model ranges.
6. Replace placeholder preview slots with live rendering later (out of MVP scope).

---

## Files to generate

### `lib/fenrir/runtime/index.ts`
```ts
export { default as MDCProvider } from './MDCProvider.vue'
export { default as MDCContent } from './MDCContent.vue'
export { default as MDCProp } from './MDCProp.vue'

// Fenrir-prefixed aliases (optional)
export { default as FenrirProvider } from './MDCProvider.vue'
export { default as FenrirContent } from './MDCContent.vue'
export { default as FenrirProp } from './MDCProp.vue'

export * from './useMDCNode'
```

### `lib/fenrir/runtime/useMDCNode.ts`
```ts
import { inject, ref } from 'vue'

export function useMDCNode() {
  const ctx = inject<any>('MDC_EDITOR_CTX', null)
  const node = inject<any>('MDC_NODE', null)
  const editing = ref(false)

  function enterEdit(slot?: string) {
    editing.value = true
    ctx?.enterEdit?.(node?.id, slot)
  }
  function exitEdit() {
    editing.value = false
    ctx?.exitEdit?.()
  }

  return { editing, enterEdit, exitEdit }
}
```

### `lib/fenrir/runtime/MDCProvider.vue`
```vue
<script setup lang="ts">
import { provide } from 'vue'

// Outside the editor, provide a noop context
const noopCtx = {
  isEditing: () => false,
  enterEdit: () => {},
  exitEdit: () => {},
  getText: () => '',
  replaceText: () => {},
  renderSlot: () => [],
  renderProp: () => '',
  toRange: () => [0, 0]
}
provide('MDC_EDITOR_CTX', noopCtx)
// Give children an id if the editor injects one; noop here
provide('MDC_NODE', { id: 'noop' })
</script>

<template>
  <slot />
</template>
```

### `lib/fenrir/runtime/MDCContent.vue`
```vue
<script setup lang="ts">
import { computed, inject } from 'vue'
const props = defineProps<{ slot?: string, unwrap?: string | string[], fallback?: 'preview' | 'raw' }>()
const ctx = inject<any>('MDC_EDITOR_CTX', null)
const node = inject<any>('MDC_NODE', null)
const slotName = computed(() => props.slot || 'default')

// Outside editor: just slot through
if (!ctx || !node) {
  // @ts-ignore
}
</script>

<template>
  <slot :name="slot || 'default'" />
</template>
```

### `lib/fenrir/runtime/MDCProp.vue`
```vue
<script setup lang="ts">
const props = defineProps<{ name: string, editable?: boolean, as?: string }>()
</script>

<template>
  <!-- For now, render plain content. The editor will enhance this via context. -->
  <span><slot /> </span>
</template>
```

---

### `lib/fenrir/editor/index.ts`
```ts
export { default as FenrirEditor } from './FenrirEditor.vue'
```

### `lib/fenrir/editor/node-indexer.ts`
```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdc from 'remark-mdc'
import { visit } from 'unist-util-visit'

export type Region = {
  id: string
  kind: 'slot' | 'prop' | 'text' | 'mdc'
  from: number
  to: number
  nodeType: string
  // Optional future: slotName, propName
}

export type NodeMap = {
  regions: Region[]
  length: number
}

export function buildNodeMap(src: string): NodeMap {
  const tree = unified().use(remarkParse).use(remarkMdc as any).parse(src)
  const regions: Region[] = []
  let i = 0

  // MVP heuristic: treat any node with a position as a region; MDC nodes get kind 'mdc'
  visit(tree as any, (n: any) => {
    const start = n.position?.start?.offset
    const end = n.position?.end?.offset
    if (typeof start === 'number' && typeof end === 'number' && end > start) {
      const kind: Region['kind'] =
        n.type?.startsWith('mdc') ? 'mdc' : 'text'
      regions.push({ id: `r${i++}`, kind, from: start, to: end, nodeType: n.type })
    }
  })

  // Collapse overlaps (simple, stable order)
  regions.sort((a, b) => a.from - b.from || a.to - b.to)

  return { regions, length: src.length }
}
```

### `lib/fenrir/editor/FenrirEditor.vue` (MVP shell)
```vue
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { buildNodeMap, type Region } from './node-indexer'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const host = ref<HTMLDivElement | null>(null)
const text = ref(props.modelValue)
watch(() => props.modelValue, v => { text.value = v })
watch(text, v => emit('update:modelValue', v))

let nodeMap = buildNodeMap(text.value)
let selected: { from: number, to: number } = { from: 0, to: 0 }

function rebuild() {
  nodeMap = buildNodeMap(text.value)
  render()
}

function render() {
  if (!host.value) return
  // MVP: render plain text; later: render per-region spans with data-from/to
  host.value.innerText = text.value
}

function getModelSelection(): { from: number, to: number } {
  const sel = document.getSelection()
  if (!sel || !host.value || !host.value.contains(sel.anchorNode)) return { from: 0, to: 0 }
  const r = document.createRange()
  r.selectNodeContents(host.value)
  const r2 = document.createRange()
  r2.setStart(host.value, 0)
  r2.setEnd(sel.anchorNode!, sel.anchorOffset)
  const a = r2.toString().length
  if (sel.isCollapsed) return { from: a, to: a }
  const r3 = document.createRange()
  r3.setStart(host.value, 0)
  r3.setEnd(sel.focusNode!, sel.focusOffset)
  const b = r3.toString().length
  return { from: Math.min(a, b), to: Math.max(a, b) }
}

function onKeydown(e: KeyboardEvent) {
  if (!host.value) return
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    // TODO: implement line map + region boundary jumps per spec
    return
  }
  if (e.key === 'Escape') {
    // TODO: exit edit mode for current region
  }
}

function onInput() {
  const plain = host.value?.innerText ?? ''
  text.value = plain
  rebuild()
}

function onCopy(e: ClipboardEvent) {
  const sel = getModelSelection()
  if (sel.to > sel.from) {
    e.preventDefault()
    e.clipboardData?.setData('text/plain', text.value.slice(sel.from, sel.to))
  }
}

function onCut(e: ClipboardEvent) {
  const sel = getModelSelection()
  if (sel.to > sel.from) {
    e.preventDefault()
    e.clipboardData?.setData('text/plain', text.value.slice(sel.from, sel.to))
    text.value = text.value.slice(0, sel.from) + text.value.slice(sel.to)
    nextTick(rebuild)
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const paste = e.clipboardData?.getData('text/plain') ?? ''
  const sel = getModelSelection()
  text.value = text.value.slice(0, sel.from) + paste + text.value.slice(sel.to)
  nextTick(rebuild)
}

onMounted(() => {
  render()
  document.addEventListener('selectionchange', () => { selected = getModelSelection() })
  host.value?.addEventListener('keydown', onKeydown)
  host.value?.addEventListener('copy', onCopy as any)
  host.value?.addEventListener('cut', onCut as any)
  host.value?.addEventListener('paste', onPaste as any)
})
onBeforeUnmount(() => {
  host.value?.removeEventListener('keydown', onKeydown)
  host.value?.removeEventListener('copy', onCopy as any)
  host.value?.removeEventListener('cut', onCut as any)
  host.value?.removeEventListener('paste', onPaste as any)
})
</script>

<template>
  <div
    ref="host"
    class="fenrir-editor p-3 whitespace-pre-wrap outline-none"
    contenteditable="plaintext-only"
    @input="onInput"
  />
</template>

<style scoped>
.fenrir-editor { min-height: 240px; }
</style>
```

### `components/mdc/Alert.vue` (demo component using runtime markers later)
```vue
<script setup lang="ts">
defineProps<{ type?: 'info' | 'warning' | 'error', title?: string, note?: string }>()
</script>

<template>
  <div class="rounded border p-3" :data-type="type || 'info'">
    <header v-if="title" class="font-medium">
      <span>{{ title }}</span>
    </header>

    <div class="prose">
      <slot />
    </div>

    <footer v-if="note" class="opacity-70 text-sm">
      <em>{{ note }}</em>
    </footer>
  </div>
</template>
```

### `components/mdc/Badge.vue`
```vue
<script setup lang="ts">
defineProps<{ variant?: 'info' | 'success' | 'warning' | 'error' }>()
</script>

<template>
  <span class="inline-block px-2 py-0.5 rounded-full border text-xs align-baseline">
    <slot />
  </span>
</template>
```

### `pages/index.vue`
```vue
<script setup lang="ts">
import { ref } from 'vue'
import FenrirEditor from '@fenrir/editor/FenrirEditor.vue'

const src = ref(`# Fenrir demo

Try an inline component: :Badge[New]{variant="info"}

::alert{type="warning" title="Heads up"}
Be careful with dragons.
#note
Optional note here.
::`)
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto space-y-6">
    <h1 class="text-2xl font-semibold">Fenrir - MDC Live Editor (MVP)</h1>

    <FenrirEditor v-model="src" class="border rounded-lg" />

    <section>
      <h2 class="font-medium">Raw MDC (debug)</h2>
      <pre class="p-3 bg-gray-50 rounded whitespace-pre-wrap">{{ src }}</pre>
    </section>
  </div>
</template>
```
