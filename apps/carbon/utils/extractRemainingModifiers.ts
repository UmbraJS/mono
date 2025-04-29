import type { ModifierChunk } from "./types";

/**
 * Extracts remaining modifiers from a list of modifier chunks based on the given duration.
 * Take modifiers, return remaining modifiers after cooldown. Find spillover modifiers past event end.
 * @param {ModifierChunk[]} modifiers - An array of modifier chunks to extract remaining modifiers from.
 * @param {number} duration - The duration to compare against.
 * @returns {ModifierChunk[]} An array of remaining modifier chunks that exceed the given duration.
 */

export function extractRemainingModifiers(modifiers: ModifierChunk[], duration: number): ModifierChunk[] {
  const remaining: ModifierChunk[] = [];

  for (const mod of modifiers) {
    const modEnd = mod.timestamp + mod.duration;
    if (modEnd > duration) {
      const remainingDuration = modEnd - duration;
      remaining.push({
        ...mod,
        timestamp: 0, // reset timestamp for next event
        duration: remainingDuration,
      });
    }
  }

  return remaining;
}
