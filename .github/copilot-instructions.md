# Copilot Instructions for This Monorepo

These instructions define how Copilot should behave in this repository.

The priorities are:

1. **Functional, predictable code** (pure functions, minimal state, early returns)
2. **Clear boundaries in the monorepo**
3. **Centralized theming and UI via shared packages**
4. **UX that respects attention, time, and identity**

If a suggestion conflicts with these rules, **prefer the rules**.


## 1. Tech & Monorepo Overview

- Package manager: **pnpm**
- Bundler: **Vite**
- Framework: **Nuxt + Vue 3 + TypeScript**
- Frontend tools: **VueUse**, **GSAP**, **WebGPU**, **SVG**
- Style: **functional-first**, minimal mutation, low nesting

Rough structure (conceptual):

- `apps/blog` – Noble: main social / identity / ideas app (currently “blog”, will become full social)
- `apps/carbon` – Card game (will later live inside Fenrir, a “Steam for web games”)
- `apps/pulse` – Workplace / time management / internal LinkedIn-style app (currently named pulse)
- `apps/color` – Umbra testbed
- `apps/ui` – Umbraco testbed
- `apps/gpu` – Moonbow testbed

Key packages:

- `packages/umbra`   – Theming + color system (APCA, CSS vars, semantic accents)
- `packages/umbraco` – Shared UI component library (built on Umbra + reka-ui, compound components)
- `packages/dye`     – Color picker / theme editor for Umbra
- `packages/moonbow` – Shader helpers for WebGPU, render to shapes
- `packages/bifrost` – SVG spline connections between elements
- `packages/convue`  – Convex + Nuxt + better-auth integration
- `packages/formula` – Form library with change tracking, diffing, and Zod validation

**Copilot: when choosing where to put or read code, follow this structure.**


## 2. Dependency & Architecture Rules (Strict)

### 2.1 Allowed directions

- `apps/*` **may depend on** `packages/*`
- `packages/*` **must not depend on** `apps/*`
- `packages/umbra` is at the bottom of the stack:
  - No dependencies on other internal packages or apps
- `packages/umbraco`:
  - May depend on `umbra` and external UI libs (e.g. reka-ui)
  - No dependencies on apps
- `packages/dye`, `packages/moonbow`, `packages/bifrost`, `packages/convue`, `packages/formula`:
  - May depend on relevant external libs and core internal packages
  - Must not depend on apps

**Copilot: never suggest imports from an app inside a package.  
If you see that pattern, propose moving shared logic into a package instead.**

### 2.2 Where new code goes

- **Shared UI / design primitives** → `packages/umbraco`
- **Theming / colors / tokens** → `packages/umbra` (or consume from it)
- **Color picking / theme editing UI** → `packages/dye`
- **WebGPU / shader helpers** → `packages/moonbow`
- **SVG connection / link visuals** → `packages/bifrost`
- **Convex + auth integration** → `packages/convue`
- **Form state management / validation** → `packages/formula`
- **Product-specific logic**:
  - `apps/blog` for Noble (social / ideas)
  - `apps/carbon` for the game
  - `apps/pulse` for workplace/time/culture

**Copilot: if a suggestion is reusable across apps, prefer placing it in a package and importing it.**


## 3. Coding Style (Strict)

### 3.1 Functional-first

- Prefer **pure functions**:
  - No mutation of arguments
  - No hidden writes to outer scopes
  - No unnecessary shared mutable state
- Prefer **data-in → data-out** utilities over stateful services
- Avoid side effects except in clearly defined, localized places (composables, lifecycle hooks)

### 3.2 Variables & mutation

- Use `const` by default
- Avoid `let` unless:
  - Mutation is absolutely necessary
  - The scope is very small (a few lines)
  - It improves clarity
- Never use `var`
- Prefer immutable operations:
  - `map`, `filter`, `reduce`, spreads
  - Avoid in-place mutation (`push`, `splice`, etc.) unless tightly scoped and intentional

**Copilot: when suggesting code, always start with `const` and immutable transforms.  
Only choose `let` when there is no clean immutable alternative.**

### 3.3 Control flow: guard clauses over nesting

- Prefer **early returns** to reduce nesting
- Soft limit of **2 levels of indentation**
- Break complex conditions into small, well-named helpers

Bad:

