import type { ModifierChunk, ModifierType } from './types';

/**
 * Resolves overlapping modifiers by adjusting their durations based on their timestamps.
 * Take input modifiers, return clean non-overlapping modifiers.
 * @param {ModifierChunk[]} modifiers - An array of modifier chunks to resolve.
 * @returns {ModifierChunk[]} An array of resolved modifier chunks without overlaps.
 */
export function resolveOverlappingModifiers(modifiers: ModifierChunk[]): ModifierChunk[] {
  const resolved: ModifierChunk[] = [];
  const grouped = new Map<ModifierType, ModifierChunk[]>();

  // Group modifiers by type
  for (const mod of modifiers) {
    if (!grouped.has(mod.type)) grouped.set(mod.type, []);
    grouped.get(mod.type)!.push(mod);
  }

  // Resolve overlaps inside each group
  for (const [_type, list] of grouped.entries()) {
    const sorted = list.sort((a, b) => a.timestamp - b.timestamp);
    const result: ModifierChunk[] = [];

    for (const mod of sorted) {
      while (result.length) {
        const last = result[result.length - 1];
        if (!last) break;
        const lastEnd = last.timestamp + last.duration;
        // const modEnd = mod.timestamp + mod.duration;

        if (mod.timestamp >= lastEnd) break; // no overlap

        if (mod.timestamp > last.timestamp) {
          last.duration = mod.timestamp - last.timestamp;
          break;
        } else {
          result.pop();
        }
      }

      if (mod.duration > 0) result.push(mod);
    }

    resolved.push(...result);
  }

  return resolved;
}
