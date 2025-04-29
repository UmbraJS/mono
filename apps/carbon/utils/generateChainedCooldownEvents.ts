import { generateCooldownEvent } from "./generateCooldownEvent";
import type { ModifierChunk, OutputChunk } from "./types";

export interface ChainedCooldownEvent {
  baseDuration: number;
  duration: number;
  chunks: OutputChunk[];
}

export function generateChainedCooldownEvents({
  baseDuration,
  events,
}: {
  baseDuration: number;
  events: ModifierChunk[][];
}): ChainedCooldownEvent[] {
  const results = [];
  let carryOver: ModifierChunk[] = [];
  let currentTime = 0;

  for (const eventModifiers of events) {
    // Combine spillover + local modifiers, all made relative to currentTime
    const allModifiers = [
      ...carryOver.map(mod => ({ ...mod, timestamp: mod.timestamp })), // already relative
      ...eventModifiers.map(mod => ({ ...mod, timestamp: mod.timestamp - currentTime }))
    ];

    const result = generateCooldownEvent({
      baseDuration,
      modifiers: allModifiers
    });

    // Store result
    results.push({
      baseDuration: result.baseDuration,
      duration: result.duration,
      chunks: result.chunks
    });

    // Prepare for next round
    carryOver = result.remainingModifiers;
    currentTime += result.duration;
  }

  return results;
}
