import type { ModifierChunk, OutputChunk } from "./types";
import { resolveOverlappingModifiers } from "./resolveOverlappingModifiers";
import { buildTimelineSegments } from "./buildTimelineSegments";
import { convertSegmentsToChunks } from "./convertSegmentsToChunks";
import { extractRemainingModifiers } from "./extractRemainingModifiers";

export interface CooldownEvent {
  baseDuration: number;
  duration: number;
  chunks: OutputChunk[];
  remainingModifiers: ModifierChunk[];
  resolvedModifiers: ModifierChunk[];
  timelineSegments: {
    start: number;
    end: number;
    type: "base" | "slow" | "haste" | "freeze";
    sourceIndex: number | null;
  }[];
}

interface CooldownEventProps {
  baseDuration: number;
  startTime: number;
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
  startTime,
}: CooldownEventProps): CooldownEvent {
  const resolvedModifiers = resolveOverlappingModifiers(modifiers); // [x]
  const timelineSegments = buildTimelineSegments(resolvedModifiers); // [x]
  const { chunks, duration } = convertSegmentsToChunks(baseDuration, timelineSegments, startTime);
  const remainingModifiers = extractRemainingModifiers(modifiers, duration);

  return {
    baseDuration,
    duration,
    chunks,
    remainingModifiers,
    resolvedModifiers,
    timelineSegments
  };
}

