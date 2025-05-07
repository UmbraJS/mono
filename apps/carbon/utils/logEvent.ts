import type { CooldownEvent } from "./generateCooldownEvent";
import type { SimCard, CardName } from "../types/card"

interface LogCard {
  name: CardName,
  nextCard: {
    card: SimCard,
    remainingCooldown: number,
  },
  globalTime: number,
  nextCardCooldownEnd: number,
  cooldownEvent: CooldownEvent
}

export function logCard({
  name,
  nextCard,
  globalTime,
  nextCardCooldownEnd,
  cooldownEvent
}: LogCard) {
  if (nextCard.card.name !== name) return
  const nextCooldownTimestamp = nextCard.card.simulation.nextCooldownTimestamp; // The cooldownEvent.duration added to itself each round
  const count = nextCard.card.simulation.lifetime.length + 1 > 9 ? nextCard.card.simulation.lifetime.length + 1 : `0${nextCard.card.simulation.lifetime.length + 1}`;

  const ERROR_COOLDOWN_START_BEFORE_END = nextCardCooldownEnd < nextCooldownTimestamp;
  const eventStyle = `color: ${ERROR_COOLDOWN_START_BEFORE_END ? "red" : "white"}; font-weight: bold; font-size: 14px; background: black; padding: 5px 15px; border-radius: 6px;`;

  console.groupCollapsed(`%c🛡️ ${name} Event ${count}`, eventStyle);

  const subTitleStyle = "font-weight: bold; font-size: 14px;";
  console.groupCollapsed(`%c Modifiers`, subTitleStyle);
  console.table(nextCard.card.simulation.modifiers.map(m => ({
    duration: m.duration,
    timestamp: m.timestamp,
  })))
  console.groupEnd();

  console.groupCollapsed(`%c Resolved Modifiers`, subTitleStyle);
  console.table(cooldownEvent.resolvedModifiers.map((modifier) => ({
    duration: modifier.duration,
    timestamp: modifier.timestamp,
  })));
  console.groupEnd();

  console.groupCollapsed(`%c Timeline Segments`, subTitleStyle);
  console.table(cooldownEvent.timelineSegments.map((segment) => ({
    start: segment.start,
    end: segment.end,
    type: segment.type,
  })));
  console.groupEnd();

  console.groupCollapsed(`%c Generated Chunks`, subTitleStyle);
  console.table(cooldownEvent.chunks.map((chunk) => ({
    type: chunk.type,
    duration: chunk.duration,
    toPercent: chunk.toPercent,
    timestamp: chunk.timestamp,
  })));
  console.groupEnd();

  console.table({
    timeStamp: globalTime,
    segment: `${nextCooldownTimestamp} - ${nextCardCooldownEnd} :: ${nextCard.remainingCooldown}`,
    segment2: `${nextCardCooldownEnd - cooldownEvent.duration} - ${nextCardCooldownEnd} :: ${cooldownEvent.duration}`,
    duration: `${cooldownEvent.duration - nextCard.remainingCooldown} / ${cooldownEvent.duration} : remaining ${nextCard.remainingCooldown}`,
  });

  console.groupEnd();
}


