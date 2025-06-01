import type { OutputChunk } from "./types";
import type { SimCard } from "../types/card";

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

export function convertSegmentsToChunks(baseDuration = 10, segments: ChunkSegment[], startTime: number): ChunksContainer {
  const baseSecondsPerPercent = baseDuration / 100;
  const basePercentPerSecond = 100 / baseDuration; // 10% = 1 second

  const slowMult = 2; // 2 = 2x slow
  const slowedSecondsPerPercent = (baseDuration * slowMult) / 100; // 10% = 2 seconds
  const slowedPercentPerSecond = 100 / (baseDuration * slowMult); // 1 second = 5%

  const hasteMult = 2; // 2 = 2x haste
  const hastedSecondsPerPercent = (baseDuration / hasteMult) / 100; // 10% = 0.5 seconds
  const hastedPercentPerSecond = 100 / (baseDuration / hasteMult); // 1 second = 20%

  const chunks: OutputChunk[] = [];

  // There are no segments, so we add a base chunk
  const firstSegment = segments[0];
  const firstSegmentStartsAtZero = firstSegment?.start === 0;

  setInitialChunk();
  bridgeChunksTilNextSegment()

  segments.forEach(((segment, index) => {
    const nextSegment = segments[index + 1] || null;

    const overflowingSegment = handleSegment({
      currentSegment: segment,
      nextSegment,
      index,
    });

    if (overflowingSegment) {
      console.log("Overflowing segment detected:", overflowingSegment);
      const lol = handleSegment({
        currentSegment: overflowingSegment,
        nextSegment,
        index,
      });
    }
  }))

  // All previous chunks only catch up to the last applied modifier.
  // If there are no modifiers or if there should be additional chunks after the last modifier -
  // we need to add chunks until we get have a total lifetime that exceeds the startTime of this simulation call.
  // TLDR: Keep adding base chunks until we reach a total lifetime which exceeds the startTime
  while (getTimestamp(chunks) < startTime) {
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

  return { chunks, segmentedChunks: countSegmentsAcrossChunks(chunks) }; // Return the total duration

  function handleSegment(props: {
    currentSegment: ChunkSegment,
    nextSegment: ChunkSegment | null,
    index: number,
  }) {
    while (props.currentSegment.start > getTimestamp(chunks)) {
      modPadding()
    }
    const overflowingSegment = generateModChunk();
    modCap()
    return overflowingSegment

    function generateModChunk() {
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

      const previousChunk = chunks[chunks.length - 1];
      const currentPercent = previousChunk?.to || 100;

      const secondsPerPercent = props.currentSegment.type === "base"
        ? baseSecondsPerPercent
        : props.currentSegment.type === "slow"
          ? slowedSecondsPerPercent
          : hastedSecondsPerPercent;

      const fullDuration = getDifference(props.currentSegment.start, props.currentSegment.end);

      const percentUsed = fullDuration / secondsPerPercent;
      const nextChunkEnd = currentPercent - percentUsed;

      const percentUsedScopedToRemainingPercent = Math.min(percentUsed, currentPercent);
      const duration = percentUsedScopedToRemainingPercent * secondsPerPercent;
      const roundedDuration = Math.round(duration * 1e12) / 1e12; // Round to 12 decimal places

      const chunkEnd = Math.min(props.currentSegment.end, props.currentSegment.start + roundedDuration)

      chunks.push({
        type: props.currentSegment.type,
        duration: roundedDuration,
        from: previousChunk?.to || 100, // Use previous chunk's to value or 100 if no previous chunk
        to: Math.max(nextChunkEnd, 0), // possibly this is the only place that can decide if we are overlapping with the next cooldown.
        sourceIndex: props.currentSegment.sourceIndex,
        start: props.currentSegment.start,
        end: chunkEnd,
      });

      // if (overflowingChunk) {
      //   // Consume overflowing chunk if it exists
      //   chunks.push(overflowingChunk);
      //   overflowingChunk = null; // Reset the overflowing chunk
      // }

      return nextChunkEnd < 0 ? {
        type: props.currentSegment.type,
        sourceIndex: props.currentSegment.sourceIndex,
        start: chunkEnd,
        end: props.currentSegment.end,
      } : null; // Return null if no overflowing segment is needed

      // set an overflowing chunk with all the info of the remaining modifier

      // const percentPerSecond = props.currentSegment.type === "base"
      //   ? basePercentPerSecond
      //   : props.currentSegment.type === "slow"
      //     ? slowedPercentPerSecond
      //     : hastedPercentPerSecond;

      // const remainingDuration = Math.abs(nextChunkEnd) * secondsPerPercent; // Calculate the remaining duration based on the negative percentage
      // const roundedRemainingDuration = Math.round(remainingDuration * 1e12) / 1e12; // Round to 12 decimal places

      // {
      //   type: props.currentSegment.type,
      //   duration: roundedRemainingDuration,
      //   from: 100,
      //   to: Math.min(100 - roundedRemainingDuration * percentPerSecond, 0),
      //   sourceIndex: props.currentSegment.sourceIndex,
      //   start: chunkEnd,
      //   end: props.currentSegment.end,
      // }

    }

    function modPadding() {
      const priorChunk = chunks[chunks.length - 1];
      const priorChunkWasAFinalChunkToACooldown = priorChunk && priorChunk.to === 0;
      if (!priorChunkWasAFinalChunkToACooldown) return

      const nextSegment = props.currentSegment // segments.find((s => s.start >= priorChunk.end));
      const nextSegmentDoesNotStartAtTheEndOfPriorChunk = nextSegment && nextSegment.start > priorChunk.end;
      if (!nextSegmentDoesNotStartAtTheEndOfPriorChunk) return

      const nextSegmentStart = nextSegment.start;
      const baseChunkEnd = priorChunk.end + baseDuration;
      const chunkEnd = Math.min(baseChunkEnd, nextSegmentStart);
      const priorChunkEnd = priorChunk.end;
      const duration = getDifference(priorChunkEnd, chunkEnd)

      chunks.push({
        type: "base",
        sourceIndex: null,
        from: 100, to: 100 - duration * basePercentPerSecond,
        start: priorChunkEnd, end: chunkEnd,
        duration: duration,
      });
    }

    function modCap() {
      const previousChunk = chunks[chunks.length - 1];
      const currentPercent = previousChunk?.to || 100;

      const lastChunk = chunks[chunks.length - 1];
      const lastChunkIsBase = lastChunk?.type === "base";
      if (!lastChunk || lastChunkIsBase) return; // No last chunk or last chunk is base, nothing to cap
      if (lastChunk.to <= 0) return; // Last chunk already capped, nothing to do
      if (currentPercent <= 0) return; // Current percent is already at or below 0, nothing to cap

      // Add base end chunk
      const remainingPercent = lastChunk.to;

      const remainingCooldownDuration = remainingPercent * baseSecondsPerPercent;
      const baseChunkEnd = lastChunk.end + remainingCooldownDuration;

      const nextSegmentStart = props.nextSegment?.start || baseChunkEnd
      const chunkEnd = Math.min(baseChunkEnd, nextSegmentStart);
      const duration = chunkEnd - lastChunk.end;
      const chunkTo = remainingPercent - duration * basePercentPerSecond
      const chunkToRoundedTo12DecimalPlaces = Math.round(chunkTo * 1e12) / 1e12;

      chunks.push({
        type: `base`,
        to: chunkToRoundedTo12DecimalPlaces,
        from: lastChunk.to,
        sourceIndex: null,
        start: lastChunk.end,
        end: chunkEnd,
        duration: duration,
      });
    }
  }


  function setInitialWholeChunk() {
    if (firstSegmentStartsAtZero) return // if the first segment is the initial chunk then we don't need to set an initial chunk
    chunks.push({
      type: "base",
      sourceIndex: null,
      from: 100, to: 0,
      start: 0, end: baseDuration,
      duration: baseDuration,
    });
  }

  function setInitialPaddingChunk(firstSegmentStart: number) {
    const duration = getDifference(0, firstSegmentStart);
    chunks.push({
      type: "base",
      sourceIndex: null,
      from: 100, to: 100 - duration * basePercentPerSecond,
      start: 0, end: firstSegmentStart,
      duration: duration,
    });
  }

  function setInitialChunk() {
    const firstSegmentStartsBeforeBaseDuration = firstSegment?.start && firstSegment?.start < baseDuration;
    firstSegmentStartsBeforeBaseDuration ? setInitialPaddingChunk(firstSegment?.start) : setInitialWholeChunk();
  }

  function bridgeChunksTilNextSegment() {
    let reachedSegments = false;
    while (!reachedSegments) {
      const nextSegment = segments.find((s) => s.start >= getTimestamp(chunks));

      if (!nextSegment) {
        // There is no segments, setting the initial chunk is enough
        reachedSegments = true;
        continue
      }

      const nextSegmentStart = nextSegment?.start;
      const chunkStart = getTimestamp(chunks);
      const chunkEnd = chunkStart + baseDuration;
      const chunkEndsAfterNextSegmentStarts = chunkEnd > nextSegmentStart;

      if (chunkEndsAfterNextSegmentStarts) {
        reachedSegments = true
        continue
      }

      chunks.push({
        type: "base",
        sourceIndex: null,
        from: 100, to: 0, //100 - basePercentPerSecond * duration,
        start: chunkStart, end: chunkEnd,
        duration: getDifference(chunkStart, chunkEnd),
      });
    }
  }
}

function getTimestamp(chunks: OutputChunk[]) {
  const lastChunk = chunks[chunks.length - 1];
  if (!lastChunk) return 0;
  return lastChunk.end;
}

function countSegmentsAcrossChunks(chunks: OutputChunk[]) {
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
