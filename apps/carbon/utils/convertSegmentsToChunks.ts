import type { OutputChunk } from "./types";

interface ChunkSegment {
  start: number;
  end: number;
  type: OutputChunk["type"];
  sourceIndex: number | null;
}

interface ChunksContainer {
  chunks: OutputChunk[];
  segmentedChunks: number[];
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

export function convertSegmentsToChunks(baseDuration = 10, segments: ChunkSegment[], startTime: number, name: string): ChunksContainer {
  const baseSecondsPerPercent = baseDuration / 100;
  const basePercentPerSecond = 100 / baseDuration; // 10% = 1 second

  const slowMult = 2; // 2 = 2x slow
  const slowedSecondsPerPercent = (baseDuration * slowMult) / 100; // 10% = 2 seconds
  const slowedPercentPerSecond = 100 / (baseDuration * slowMult); // 1 second = 5%

  const hasteMult = 2; // 2 = 2x haste
  const hastedSecondsPerPercent = (baseDuration / hasteMult) / 100; // 10% = 0.5 seconds
  const hastedPercentPerSecond = 100 / (baseDuration / hasteMult); // 1 second = 20%

  const chunks: OutputChunk[] = [];

  // Add base start chunk
  // base paddings

  // There are no segments, so we add a base chunk
  const noSegments = segments.length === 0; // false
  const firstSegment = segments[0]; //  { start: 5, end: 6, type: 'haste', sourceIndex: 0 }
  const firstSegmentDoesNotStartAtZero = firstSegment && firstSegment.start > 0; // true

  if (noSegments) {
    chunks.push({
      type: "base",
      sourceIndex: null,
      from: 100, to: 0,
      start: 0, end: baseDuration,
      duration: baseDuration,
    });
  } else if (firstSegmentDoesNotStartAtZero) {
    // There are segments but they don't start at 0 so we add a base chunk
    const firstSegmentStart = firstSegment.start;
    chunks.push({
      type: "base",
      sourceIndex: null,
      from: 100, to: 100 - basePercentPerSecond * firstSegmentStart,
      start: 0, end: firstSegmentStart,
      duration: getDifference(0, firstSegment.start),
    });
  }

  segments.forEach(((seg, index) => {
    const fullDuration = getDifference(seg.start, seg.end);
    let duration = fullDuration

    const priorChunk = chunks[chunks.length - 1];
    const priorChunkWasAFinalChunkToACooldown = priorChunk && priorChunk.to === 0;

    if (priorChunkWasAFinalChunkToACooldown) {
      const nextSegment = segments.find((s => s.start > priorChunk.end));
      const nextSegmentDoesNotStartAtTheEndOfPriorChunk = nextSegment && nextSegment.start > priorChunk.end;

      if (nextSegmentDoesNotStartAtTheEndOfPriorChunk) {
        const nextSegmentStart = nextSegment.start;
        const priorChunkEnd = priorChunk.end;
        const duration = getDifference(priorChunkEnd, nextSegmentStart)
        chunks.push({
          type: "base",
          sourceIndex: null,
          from: 100, to: 100 - duration * basePercentPerSecond,
          start: priorChunkEnd, end: nextSegmentStart,
          duration: duration,
        });
      }
    }

    // if (seg.type === "freeze") {
    //   const cPercent = Math.round(currentPercent);
    //   chunks.push({
    //     type: "freeze",
    //     duration,
    //     to: cPercent,
    //     from: cPercent,
    //     sourceIndex: seg.sourceIndex,
    //     start: seg.start,
    //     end: seg.end,
    //   });
    //   return;
    // }

    const secondsPerPercent = seg.type === "base"
      ? baseSecondsPerPercent
      : seg.type === "slow"
        ? slowedSecondsPerPercent
        : hastedSecondsPerPercent;

    const previousChunk = chunks[chunks.length - 1];
    const cPercent = previousChunk?.to || 100;
    const percentUsed = duration / secondsPerPercent;
    const nextChunkEnd = cPercent - percentUsed;

    const percentUsedScopedToRemainingPercent = Math.min(percentUsed, cPercent);
    duration = percentUsedScopedToRemainingPercent * secondsPerPercent;

    chunks.push({
      type: seg.type,
      duration,
      from: previousChunk?.to || 100, // Use previous chunk's to value or 100 if no previous chunk
      to: Math.max(nextChunkEnd, 0), // possibly this is the only place that can decide if we are overlapping with the next cooldown.
      sourceIndex: seg.sourceIndex,
      start: seg.start,
      end: seg.end,
    });

    const lastChunk = chunks[chunks.length - 1];
    const lastChunkIsBase = lastChunk?.type === "base";

    if (cPercent >= 0 && !lastChunkIsBase && lastChunk) {
      // Add base end chunk
      const remainingPercent = lastChunk.to;

      const remainingCooldownDuration = remainingPercent * baseSecondsPerPercent;
      const thisCooldownEnd = lastChunk.end + remainingCooldownDuration;
      const nextEnd = lastChunk.end + remainingCooldownDuration;

      const nextSegmentStart = segments[index + 1]?.start || nextEnd
      const baseCapEnd = Math.min(thisCooldownEnd, nextSegmentStart);
      const thisCapDuration = Math.abs(lastChunk.end - baseCapEnd);

      chunks.push({
        type: `base`,
        to: remainingPercent - thisCapDuration * basePercentPerSecond,
        from: lastChunk.to,
        sourceIndex: null,
        start: lastChunk.end,
        end: Math.min(nextSegmentStart, thisCooldownEnd),
        duration: thisCapDuration,
      });
    }
  }))

  // All previous chunks only catch up to the last applied modifier.
  // If there are no modifiers or if there should be additional chunks after the last modifier -
  // we need to add chunks until we get have a total lifetime that exceeds the startTime of this simulation call.
  // TLDR: Keep adding base chunks until we reach a total lifetime which exceeds the startTime
  while (getTotalLifetime(chunks) < startTime) {
    const lastChunk = chunks[chunks.length - 1];
    const lastChunkEnd = lastChunk ? lastChunk.end : 0;
    chunks.push({
      type: "base",
      sourceIndex: null,
      from: 100, to: 0,
      start: lastChunkEnd,
      end: lastChunkEnd + baseDuration,
      duration: baseDuration,
    });
  }

  function getTotalLifetime(chunks: OutputChunk[]) {
    return chunks.reduce((total, chunk) => total + chunk.duration, 0);
  }

  return { chunks, segmentedChunks: countSegmentsAcrossChunks(chunks, segments) }; // Return the total duration
}

function countSegmentsAcrossChunks(chunks: OutputChunk[], segments: ChunkSegment[]) {
  const segmentDurations = [];
  let currentDuration = 0;
  let currentValue = null;

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