```ts
function handleUser(user?: User, options?: Options) {
  const actions: Action[] = []

  if (user) {
    if (user.isActive) {
      if (options?.shouldNotify) {
        actions.push(buildNotification(user))
      }
      actions.push(buildAuditEntry(user))
    } else {
      logInactive(user)
    }
  }

  return actions
}
```

Good:
```ts
function handleUser(user?: User, options?: Options): Action[] {
  if (!user) return []
  if (!user.isActive) {
    logInactive(user)
    return []
  }

  const actions: Action[] = []

  if (options?.shouldNotify) {
    actions.push(buildNotification(user))
  }

  actions.push(buildAuditEntry(user))

  return actions
}
```

Copilot: always prefer the “Good” style. If you’re about to generate nested if/else, look for guard-clauses instead.

3.4 Functions

Keep functions small and focused

If a function is doing multiple conceptual things, split it

- If a function grows beyond ~30 lines, suggest extracting helpers


## 4. Vue / Nuxt Conventions

- Use `<script setup lang="ts">` in Vue SFCs
- Use composables for shared logic and side effects
- Keep Nuxt pages thin:
  - Routing and high-level wiring
  - Minimal business logic (push it into composables or packages)
- Use VueUse when it clearly simplifies reactive utilities or browser APIs
- Use GSAP through well-encapsulated helpers/composables (not scattered raw calls)

**Copilot: when adding logic to a component, prefer creating a small composable and consuming it.**


## 5. CSS Conventions & Styling

### 5.1 No preprocessors or utility frameworks

- Use **pure CSS only** – no Tailwind, no SCSS
- Vue's scoped CSS provides organization without preprocessors
- Stay close to native CSS to leverage new features (functions, mixins, etc.)
- Take advantage of CSS cascading for flexible design systems

**Copilot: never suggest Tailwind classes or SCSS syntax. Use native CSS features.**

### 5.2 CSS class naming system

We use a modified CUBE/BEM approach with three class types:

#### Element Names (PascalCase)

- Purpose: Name specific UI elements and control their appearance
- Make DOM structure map to code structure
- Should be specific enough to avoid confusion

```html
<button class="CounterButton">Count: 0</button>
<div class="UserChip">User 01</div>
```

#### Abstracted Classes (lowercase)

- Purpose: Describe abstract concepts, common property groups
- Act as shorthand for reusable design patterns
- Should mix and match easily

```html
<div class="button rounded border">Click me</div>
```

#### Abstract Mods (camelCase)

- Purpose: Modify abstract classes with variants, states, or sizes
- Allow picking and choosing style aspects
- Examples: `buttonMedium`, `buttonPrimary`, `buttonHover`, `buttonActive`

```html
<button class="button buttonMedium buttonText buttonPrimary buttonHover">
  Submit
</button>
```

**Use cases for Abstract Mods:**
- **State**: `buttonHover`, `buttonActive`, `buttonFocus`
- **Size**: `buttonSmall`, `buttonMedium`, `buttonLarge`
- **Variant**: `buttonPrimary`, `buttonSecondary`, `buttonBase`
- **Style aspect**: `buttonText` (for text styling separate from button chrome)

This system allows composing elements from reusable parts while maintaining flexibility. For example, an input can use `button buttonMedium` classes but skip `buttonText` to use different text styling.

#### Token Conversions (kebab-case)

- Purpose: Remap one Umbra token range to another
- Allows quick theme switching for entire sections
- Examples: `base-accent`, `base-warning`, `base-success`

```html
<div class="card base-warning">
  <h2 class="heading">Warning Card Title</h2>
  <p class="body">Warning Card body text</p>
  <button class="button buttonMedium buttonPrimary">Warning Action</button>
</div>
```

**Copilot: follow this naming system strictly:**
- PascalCase for specific element names
- lowercase for abstract classes
- camelCase for abstract mods
- kebab-case for token conversions


## 6. Theming & Design (Umbra-first)

### 6.1 Umbra is the single source of truth for colors

- All theming and color systems should use Umbra
- Do not introduce ad hoc color tokens or hardcoded hex colors when the Umbra tokens can handle it
- Prefer semantic accents:
  - primary, success, danger, warning, info, etc.
- Use Umbra-generated CSS variables:
  - `--base-*`, `--accent-*`, `--success-*`, etc.

#### Umbra Range Structure

