# Formula

A powerful Vue 3 form library with change tracking, diffing, and Zod validation.

## Features

- **Reactive form data** you edit in your form
- **Baseline tracking** - the source of truth you compare against
- **Automatic dirty state** - deep partial diff of what changed vs baseline
- **Change tracking** - `isDirty` computed value shows if anything changed
- **Mutations**:
  - `setForm(patch)` - deep merge partials
  - `replace(next)` - swap whole data
  - `reset()` - revert data to baseline
  - `setBaseline(next)` - change the comparison target
  - `commit()` - promote current data to become the new baseline
- **Zod validation** - Optional schema validation with field-level errors
- **Pluggable deep equality** via `equals` option
- **Configurable array merge** strategy: "replace" or "concat"

## Installation

```bash
pnpm add @umbrajs/formula
# or
npm install @umbrajs/formula
```

## Quick Start

### Basic Form (no validation)

```typescript
import { useForm } from '@umbrajs/formula';

const form = useForm({
  name: "",
  email: "",
  tags: [] as string[]
});

// Update fields
form.setForm({ name: "Sam" });

// Check state
console.log(form.isDirty.value);       // true
console.log(form.dirtyValues.value);   // { name: "Sam" }

// Revert changes
form.reset();

// After successful save
form.commit(); // baseline <- current data
```

### Form with Zod Validation

```typescript
import { useFormula } from '@umbrajs/formula';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(18, "Must be at least 18 years old")
});

const form = useFormula({
  name: "",
  email: "",
  age: 0
}, {
  schema,
  validationMode: "onChange" // Validate on every change
});

// Update with automatic validation
form.setForm({ name: "A" }); // Will show validation error

// Check validation state
console.log(form.isValid.value); // false
console.log(form.errors.value); // { name: ["Name must be at least 2 characters"] }

// Manual validation before submit
const result = form.validate();
if (result.success) {
  // Submit form with result.data (fully typed and validated)
  await api.submit(result.data);
  form.commit(); // Make current data the new baseline
}
```

## Vue Component Usage

```vue
<script setup lang="ts">
import { useFormula } from '@umbrajs/formula';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

const form = useFormula({
  name: "",
  email: ""
}, {
  schema,
  validationMode: "onChange"
});

async function onSubmit() {
  const validation = form.validate();
  if (!validation.success) return;
  
  await api.updateUser(validation.data);
  form.commit();
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>Name</label>
      <input v-model="form.data.value.name" />
      <span v-if="form.errors.value.name">
        {{ form.errors.value.name[0] }}
      </span>
    </div>

    <div>
      <label>Email</label>
      <input v-model="form.data.value.email" />
      <span v-if="form.errors.value.email">
        {{ form.errors.value.email[0] }}
      </span>
    </div>

    <div>Dirty? {{ form.isDirty.value ? "Yes" : "No" }}</div>
    <pre>Changed: {{ form.dirtyValues.value }}</pre>

    <button type="button" @click="form.reset" :disabled="!form.isDirty.value">
      Reset
    </button>
    <button type="submit" :disabled="!form.isValid.value">
      Save
    </button>
  </form>
</template>
```

## API

### `useForm<T>(initial, opts?)`

Basic form hook without validation.

**Parameters:**
- `initial: T` - Initial form data
- `opts?: UseFormOptions`
  - `equals?: (a, b) => boolean` - Custom equality function
  - `arrayMerge?: "replace" | "concat"` - Array merge strategy

**Returns:**
- `data: Ref<T>` - Reactive form data
- `baseline: Ref<T>` - Comparison baseline
- `dirtyValues: Ref<DeepPartial<T>>` - Changed values
- `isDirty: Ref<boolean>` - Whether form has changes
- `setForm(patch: DeepPartial<T>)` - Merge partial changes
- `replace(next: T)` - Replace entire form data
- `reset()` - Revert to baseline
- `setBaseline(next: T)` - Update baseline
- `commit()` - Promote current data as new baseline

### `useFormula<T>(initial, options)`

Enhanced form hook with Zod validation.

**Parameters:**
- `initial: T` - Initial form data
- `options: UseValidatedFormOptions`
  - `schema: ZodSchema` - Zod validation schema
  - `validationMode?: "onChange" | "onSubmit" | "onBlur"` - When to validate
  - `equals?: (a, b) => boolean` - Custom equality function
  - `arrayMerge?: "replace" | "concat"` - Array merge strategy

**Returns:**
All properties from `useForm` plus:
- `errors: Ref<FieldErrors>` - Validation errors by field
- `isValid: Ref<boolean>` - Whether form passes validation
- `validate()` - Manually trigger validation
- `validateField(path: string)` - Validate specific field
- `clearErrors()` - Clear all validation errors

## Recipes

### Submit Only What Changed

```typescript
// Only send changed fields to the API
await api.updateUser(userId, form.dirtyValues.value);
form.commit();
```

### Per-Field Dirty Flags

```typescript
const nameDirty = computed(() => 'name' in form.dirtyValues.value);
```

### Optimistic Updates

```typescript
async function save() {
  if (!form.isDirty.value) return;

  const oldBaseline = form.baseline.value;
  form.commit(); // Optimistic - treat current as saved

  try {
    await api.updateUser(userId, form.dirtyValues.value);
  } catch (e) {
    // Roll back on error
    form.setBaseline(oldBaseline);
    form.reset();
    throw e;
  }
}
```

## Why Formula?

- **No heavy dependencies** - Just Vue 3 and optional Zod
- **Predictable** - Pure functions, no magic
- **Type-safe** - Full TypeScript support
- **Flexible** - Pluggable equality and merge strategies
- **Framework-first** - Built specifically for Vue 3's reactivity system

## License

MIT
