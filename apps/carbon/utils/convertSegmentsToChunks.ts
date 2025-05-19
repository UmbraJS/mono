import type { OutputChunk } from "./types";

interface ChunkSegment {
  start: number;
  end: number;
  type: OutputChunk["type"];
  sourceIndex: number | null;
}

interface ChunksContainer {
  chunks: OutputChunk[];
  lifetime: number[];
  chunkLifetime: number[];
}
function getDifference(num1: number, num2: number) {
  return Math.abs(num1 - num2); // Use Math.abs to ensure the result is always positive
}
/**
 * Converts timeline segments into output chunks with their respective durations and percentages.
 * Take segments, calculate cooldown percent progress.
 * @param {number} duration - The base duration for the cooldown.
 * @param {Object[]} chunks - An array of timeline segments.
 * @param {number} segments[].start - The start time of the segment.
 * @param {number} segments[].end - The end time of the segment.
 * @param {string} segments[].type - The type of the segment (e.g., "freeze", "slow", "haste").
 * @param {string|null} segments[].sourceIndex - The source of the segment, if applicable.
 * @returns {Object} An object containing the output chunks and total duration.
 */

export function convertSegmentsToChunks(baseDuration: number, segments: ChunkSegment[], fallbackTime: number): ChunksContainer {
  const baseSecondsPerPercent = baseDuration / 100;
  const slowedSecondsPerPercent = (baseDuration * 4) / 100;
  const hastedSecondsPerPercent = (baseDuration / 3) / 100;

  const chunks: OutputChunk[] = [];
  let currentPercent = 100;
  let previousPercent = 100;

  for (const seg of segments) {
    const fullDuration = getDifference(seg.start, seg.end);
    let duration = fullDuration

    if (seg.type === "freeze") {
      const cPercent = Math.round(currentPercent);
      chunks.push({
        type: "freeze",
        duration,
        to: cPercent,
        from: cPercent,
        sourceIndex: seg.sourceIndex,
        start: seg.start,
        end: seg.end,
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

    previousPercent = currentPercent;
    currentPercent -= percentUsed;

    const cPercent = Math.round(Math.max(currentPercent, 0))
    chunks.push({
      type: seg.type,
      duration,
      from: previousPercent,
      to: cPercent,
      sourceIndex: seg.sourceIndex,
      start: seg.start,
      end: seg.end,
    });

    // Reset percent if it reaches 0
    if (currentPercent <= 0) {
      previousPercent = 100;
      currentPercent = 100;
    }

  }

  if (currentPercent >= 0) {
    const duration = currentPercent * baseSecondsPerPercent;
    chunks.push({
      type: "base", duration,
      to: 0,
      from: previousPercent,
      sourceIndex: null,
      start: fallbackTime,
      end: fallbackTime + duration,
    });
  }

  return { chunks, lifetime: countSegmentsAcrossChunks(chunks, segments), chunkLifetime: chunks.map(e => e.duration) }; // Return the total duration
}

function countSegmentsAcrossChunks(chunks: OutputChunk[], segments: ChunkSegment[]) {
  const segmentDurations = [];
  let currentDuration = 0;
  let currentValue = null;

  // console.log("rex chunky: ", segments, chunks.map(e => ({
  //   duration: e.duration,
  //   startEnd: `${e.start} -> ${e.end}`,
  //   fromTo: `${e.from} -> ${e.to}`,
  //   type: e.type,
  // })))

  for (const chunk of chunks) {
    if (chunk.from === 100) {
      // Start of new segment
      currentDuration = chunk.duration;
      currentValue = chunk.to;
    } else if (currentValue !== null) {
      // Continue the segment
      currentDuration += chunk.duration;
      currentValue = chunk.to;
    }

    if (currentValue === 0) {
      // End of segment
      segmentDurations.push(currentDuration);
      currentDuration = 0;
      currentValue = null;
    }
  }

  return segmentDurations;
}