Each Umbra color range contains **14 tokens** with a specific structure:

- **Base token** (unnumbered): `--base`, `--accent`, `--success`, etc.
- **Numbered tokens** (incremented by 10s): `--base-10`, `--base-20`, ... `--base-120`
- **Text token**: `--base-text`, `--accent-text`, etc.

**Token usage by layer:**
- **First 4 tokens** (`base`, `10`, `20`, `30`): Background colors
- **Middle 4 tokens** (`40`, `50`, `60`, `70`): Midground colors (borders, dividers, subtle elements)
- **Last 4 numbered tokens** (`80`, `90`, `100`, `110`, `120`): Foreground colors
- **Text token**: Primary text color for that range

Example for the base range:
```css
var(--base)      /* Background */
var(--base-10)   /* Background variant */
var(--base-20)   /* Background variant */
var(--base-30)   /* Background variant */
var(--base-40)   /* Midground */
var(--base-50)   /* Midground */
var(--base-60)   /* Midground */
var(--base-70)   /* Midground */
var(--base-80)   /* Foreground */
var(--base-90)   /* Foreground */
var(--base-100)  /* Foreground */
var(--base-110)  /* Foreground */
var(--base-120)  /* Foreground */
var(--base-text) /* Text */
```

**Copilot: when suggesting colors, use `var(--...)` variables from Umbra, not hex codes, except in test playgrounds. Choose tokens appropriate to their layer (background, midground, or foreground).**

### 6.2 Range mapping

Rather than using the accent tokens directly, you should use the base tokens and then add a base remapping class to the element. base-accent, base-warning, etc. This makes it easy to switch out in the future.

**Copilot: when adding variants, prefer adding a `base-*` mapping class rather than duplicating CSS.**

### 6.3 Design tokens beyond color

Beyond color tokens, Umbraco defines several critical token systems:

#### Space tokens

Built on a fluid scale based on `--paragraph` (1.2rem):

- `--space-atom`: Base spacing unit (70% of paragraph)
- `--space-quark`: Half of atom (smallest spacing)
- `--space-1` through `--space-10`: Incremental scale from half-paragraph to large sections

**Use cases:**
- Padding, margins, gaps
- Consistent vertical and horizontal rhythm
- Component internal spacing

#### Block tokens

Standardized heights for interactive elements, all input elements should use these:

- `--block-small`: Minimum height (equal to `--paragraph`)
- `--block`: Standard input height (paragraph + atom)
- `--block-big`: Large input height (paragraph + 2 atoms)
- `--block-shell`: Container height (big block + 2 atoms)

**Purpose:** All input elements (buttons, text inputs, selects, etc.) should have consistent, predictable heights. This creates visual harmony and ensures elements align properly.

```css
/* Example: Standard button/input height */
.button, input {
  height: var(--block);
  padding-inline: var(--space-atom);
}

/* Example: Large primary button */
.buttonBig {
  height: var(--block-big);
  padding-inline: var(--space-2);
}
```

#### Radius tokens

Border radius system for rounded corners:

- `--radius`: Base radius (5px)
- `--inner-radius`: Slightly smaller for nested elements
- `--outer-radius`: Slightly larger for containers

#### Other tokens

- **Border**: `--border`, `--border-size`, `--border-color`
- **Timing**: `--time` (0.1s base), `--time-2` through `--time-6` (multiples), `--timing` (easing function) for transitions
- **Typography**: `--paragraph`, heading sizes, font weights

**Copilot: use these design tokens instead of hardcoded values. Input elements must use block tokens for height consistency.**

### 6.4 Theme storage

When persisting themes (user themes, brand themes, etc.):

- Use Umbra's stable schema (`theme.format().stable`)
- Do not store config with generation logic if a stable schema is available

**Copilot: suggest using the stable schema for SSR, persistence, and state management.**


## 7. UI Components (Umbraco-first)

`packages/umbraco` is the shared UI library

Built on:

- Umbra for theming
- reka-ui / shadcn-style primitives

Use compound component patterns:

- e.g. `<Dialog>` `<Dialog.Trigger>` `<Dialog.Content>` … `</Dialog>`

Avoid prop drilling by using internal context within compound components

**Copilot: when apps need common UI (buttons, dialogs, inputs, layouts, etc.), prefer Umbraco components over raw HTML.  
New generic UI components should be created in Umbraco, not directly in apps.**

