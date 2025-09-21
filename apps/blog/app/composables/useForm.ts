// useForm.ts
import { ref, computed, toRaw } from "vue";
import type { Ref } from "vue";

type Primitive = string | number | boolean | bigint | symbol | null | undefined;
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Primitive ? T[K] : DeepPartial<T[K]>;
};

export interface UseFormOptions<T> {
  // Deep equality function, overridable by the caller
  equals?: (a: unknown, b: unknown) => boolean;
  // Array merge strategy for setForm
  arrayMerge?: "replace" | "concat";
}

// Tiny, fast-ish deep equal. Replace with `fast-deep-equal` if you prefer.
function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object") {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== (b as unknown[]).length) return false;
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], (b as unknown[])[i])) return false;
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

function clone<T>(v: T): T {
  // structuredClone is safe for typical form data; adjust if you store Dates, Maps, etc.
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

function deepMerge<T extends Record<string, any>>(
  target: T,
  patch: DeepPartial<T>,
  arrayMerge: "replace" | "concat" = "replace"
): T {
  const out: any = Array.isArray(target) ? [...(target as any)] : { ...target };
  for (const key in patch) {
    const p = (patch as any)[key];
    const t = (out as any)[key];

    if (Array.isArray(p)) {
      if (arrayMerge === "concat" && Array.isArray(t)) {
        (out as any)[key] = [...t, ...p];
      } else {
        (out as any)[key] = clone(p);
      }
    } else if (p && typeof p === "object" && !Array.isArray(p)) {
      (out as any)[key] = deepMerge(
        t && typeof t === "object" ? t : {},
        p as any,
        arrayMerge
      );
    } else {
      (out as any)[key] = p as any;
    }
  }
  return out;
}

// Compute partial diff: values from A that differ from B, recursively.
// Arrays are compared whole; if different, include the whole array from A.
function deepDiff<T>(a: T, b: T, eq: (x: unknown, y: unknown) => boolean): DeepPartial<T> {
  if (eq(a as any, b as any)) return {};
  if (Array.isArray(a) || Array.isArray(b) || typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    // terminal difference - include A wholesale
    return a as unknown as DeepPartial<T>;
  }
  const out: any = {};
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const k of keys) {
    if (!(k in aObj)) continue; // only report keys present in current data
    const sub = deepDiff(aObj[k], bObj[k], eq);
    if (Array.isArray(sub) || (sub && typeof sub === "object" && Object.keys(sub as any).length > 0) || !(eq as any)(sub, {})) {
      out[k] = sub;
    }
  }
  return out;
}

export function useForm<T extends Record<string, any>>(
  initial: T,
  opts: UseFormOptions<T> = {}
): {
  data: Ref<T>;
  baseline: Ref<T>;
  dirtyValues: Ref<DeepPartial<T>>;
  isDirty: Ref<boolean>;
  setForm: (patch: DeepPartial<T>) => void;
  replace: (next: T) => void;
  reset: () => void;
  setBaseline: (next: T) => void;
  commit: () => void; // set baseline = current data
} {
  const eq = opts.equals ?? deepEqual;
  const arrayMerge = opts.arrayMerge ?? "replace";

  const baseline = ref<T>(clone(initial));
  const data = ref<T>(clone(initial));

  const _dirtyValues = computed<DeepPartial<T>>(() => {
    return deepDiff(toRaw(data.value), toRaw(baseline.value), eq);
  });

  const _isDirty = computed<boolean>(() => {
    const dv = _dirtyValues.value as any;
    if (dv && typeof dv === "object" && !Array.isArray(dv)) return Object.keys(dv).length > 0;
    // primitive/array difference means dirty
    return dv !== undefined;
  });

  function setForm(patch: DeepPartial<T>) {
    data.value = deepMerge(toRaw(data.value), patch, arrayMerge);
    // computed values react automatically
  }

  function replace(next: T) {
    data.value = clone(next);
  }

  function reset() {
    data.value = clone(baseline.value);
  }

  function setBaseline(next: T) {
    baseline.value = clone(next);
  }

  function commit() {
    baseline.value = clone(data.value);
  }

  // Expose refs so consumers can .value or unref in templates
  return {
    data,
    baseline,
    dirtyValues: computed(() => _dirtyValues.value) as Ref<DeepPartial<T>>,
    isDirty: computed(() => _isDirty.value) as Ref<boolean>,
    setForm,
    replace,
    reset,
    setBaseline,
    commit,
  };
}
