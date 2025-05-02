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
  // const adjustedModifiers = modifiers.map(m => ({
  //   ...m,
  //   timestamp: m.timestamp - startTime // Adjust timestamp relative to start of event
  // }))

  const resolvedModifiers = resolveOverlappingModifiers(modifiers);
  const timelineSegments = buildTimelineSegments(resolvedModifiers);
  const { chunks, duration } = convertSegmentsToChunks(baseDuration, timelineSegments, startTime);
  const remainingModifiers = extractRemainingModifiers(modifiers, duration);

  // if (modifiers.length > 0) console.log("rex generateCooldownEvent",
  //   {
  //     adjustedModifiers,
  //     modifiers,
  //     startTime,
  //     chunks,
  //     resolvedModifiers,
  //   }
  // )

  return {
    baseDuration,
    duration,
    chunks,
    remainingModifiers,
    resolvedModifiers,

  };
}

