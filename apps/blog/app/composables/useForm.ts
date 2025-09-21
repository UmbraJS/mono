// useForm.ts
import { ref, computed, toRaw } from "vue";
import type { Ref } from "vue";

/**
 * Primitive types that don't need deep partial transformation
 */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Creates a deeply partial type where all properties at all nesting levels become optional
 * @template T - The type to make deeply partial
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Primitive ? T[K] : DeepPartial<T[K]>;
};

/**
 * Configuration options for the useForm hook
 */
export interface UseFormOptions {
  /**
   * Custom deep equality function for comparing values
   * @param a - First value to compare
   * @param b - Second value to compare
   * @returns True if values are considered equal
   * @default deepEqual (built-in implementation)
   */
  equals?: (a: unknown, b: unknown) => boolean;

  /**
   * Strategy for merging arrays when using setForm
   * - "replace": Replace the entire array with the new one (default)
   * - "concat": Concatenate new array items to existing array
   * @default "replace"
   */
  arrayMerge?: "replace" | "concat";
}

/**
 * Tiny, fast deep equality checker. Replace with `fast-deep-equal` if you prefer.
 * Handles objects, arrays, and primitive types recursively.
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object") {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (!bKeys.includes(k) || !deepEqual(aObj[k], bObj[k])) return false;
    }
    return true;
  }
  return false;
}

/**
 * Creates a deep clone of a value using structuredClone when available,
 * falling back to JSON serialization for typical form data.
 * @template T - The type of value to clone
 * @param v - The value to clone
 * @returns A deep clone of the input value
 * @note Adjust implementation if you store Dates, Maps, Sets, or other non-JSON types
 */
function clone<T>(v: T): T {
  // structuredClone is safe for typical form data; adjust if you store Dates, Maps, etc.
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

/**
 * Deep merges a partial patch into a target object, creating a new object.
 * Handles arrays according to the specified merge strategy.
 * @template T - The type of the target object (must extend Record<string, unknown>)
 * @param target - The base object to merge into
 * @param patch - The partial object containing changes to apply
 * @param arrayMerge - Strategy for handling arrays ("replace" or "concat")
 * @returns A new object with the patch applied to the target
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  patch: DeepPartial<T>,
  arrayMerge: "replace" | "concat" = "replace"
): T {
  const out = { ...target };

  for (const key in patch) {
    const patchValue = patch[key];
    const targetValue = out[key];

    if (Array.isArray(patchValue)) {
      if (arrayMerge === "concat" && Array.isArray(targetValue)) {
        (out as Record<PropertyKey, unknown>)[key] = [...targetValue, ...patchValue];
      } else {
        (out as Record<PropertyKey, unknown>)[key] = clone(patchValue);
      }
    } else if (patchValue && typeof patchValue === "object" && !Array.isArray(patchValue)) {
      const targetObj = targetValue && typeof targetValue === "object" && !Array.isArray(targetValue)
        ? targetValue as Record<string, unknown>
        : {} as Record<string, unknown>;
      const patchObj = patchValue as DeepPartial<Record<string, unknown>>;
      (out as Record<PropertyKey, unknown>)[key] = deepMerge(targetObj, patchObj, arrayMerge);
    } else if (patchValue !== undefined) {
      (out as Record<PropertyKey, unknown>)[key] = patchValue;
    }
  }
  return out;
}

/**
 * Computes a partial diff showing values from 'a' that differ from 'b', recursively.
 * Arrays are compared atomically - if any element differs, the whole array from 'a' is included.
 * @template T - The type of objects being compared
 * @param a - The current/new object
 * @param b - The baseline/old object to compare against
 * @param eq - The equality function to use for comparisons
 * @returns A DeepPartial<T> containing only the differing values from 'a'
 */
function deepDiff<T>(a: T, b: T, eq: (x: unknown, y: unknown) => boolean): DeepPartial<T> {
  if (eq(a, b)) return {};
  if (Array.isArray(a) || Array.isArray(b) || typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    // terminal difference - include A wholesale
    return a as DeepPartial<T>;
  }
  const out: Record<string, unknown> = {};
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const k of keys) {
    if (!(k in aObj)) continue; // only report keys present in current data
    const sub = deepDiff(aObj[k], bObj[k], eq);
    if (Array.isArray(sub) || (sub && typeof sub === "object" && Object.keys(sub).length > 0) || !eq(sub, {})) {
      out[k] = sub;
    }
  }
  return out as DeepPartial<T>;
}