Rules:

- No business logic in Umbraco – presentation + simple UI state only
- Umbraco components must:
  - Use Umbra Color Tokens variables
  - Follow accessibility best practices (keyboard, focus, ARIA)
  - Respect the design guidelines (calm, clear, finite, not noisy)


## 8. Other Packages

### 8.1 packages/dye – Umbra color picker

Use Dye when you need users to:

- Choose colors
- Build or edit themes

Dye should integrate with Umbra directly

**Copilot: don't reinvent color pickers in apps; use Dye or extend it.**

### 8.2 packages/moonbow – WebGPU shaders

All WebGPU / shader logic should go through Moonbow

Apps should:

- Consume Moonbow APIs/components
- Avoid raw WebGPU boilerplate unless working on Moonbow itself

**Copilot: when suggesting WebGPU/shader code in apps, prefer using Moonbow helpers.**

### 8.3 packages/bifrost – SVG splines between elements

Use Bifrost for:

- Drawing connections between UI elements
- Visualizing relationships/graphs

**Copilot: if a feature needs lines/flows between elements, suggest Bifrost rather than custom SVG from scratch.**

### 8.4 packages/convue – Convex + Nuxt + better-authauth

All Convex + auth integration should go through Convue:

- Nuxt plugins, composables, hooks, etc.
- Do not wire Convex or auth differently per app

**Copilot: when adding backend calls or auth to an app, use Convue's utilities instead of talking to Convex directly.**

### 8.5 packages/formula – Form state management

Formula is a form library for Vue 3 with:

- Change tracking and diffing (baseline vs current data)
- Automatic dirty state computation
- Deep merge and reset capabilities
- Zod validation integration with field-level errors

Two main composables:

- `useForm` - Basic form with change tracking (no validation)
- `useFormula` - Enhanced form with Zod schema validation

**Copilot: when building forms that need change tracking, validation, or diff-based updates, use Formula instead of manual state management.**


## 9. Apps: Roles

### 9.1 apps/blog – Noble (main social / identity app)

Currently a "blog" where one person posts

Will evolve into:

- Full social site where everyone can post, reason, and interact

This app should:

- Use Noble's domain concepts (Marks, etc.) as they're implemented
- Express the design manifesto: finite feeds, temporal posts, identity visibility, consistency

### 9.2 apps/carbon – Card game

- Standalone web card game
- Future: embedded into Fenrir (media hub app)
- Design code so game logic can be reused by Fenrir later

### 9.3 apps/edda – Workplace/time app

Time management → "internal LinkedIn" → improved professional network

Shares:

- Identity systems
- Theming
- UI components

### 9.4 Test apps

- `apps/color` – Umbra playground
- `apps/ui` – Umbraco playground
- `apps/gpu` – Moonbow playground

**Copilot: test apps are for experiments and demos, not production features.  
If something becomes stable and reusable, move it into the relevant package.**


## 10. Accessibility, Interaction & Content (Short Rules for Copilot)

Full design rules live in `/docs` (e.g. design manifesto, UX guidelines), but Copilot should default to:

- Everything keyboard-accessible (tab, shift+tab, Enter, Space)
- Use WAI-ARIA patterns and `:focus-visible`
- Respect `prefers-reduced-motion`
- Use semantic HTML first; ARIA only when needed
- Icons always have labels or `aria-label`
- URLs are state:
  - Persist filters, tabs, panels in query params when it makes flows shareable
- Never disable zoom
- Generous hit targets (≥ 44px on mobile)

**Copilot: when generating interactive components, always include keyboard/focus behavior and proper semantics.**


## 11. Tone for Copilot Explanations

When Copilot explains code or suggests changes:

- Prefer direct, clear, minimal explanations
- Highlight:
  - Why a suggestion improves purity, readability, or architecture
  - When a change enforces these rules (functional style, boundaries, theming)
- Avoid verbose or marketing-style language in code comments

**In summary for Copilot:**

Be strict about:

- Functional style, early returns, minimal mutation
- Using Umbra for colors
- Using Umbraco for shared UI
- Respecting package/app boundaries

When in doubt, choose:

- Purity over mutation
- Composition over nesting
- Shared packages over app-local reinvention
- Calm, accessible, finite UX over noisy, infinite patterns
