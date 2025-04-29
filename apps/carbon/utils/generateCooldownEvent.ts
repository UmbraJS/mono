import type { ModifierChunk, OutputChunk } from "./types";
import { resolveOverlappingModifiers } from "./resolveOverlappingModifiers";
import { buildTimelineSegments } from "./buildTimelineSegments";
import { convertSegmentsToChunks } from "./convertSegmentsToChunks";
import { extractRemainingModifiers } from "./extractRemainingModifiers";

interface CooldownEvent {
  baseDuration: number;
  duration: number;
  chunks: OutputChunk[];
  remainingModifiers: ModifierChunk[];
}

interface CooldownEventProps {
  baseDuration: number;
  modifiers: ModifierChunk[];
}

/**
 * Generates a cooldown event based on the provided base duration and modifier chunks.
 *
 * @param {number} baseDuration - The base duration of the cooldown.
 * @param {ModifierChunk[]} modifiers - An array of modifier chunks that affect the cooldown.
 * @returns {Object} An object containing the base duration, total duration, output chunks, and remaining modifiers.
 */
export function generateCooldownEvent({
  baseDuration,
  modifiers,
}: CooldownEventProps): CooldownEvent {
  const resolvedModifiers = resolveOverlappingModifiers(modifiers);
  const timelineSegments = buildTimelineSegments(resolvedModifiers);
  const { chunks, duration } = convertSegmentsToChunks(baseDuration, timelineSegments);
  const remainingModifiers = extractRemainingModifiers(modifiers, duration);

  return {
    baseDuration,
    duration,
    chunks,
    remainingModifiers,
  };
}
