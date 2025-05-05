import type { OutputChunk } from "./types";

interface ChunkSegment {
  start: number;
  end: number;
  type: OutputChunk["type"];
  sourceIndex: number | null;
}

interface ChunksContainer {
  chunks: OutputChunk[];
  duration: number;
}

/**
 * Converts timeline segments into output chunks with their respective durations and percentages.
 * Take segments, calculate cooldown percent progress.
 * @param {number} baseDuration - The base duration for the cooldown.
 * @param {Object[]} segments - An array of timeline segments.
 * @param {number} segments[].start - The start time of the segment.
 * @param {number} segments[].end - The end time of the segment.
 * @param {string} segments[].type - The type of the segment (e.g., "freeze", "slow", "haste").
 * @param {string|null} segments[].source - The source of the segment, if applicable.
 * @returns {Object} An object containing the output chunks and total duration.
 */

export function convertSegmentsToChunks(baseDuration: number, segments: ChunkSegment[], startTime: number): ChunksContainer {
  const baseSecondsPerPercent = baseDuration / 100;
  const slowedSecondsPerPercent = (baseDuration * 4) / 100;
  const hastedSecondsPerPercent = (baseDuration / 3) / 100;

  const chunks: OutputChunk[] = [];
  let currentPercent = 100;

  for (const seg of segments) {
    const fullDuration = seg.end - seg.start;
    let duration = fullDuration

    if (seg.type === "freeze") {
      chunks.push({
        type: "freeze",
        duration,
        toPercent: Math.round(currentPercent),
        sourceIndex: seg.sourceIndex,
        timestamp: seg.start + startTime
      });
      continue;
    }

    const secondsPerPercent = seg.type === "base"
      ? baseSecondsPerPercent
      : seg.type === "slow"
        ? slowedSecondsPerPercent
        : hastedSecondsPerPercent;

    const percentUsed = duration / secondsPerPercent;
    const percentUsedScopedToRemainingPercent = Math.min(percentUsed, currentPercent);
    duration = percentUsedScopedToRemainingPercent * secondsPerPercent;
    currentPercent -= percentUsed;

    chunks.push({
      type: seg.type,
      duration,
      toPercent: Math.round(Math.max(currentPercent, 0)),
      sourceIndex: seg.sourceIndex,
      timestamp: seg.start + startTime
    });

    if (currentPercent <= 0) break;
  }

  if (currentPercent > 0) {
    const duration = currentPercent * baseSecondsPerPercent;
    chunks.push({ type: "base", duration, toPercent: 0, sourceIndex: null, timestamp: startTime });
  }

  const totalDuration = chunks.reduce((sum, c) => sum + c.duration, 0);

  return { chunks, duration: parseFloat(totalDuration.toFixed(2)) };
}
