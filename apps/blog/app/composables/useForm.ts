// useForm.ts
import { ref, computed, toRaw, watch } from "vue";
import type { Ref } from "vue";
import type { ZodSchema, ZodError } from "zod";

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
 * Enhanced configuration options for the useValidatedForm hook with Zod validation
 */
export interface UseValidatedFormOptions extends UseFormOptions {
  /**
   * Zod schema for validating form data
   */
  schema: ZodSchema;

  /**
   * When to perform validation
   * - "onChange": Validate on every form change (reactive)
   * - "onSubmit": Only validate when explicitly called
   * - "onBlur": Validate when fields lose focus (requires manual trigger)
   * @default "onChange"
   */
  validationMode?: "onChange" | "onSubmit" | "onBlur";
}

/**
 * Field-level error information from validation
 */
export type FieldErrors = Record<string, string[]>;

/**
 * Validation result containing success state, errors, and parsed data
 */
export interface ValidationResult<T> {
  /** Whether validation passed */
  success: boolean;
  /** Parsed and validated data (only present if success is true) */
  data?: T;
  /** Field-level error messages */
  fieldErrors: FieldErrors;
  /** Global form error messages */
  formErrors: string[];
}

/**
 * Transforms a Zod error into a more usable format for form validation
 * @param error - The ZodError to transform
 * @returns ValidationResult with formatted field and form errors
 */
function formatZodError<T>(error: ZodError): Omit<ValidationResult<T>, 'success' | 'data'> {
  const fieldErrors: FieldErrors = {};
  const formErrors: string[] = [];

  for (const issue of error.issues) {
    if (issue.path.length > 0) {
      // Field-specific error
      const fieldPath = issue.path.join('.');
      if (!fieldErrors[fieldPath]) {
        fieldErrors[fieldPath] = [];
      }
      fieldErrors[fieldPath].push(issue.message);
    } else {
      // Form-level error
      formErrors.push(issue.message);
    }
  }

  return { fieldErrors, formErrors };
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

/**
 * Enhanced form hook with Zod validation support.
 *
 * Extends the basic useForm hook with schema validation, error handling,
 * and form validation state management using Zod schemas.
 *
 * @template T - The shape of your form data (inferred from Zod schema)
 * @param initial - Initial form data that becomes the starting baseline
 * @param options - Configuration including Zod schema and validation options
 *
 * @returns Extended form object with validation capabilities:
 *   - All properties from useForm (data, baseline, isDirty, etc.)
 *   - `errors` - Reactive validation errors for each field
 *   - `isValid` - Computed boolean indicating if form passes validation
 *   - `validate` - Function to manually trigger validation
 *   - `validateField` - Function to validate a specific field
 *   - `clearErrors` - Function to clear all validation errors
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   name: z.string().min(2, "Name must be at least 2 characters"),
 *   email: z.string().email("Invalid email format"),
 *   age: z.number().min(18, "Must be at least 18 years old")
 * });
 *
 * const form = useValidatedForm({
 *   name: "",
 *   email: "",
 *   age: 0
 * }, {
 *   schema,
 *   validationMode: "onChange" // Validate on every change
 * });
 *
 * // Update with validation
 * form.setForm({ name: "A" }); // Will show validation error
 *
 * // Check validation state
 * console.log(form.isValid.value); // false
 * console.log(form.errors.value.name); // ["Name must be at least 2 characters"]
 *
 * // Manual validation
 * const result = form.validate();
 * if (result.success) {
 *   // Submit form with result.data
 * }
 * ```
 */
export function useValidatedForm<T extends Record<string, unknown>>(
  initial: T,
  options: UseValidatedFormOptions
): {
  /** Reactive form data - the current state of your form */
  data: Ref<T>;
  /** The baseline data used for change detection and reset operations */
  baseline: Ref<T>;
  /** Computed partial diff showing what has changed vs baseline */
  dirtyValues: Ref<DeepPartial<T>>;
  /** Computed boolean indicating whether any changes exist */
  isDirty: Ref<boolean>;
  /** Current validation errors for each field */
  errors: Ref<FieldErrors>;
  /** Computed boolean indicating if the form passes validation */
  isValid: Ref<boolean>;
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
  /** Manually trigger form validation */
  validate: () => ValidationResult<T>;
  /** Validate a specific field by path (e.g., "user.email") */
  validateField: (fieldPath: string) => string[] | null;
  /** Clear all validation errors */
  clearErrors: () => void;
} {
  const { schema, validationMode = "onChange", ...formOptions } = options;

  // Initialize the base form
  const form = useForm(initial, formOptions);

  // Validation state
  const errors = ref<FieldErrors>({});

  // Computed validation state
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  /** Perform validation on the current form data */
  function validate(): ValidationResult<T> {
    const result = schema.safeParse(toRaw(form.data.value));

    if (result.success) {
      errors.value = {};
      return {
        success: true,
        data: result.data as T,
        fieldErrors: {},
        formErrors: []
      };
    } else {
      const formatted = formatZodError<T>(result.error);
      errors.value = formatted.fieldErrors;
      return {
        success: false,
        ...formatted
      };
    }
  }

  /** Validate a specific field by path */
  function validateField(fieldPath: string): string[] | null {
    // For simplicity, we'll validate the entire form and extract field-specific errors
    const result = schema.safeParse(toRaw(form.data.value));

    if (!result.success) {
      const formatted = formatZodError<T>(result.error);

      // Update errors for all fields from this validation
      errors.value = formatted.fieldErrors;

      // Return errors specific to the requested field
      return formatted.fieldErrors[fieldPath] || null;
    } else {
      // Clear all errors if validation passes
      errors.value = {};
      return null;
    }
  }

  /** Clear all validation errors */
  function clearErrors() {
    errors.value = {};
  }

  // Auto-validate on change if enabled
  if (validationMode === "onChange") {
    watch(() => form.data.value, () => {
      validate();
    }, { deep: true });
  }

  // Enhanced setForm with optional validation
  const originalSetForm = form.setForm;
  function setForm(patch: DeepPartial<T>) {
    originalSetForm(patch);
    if (validationMode === "onChange") {
      validate();
    }
  }

  // Enhanced replace with optional validation
  const originalReplace = form.replace;
  function replace(next: T) {
    originalReplace(next);
    if (validationMode === "onChange") {
      validate();
    }
  }

  return {
    ...form,
    errors,
    isValid,
    setForm,
    replace,
    validate,
    validateField,
    clearErrors,
  };
}
