import type { OutputChunk } from "./types";
import { resolveOverlappingModifiers } from "./resolveOverlappingModifiers";
import { buildTimelineSegments } from "./buildTimelineSegments";
import { convertSegmentsToChunks } from "./convertSegmentsToChunks";
import { extractRemainingModifiers } from "./extractRemainingModifiers";
import type { SimCard } from "../types/card";
import { getTotalLifetime } from "./simulateCards";

export interface CooldownEvent {
  baseDuration: number;
  lifetime: number[];
  chunks: OutputChunk[];
  // timelineSegments: {
  //   start: number;
  //   end: number;
  //   type: "base" | "slow" | "haste" | "freeze";
  //   sourceIndex: number | null;
  // }[];
}

/**
 * Generates a cooldown event based on the provided base duration and modifier chunks.
 *
 * @param {number} baseDuration - The base duration of the cooldown.
 * @param {ModifierChunk[]} modifiers - An array of modifier chunks that affect the cooldown.
 * @returns {Object} An object containing the base duration, total duration, output chunks, and remaining modifiers.
 */
export function generateCooldownEvent(card: SimCard): CooldownEvent | undefined {
  const baseDuration = card.bash.cooldown;
  const modifiers = card.simulation.modifiers;
  const startTime = getTotalLifetime(card.simulation.lifetime);

  if (!baseDuration) return

  const resolvedModifiers = resolveOverlappingModifiers(modifiers);
  const timelineSegments = buildTimelineSegments(resolvedModifiers);
  const { chunks, lifetime, chunkLifetime } = convertSegmentsToChunks(baseDuration, timelineSegments, startTime);
  // const remainingModifiers = extractRemainingModifiers(modifiers, lifetime[lifetime.length - 1] || 0);

  // if (card.name === "Halberdier") console.log("rex chunky: ", timelineSegments)

  // if (card.name === "Halberdier") console.log("rex chunky: ", startTime, lifetime, chunkLifetime, card.simulation.lifetime, modifiers)

  return {
    baseDuration,
    lifetime,
    chunks,
    // remainingModifiers,
  };
}

