export interface Option {
  name: string;
}

export interface LabeledOption {
  name: string;
  children: Option[];
}

// A Select can accept either a flat list of Option objects OR
// an array of labeled option groups (LabeledOption[]).
// We expose a discriminated helper type for convenience.
export type SelectOptions = Option[] | LabeledOption[];

// Type guard helpers (runtime) for components to distinguish shapes.
export function isLabeledOptions(arr: SelectOptions): arr is LabeledOption[] {
  return Array.isArray(arr) && !!arr[0] && 'children' in (arr as any)[0];
}

export function normalizeToLabeled(arr: SelectOptions): LabeledOption[] {
  if (isLabeledOptions(arr)) return arr;
  // Convert flat options into a single implicit group
  return arr.length ? [{ name: 'Options', children: arr }] : [];
}
