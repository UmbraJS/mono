import type { ModifierChunk, ModifierType, OutputChunk } from "./types";

interface TimelineSegments {
  start: number;
  end: number;
  type: OutputChunk["type"];
  sourceIndex: number | null;
}

/**
 * Builds timeline segments from an array of modifier chunks.
 * Take resolved modifiers, return ordered [start, end, type, source] segments
 * @param {ModifierChunk[]} modifiers - An array of modifier chunks to build segments from.
 * @returns {TimelineSegments[]} An array of timeline segments with start and end times, type, and source.
 */

export function buildTimelineSegments(modifiers: ModifierChunk[]): TimelineSegments[] {
  const events = modifiers.flatMap((mod, i) => [
    { time: mod.timestamp, action: "start", mod, index: i },
    { time: mod.timestamp + mod.duration, action: "end", mod, index: i }
  ]);

  events.sort((a, b) => a.time - b.time || (a.action === "end" ? -1 : 1));

  const active = new Map<ModifierType, { mod: ModifierChunk; index: number }>();
  let lastTime = 0;
  const segments: TimelineSegments[] = [];

  const getCurrent: () => {
    type: OutputChunk["type"];
    sourceIndex: number | null;
  } = () => {
    if (active.has("freeze")) return { type: "freeze", sourceIndex: active.get("freeze")!.mod.sourceIndex };
    if (active.has("slow") && active.has("haste")) return { type: "base", sourceIndex: null };
    if (active.has("slow")) return { type: "slow", sourceIndex: active.get("slow")!.mod.sourceIndex };
    if (active.has("haste")) return { type: "haste", sourceIndex: active.get("haste")!.mod.sourceIndex };
    return { type: "base", sourceIndex: null };
  };

  for (const event of events) {
    if (event.time > lastTime) {
      const current = getCurrent();
      segments.push({ start: lastTime, end: event.time, ...current });
      lastTime = event.time;
    }

    if (event.action === "start") {
      if (event.mod.type === "slow" && active.has("haste")) active.delete("haste");
      if (event.mod.type === "haste" && active.has("slow")) active.delete("slow");
      active.set(event.mod.type, { mod: event.mod, index: event.index });
    } else {
      const current = active.get(event.mod.type);
      if (current?.index === event.index) active.delete(event.mod.type);
    }
  }

  return segments;
}
