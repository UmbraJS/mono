import type { OutputChunk } from './types';
import { resolveOverlappingModifiers } from './resolveOverlappingModifiers';
import { buildTimelineSegments } from './buildTimelineSegments';
import { convertSegmentsToChunks } from './convertSegmentsToChunks';
import type { SimCard } from '../../types/card';
import { getTotalLifetime } from '../simulateTime';

export interface CooldownEvent {
  baseDuration: number;
  segmentedChunks: number[];
  chunks: OutputChunk[];
}

/**
 * Generates a cooldown event based on the provided base duration and modifier chunks.
 *
 * @param {number} baseDuration - The base duration of the cooldown.
 * @param {ModifierChunk[]} modifiers - An array of modifier chunks that affect the cooldown.
 * @returns {Object} An object containing the base duration, total duration, output chunks, and remaining modifiers.
 */
export function generateCooldownEvent(card: SimCard): CooldownEvent | undefined {
  const baseDuration = card.cardStats.bash?.cooldown;
  const modifiers = card.simulation.modifiers;
  const startTime = getTotalLifetime(card.simulation.lifetime);

  if (!baseDuration) return

  const resolvedModifiers = resolveOverlappingModifiers(modifiers);
  const timelineSegments = buildTimelineSegments(resolvedModifiers);
  const { chunks, segmentedChunks } = convertSegmentsToChunks(baseDuration, timelineSegments, startTime);

  return {
    baseDuration,
    segmentedChunks,
    chunks,
  };
}

