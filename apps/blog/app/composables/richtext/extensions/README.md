# Tiptap MDC Extensions

This directory contains Tiptap extensions for rendering MDC (Markdown Components) within the Tiptap editor.

## Extensions

### Citation Extension

Renders a citation component with support for reliance, distance, and scope attributes.

**Usage:**

```typescript
import { Citation } from './extensions/Citation'

const editor = useEditor({
  extensions: [
    // ... other extensions
    Citation,
  ],
})

// Insert a citation
editor.commands.setCitation({
  reliance: 'deductive',
  distance: 'primary',
  scope: 'study',
})
```

**Attributes:**
- `reliance` - How the source supports the claim (deductive, inductive, irrelevant, contradiction)
- `distance` - How direct the source is (primary, secondary, hearsay)
- `scope` - The scope of the citation (study, review, meta-analysis)

### NarrativeFrame Extension

Renders a narrative frame component with support for claims, sources, and metadata.

**Usage:**

```typescript
import { NarrativeFrame } from './extensions/NarrativeFrame'

const editor = useEditor({
  extensions: [
    // ... other extensions
    NarrativeFrame,
  ],
})

// Insert a narrative frame
editor.commands.setNarrativeFrame({
  mood: 'neutral',
  type: 'premise',
  claims: [
    {
      description: 'The earth is round.',
      validity: 0.9,
      sources: [/* citation objects */]
    }
  ],
})
```

**Attributes:**
- `image` - Optional header image URL
- `mood` - The mood of the frame (positive, negative, neutral)
- `type` - The type of frame (premise, logic, normative)
- `claims` - Array of claims with sources

## Vue NodeViews

Both extensions use Vue components as node views:

- `CitationNodeView.vue` - Renders the citation UI with legend and metadata
- `NarrativeFrameNodeView.vue` - Renders the narrative frame with claims and sources

## Example

See `useTiptapWithMDC.ts` for a complete example of setting up an editor with both extensions.

```typescript
import { useEditorWithMDC } from './composables/richtext/useTiptapWithMDC'

const editor = useEditorWithMDC({
  content: '<p>Your content here</p>',
  onChange: (editor) => {
    console.log(editor.getHTML())
  },
})
```

## Customization

You can customize the appearance by modifying the styles in the respective Vue components:
- `/components/RichText/CitationNodeView.vue`
- `/components/RichText/NarrativeFrameNodeView.vue`

Both components use CSS custom properties (CSS variables) for theming.
