useForm - a tiny Vue 3 form hook

TL;DR: useForm(initial) gives you a reactive data, a baseline to compare against, a computed dirtyValues deep-diff, a boolean isDirty, and a few actions: setForm, replace, reset, setBaseline, commit. No heavy deps, comparator is pluggable.

Features

Reactive data you edit in your form

baseline - the source of truth you compare against

dirtyValues - deep partial of what changed vs baseline

isDirty - true if anything changed

Mutations:

setForm(patch) - deep merge partials

replace(next) - swap whole data

reset() - revert data to baseline

setBaseline(next) - change the comparison target

commit() - promote current data to become the new baseline

Pluggable deep equality via equals

Configurable array merge strategy: "replace" or "concat"

Naming: we use baseline for the comparison copy. It’s neutral, clear, and doesn’t imply immutability like “official” might.

Install
# if you copy the hook file, you’re done
# optional: a tiny deep equal lib if you want to swap the default
pnpm add fast-deep-equal
# or
npm i fast-deep-equal

Quick start
// useForm.ts exports useForm

import { useForm } from "./useForm";

const {
  data,         // Ref<T>
  baseline,     // Ref<T>
  dirtyValues,  // Ref<DeepPartial<T>>
  isDirty,      // Ref<boolean>
  setForm,
  replace,
  reset,
  setBaseline,
  commit,
} = useForm({ name: "", email: "", tags: [] as string[] });

// Update some fields
setForm({ name: "Sam" });

// Derived state
console.log(isDirty.value);       // true
console.log(dirtyValues.value);   // { name: "Sam" }

// Revert changes
reset();

// After successful save
commit(); // baseline <- current data

Template usage (Vue SFC)
<script setup lang="ts">
import { useForm } from "@/composables/useForm";

type Profile = { name: string; email: string; tags: string[] };

const form = useForm<Profile>({ name: "", email: "", tags: [] });

function onSubmit() {
  // pretend API call with form.data.value
  // on success:
  form.commit(); // makes current data the new baseline
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label>
      Name
      <input v-model="form.data.value.name" />
    </label>

    <label>
      Email
      <input v-model="form.data.value.email" />
    </label>

    <div>Dirty? {{ form.isDirty.value ? "Yes" : "No" }}</div>
    <pre>Changed: {{ form.dirtyValues.value }}</pre>

    <button type="button" @click="form.reset" :disabled="!form.isDirty.value">
      Reset
    </button>
    <button type="submit">Save</button>
  </form>
</template>

API
useForm<T extends Record<string, any>>(
  initial: T,
  opts?: {
    equals?: (a: unknown, b: unknown) => boolean; // deep equality override
    arrayMerge?: "replace" | "concat";            // default "replace"
  }
): {
  data: Ref<T>;
  baseline: Ref<T>;
  dirtyValues: Ref<DeepPartial<T>>;
  isDirty: Ref<boolean>;
  setForm: (patch: DeepPartial<T>) => void;
  replace: (next: T) => void;
  reset: () => void;
  setBaseline: (next: T) => void;
  commit: () => void;
}

Concepts

baseline: the snapshot you compare against. Initialized from initial. You can change it via setBaseline(next) or set it to current data with commit().

dirtyValues: deep diff of data vs baseline. Only includes keys that actually differ. For arrays, the default behavior is atomic - if any element differs, the whole array appears in dirtyValues. Pass arrayMerge: "concat" if your patching pattern is additive and you prefer to merge on setForm.

isDirty: derived from dirtyValues. No manual toggling that can drift out of sync.

Mutations

setForm(patch): deep-merge a partial into data.

replace(next): replace data wholesale.

reset(): set data = baseline.

setBaseline(next): set a new comparison target.

commit(): set baseline = data - ideal right after a successful save.

Recipes
Per-field dirty flags
import { computed } from "vue";

const nameDirty = computed(() => "name" in form.dirtyValues.value);

Submit only what changed
await api.updateUser(userId, form.dirtyValues.value);
// server patches only the provided fields
form.commit();

Restore just one field from baseline
function restoreField<K extends keyof typeof form.data.value>(k: K) {
  form.setForm({ [k]: form.baseline.value[k] } as any);
}

Overriding equality to handle Dates
import isEqual from "fast-deep-equal";

const form = useForm(initial, {
  equals: (a, b) => {
    if (a instanceof Date || b instanceof Date) {
      const ax = a instanceof Date ? a.getTime() : a;
      const bx = b instanceof Date ? b.getTime() : b;
      return ax === bx;
    }
    return isEqual(a, b);
  },
});

Behavior details

Cloning: values are cloned when establishing or changing baseline, and when replacing data, so your refs don’t alias external objects.

Arrays:

Diff: treated as atomic by default. If you need per-item diff, you can swap deepDiff for a custom strategy later.

Merge on setForm: "replace" by default. Pass "concat" to append.

Only keys present in data are considered when producing dirtyValues. Removing keys from data that exist in baseline will show up as changed.

FAQ

Why “baseline” and not initial/prime/key/official?
Baseline reads clean in code and makes it obvious you can advance it after save with commit().

Lodash isEqual or something else?
If your bundle already includes lodash-es, isEqual is fine. Otherwise prefer a tiny lib like fast-deep-equal or dequal. Or keep the built-in comparator and override via equals when you hit special cases.

What about Files, Maps, Sets, custom classes?
Provide a custom equals that normalizes those fields before comparing, or represent them with serializable shapes for diffing.

Validation?
Out of scope here. Pair this with your favorite schema validator (Zod, Valibot, Yup). You can compute errors in parallel and keep this hook focused on state and diff.

SSR?
No global state, so it’s SSR-safe. The hook uses structuredClone when available with a JSON fallback. If you store non-JSON-y values, supply a custom cloner or comparator.

Type helpers
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends
    | string | number | boolean | bigint | symbol | null | undefined
    ? T[K]
    : DeepPartial<T[K]>;
};

Example: optimistic save
async function save() {
  const patch = form.dirtyValues.value;
  if (!form.isDirty.value) return;

  const oldBaseline = form.baseline.value;
  form.commit(); // optimistic - treats current as saved

  try {
    await api.updateUser(userId, patch);
  } catch (e) {
    // roll back
    form.setBaseline(oldBaseline);
    form.reset();
    throw e;
  }
}

Roadmap ideas

Path-based updates setAt('profile.name', 'Sam')

Field-level helpers useField(form, 'name')

Array item diffing strategies

Serialization hooks for tricky fields

License

MIT. Do good things.