/**
 * A powerful Vue 3 composable for managing form state with change tracking and diffing.
 *
 * Provides reactive form data with a baseline for comparison, automatic dirty state tracking,
 * and utilities for resetting, committing, and merging changes. Perfect for forms that need
 * to track what has changed since the last save.
 *
 * @template T - The shape of your form data (must extend Record<string, unknown>)
 * @param initial - The initial form data that becomes the starting baseline
 * @param opts - Optional configuration for equality checking and array merge behavior
 *
 * @returns An object containing:
 *   - `data` - Reactive form data ref
 *   - `baseline` - The reference point for change detection
 *   - `dirtyValues` - Computed partial diff of changes vs baseline
 *   - `isDirty` - Computed boolean indicating if any changes exist
 *   - `setForm` - Function to merge partial changes into form data
 *   - `replace` - Function to replace entire form data
 *   - `reset` - Function to revert data back to baseline
 *   - `setBaseline` - Function to update the comparison baseline
 *   - `commit` - Function to promote current data as the new baseline
 *
 * @example
 * ```typescript
 * const form = useForm({
 *   name: "",
 *   email: "",
 *   tags: [] as string[]
 * });
 *
 * // Update fields
 * form.setForm({ name: "John" });
 *
 * // Check state
 * console.log(form.isDirty.value); // true
 * console.log(form.dirtyValues.value); // { name: "John" }
 *
 * // After successful save
 * form.commit(); // Makes current data the new baseline
 * ```
 *
 * @example
 * ```typescript
 * // With custom options
 * const form = useForm(initialData, {
 *   arrayMerge: "concat", // Append to arrays instead of replacing
 *   equals: customDeepEqual // Use your preferred equality function
 * });
 * ```
 */
export function useForm<T extends Record<string, unknown>>(
  initial: T,
  opts: UseFormOptions = {}
): {
  /** Reactive form data - the current state of your form */
  data: Ref<T>;
  /** The baseline data used for change detection and reset operations */
  baseline: Ref<T>;
  /** Computed partial diff showing what has changed vs baseline */
  dirtyValues: Ref<DeepPartial<T>>;
  /** Computed boolean indicating whether any changes exist */
  isDirty: Ref<boolean>;
  /** Merge partial changes into the form data */
  setForm: (patch: DeepPartial<T>) => void;
  /** Replace the entire form data with new values */
  replace: (next: T) => void;
  /** Reset form data back to the current baseline */
  reset: () => void;
  /** Update the baseline (comparison point) to new values */
  setBaseline: (next: T) => void;
  /** Promote current data to become the new baseline (call after save) */
  commit: () => void;
} {
  const eq = opts.equals ?? deepEqual;
  const arrayMerge = opts.arrayMerge ?? "replace";

  const baseline = ref(clone(initial)) as Ref<T>;
  const data = ref(clone(initial)) as Ref<T>;

  const _dirtyValues = computed<DeepPartial<T>>(() => {
    return deepDiff(toRaw(data.value), toRaw(baseline.value), eq);
  });

  const _isDirty = computed<boolean>(() => {
    const dv = _dirtyValues.value;
    if (dv && typeof dv === "object" && !Array.isArray(dv)) return Object.keys(dv).length > 0;
    // primitive/array difference means dirty
    return dv !== undefined;
  });

  /** Merge partial changes into the form data using deep merge strategy */
  function setForm(patch: DeepPartial<T>) {
    data.value = deepMerge(toRaw(data.value), patch, arrayMerge);
    // computed values react automatically
  }

  /** Replace the entire form data with new values */
  function replace(next: T) {
    data.value = clone(next);
  }

  /** Reset form data back to the current baseline */
  function reset() {
    data.value = clone(baseline.value);
  }

  /** Update the baseline (comparison point) to new values */
  function setBaseline(next: T) {
    baseline.value = clone(next);
  }

  /** Promote current data to become the new baseline - ideal after successful save */
  function commit() {
    baseline.value = clone(data.value);
  }

  // Expose refs so consumers can .value or unref in templates
  return {
    data,
    baseline,
    dirtyValues: _dirtyValues,
    isDirty: _isDirty,
    setForm,
    replace,
    reset,
    setBaseline,
    commit,
  };
}
