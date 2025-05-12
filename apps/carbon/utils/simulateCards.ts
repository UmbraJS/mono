import { generateCooldownEvent } from "./generateCooldownEvent";
import type { CooldownEvent } from "./generateCooldownEvent";
import type { Card, SimCard, CardModifier } from "../types/card"
import { logCard } from "./logEvent";
import type { timestamp } from "@vueuse/core";

interface SimulateCooldownTimelineArgs {
  playerDeck: Card[];
  opponentDeck: Card[];
  matchDuration?: number;
}

export function simulateCooldownTimeline({
  playerDeck,
  opponentDeck,
  matchDuration = 30,
}: SimulateCooldownTimelineArgs) {
  const playerSimCards = initializeSimCards(playerDeck, "player");
  const opponentSimCards = initializeSimCards(opponentDeck, "opponent");
  const simCards = [...playerSimCards, ...opponentSimCards];
  let globalTime = 0;

  // --- Apply all "start" modifier effects ---
  // for (const card of simCards) {
  //   forEachEffect(card, (cardModifier) => {
  //     if (cardModifier.trigger.type !== "start") return;

  //     pushModifiers({
  //       sourceCard: card,
  //       timestamp: 0,
  //       indexes: cardModifier.trigger.playerTriggerIndexes,
  //       mutateDeck: playerSimCards,
  //       modifier: cardModifier
  //     })

  //     pushModifiers({
  //       sourceCard: card,
  //       timestamp: 0,
  //       indexes: cardModifier.trigger.opponentTriggerIndexes,
  //       mutateDeck: opponentSimCards,
  //       modifier: cardModifier
  //     })
  //   })
  // }

  let count = 0;

  while (count < 10) {
    const processedCards = processCards(simCards);
    console.log("processedCards", processedCards?.nextCardsToFinish.map(c => c.card.name), simCards.map(c => c.name));
    if (!processedCards || processedCards.nextCardsToFinish.length === 0) continue; // No cards to finish


    globalTime = processedCards.nextCooldownEnd;
    pushCardEvents(processedCards, (cardEvent) => {
      pushModifiers(cardEvent);
    });

    count++;
  }

  // --- Return results ---
  return {
    player: playerSimCards,
    opponent: opponentSimCards,
  }

  /**
  * Processes the cooldown events for the next cards and returns the cards that will finish next.
  */
  function processCards(cards: SimCard[]) {
    const cardEvents = cards
      .map((card) => cooldownEvent(card))
      .filter(e => e !== undefined)
      .sort((a, b) => a.nextCooldownEnd - b.nextCooldownEnd);
    if (cardEvents.length === 0) return;


    const nextCardToFinish = cardEvents[0];
    if (!nextCardToFinish) return;
    const nextCardsToFinish = cardEvents.filter(e => e.nextCooldownEnd === nextCardToFinish.nextCooldownEnd);
    if (nextCardsToFinish.length === 0) return;

    const remainingCooldowns = nextCardsToFinish.map(e => e.remainingCooldown);
    const nextCardRemainingCooldown = remainingCooldowns[0];
    if (!nextCardRemainingCooldown) return;

    return {
      nextCardsToFinish: nextCardsToFinish,
      nextCardRemainingCooldown: nextCardRemainingCooldown,
      nextCooldownEnd: nextCardsToFinish[0]?.nextCooldownEnd ?? 0,
    }
  }

  type ProccessedCards = ReturnType<typeof processCards>;

  function cooldownEvent(card: SimCard) {
    if (!card.bash.cooldown) return; // No cooldown, no need to simulate

    // STAGE 1: Generate a cooldown event for the next card
    const cooldownEvent = generateCooldownEvent({
      baseDuration: card.bash.cooldown,
      startTime: card.simulation.nextCooldownTimestamp,
      modifiers: card.simulation.modifiers,
    })

    const { nextCardCooldownEnd, totalLifetime } = getNextCooldownEnd({
      lifetime: card.simulation.lifetime,
      nextEventDuration: cooldownEvent.duration,
    });

    const allModifiers = getEffectModifiers(totalLifetime);
    // console.log(`this cooldown ${totalLifetime} - ${nextCardCooldownEnd} : [${allModifiers.map((c) => c.playerModifiers[0]?.timestamp)}]`);

    function getEffectModifiers(nextCardCooldownEnd: number) {
      return card.effects.map(effect => {
        const cardModifier = effect(card);
        if (cardModifier.trigger.type !== "cooldown") return;

        return getModifiers({
          sourceCard: card,
          timestamp: nextCardCooldownEnd,
          modifier: cardModifier
        });

      }).filter(mod => mod !== undefined);
    }

    // console.groupCollapsed(`%c🛡️ ${card.name} Event ${card.simulation.lifetime}`);
    // console.log("card: ", card.name);
    // console.log("applied modifiers: ", card.simulation.modifiers.map(m => m.timestamp));
    // console.log("all modifiers", allModifiers);
    // console.log("event: ", cooldownEvent)

    return {
      ...cooldownEvent,
      card: card,
      remainingCooldown: getRemainingCooldown(card.simulation.lifetime, cooldownEvent.duration, globalTime),
      totalLifetime: totalLifetime,
      nextCooldownEnd: nextCardCooldownEnd,
      allModifiers
    };
  }

  type CardEvent = ReturnType<typeof cooldownEvent>;

  function pushCardEvents(nextCards: ProccessedCards, callback: ({
    cardEvent,
    timestamp
  }: {
    cardEvent: CardEvent;
    timestamp: number;
  }) => void) {
    if (!nextCards) return;
    for (const nextCard of nextCards.nextCardsToFinish) {
      const cooldownEvent = nextCard;
      if (!cooldownEvent.allModifiers) continue;

      nextCard.card.simulation.cooldownEvents.push(cooldownEvent);
      nextCard.card.simulation.lifetime.push(cooldownEvent.duration);
      nextCard.card.simulation.nextCooldownTimestamp += cooldownEvent.nextCooldownEnd;

      // card.simulation.modifiers = [
      //   ...card.simulation.modifiers,
      //   // ...cooldownEvent.remainingModifiers
      // ];

      callback({
        cardEvent: cooldownEvent,
        timestamp: nextCard.totalLifetime
      });

    }
  }

  function pushModifiers({
    cardEvent,
    timestamp
  }: { cardEvent: CardEvent; timestamp: number }) {
    if (!cardEvent) return;
    for (const modifier of cardEvent.allModifiers) {
      modifier.playerModifiers.forEach(m => {
        const targetCard = playerSimCards.find(c => c.index === m.index);
        if (!targetCard) return;
        targetCard.simulation.modifiers.push({
          type: m.type,
          duration: m.duration,
          timestamp: timestamp,
          sourceIndex: m.sourceIndex,
        });
      })
    }
  }

  interface GetModifiersProps {
    sourceCard: SimCard,
    timestamp: number,
    modifier: CardModifier
  }

  function getModifiers({
    sourceCard,
    timestamp,
    modifier
  }: GetModifiersProps) {
    const trigger = modifier.trigger;
    function mapModifier(index: number) {
      return {
        type: modifier.type,
        duration: modifier.value,
        timestamp: timestamp,
        sourceIndex: sourceCard.index,
        index: index,
      }
    }
    return {
      type: modifier.type,
      playerModifiers: trigger.playerTriggerIndexes.map(mapModifier),
      opponentModifiers: trigger.opponentTriggerIndexes.map(mapModifier),
    }
  }

  function initializeSimCards(deck: Card[], owner: "player" | "opponent"): SimCard[] {
    const simCards: SimCard[] = []

    for (const card of deck) {
      const cooldown = card.bash.cooldown;
      if (!cooldown) continue;
      simCards.push({
        ...card,
        index: card.index, // Important for tracking in the simulation
        effects: card.effects || [],
        simulation: {
          cooldownEvents: [],
          modifiers: [], // Start empty; "start" effects will populate
          lifetime: [], // Amount of time in cooldowns passed for this card
          owner: owner, // Owner of the card
          nextCooldownTimestamp: 0, // Amount of time passed for this card
        },
      })
    }

    return simCards
  }
}

export function getRemainingCooldown(lifetime: number[], cooldownDuration: number, globalTime: number) {
  const lastLifetimeEntry = lifetime[lifetime.length - 1];
  if (!lastLifetimeEntry) return cooldownDuration;
  const totalLifetime = getTotalLifetime(lifetime);
  const nextCooldownEnd = totalLifetime + cooldownDuration;
  const remainingDuration = nextCooldownEnd - globalTime;

  if (totalLifetime > globalTime) {
    console.error("Total lifetime is greater than global time", { totalLifetime, globalTime });
    return cooldownDuration;
  }

  return remainingDuration || cooldownDuration;
}

function getNextCooldownEnd({
  lifetime,
  nextEventDuration
}: {
  lifetime: number[];
  nextEventDuration: number
}) {
  const totalLifetime = getTotalLifetime(lifetime);
  return {
    nextCardCooldownEnd: totalLifetime + nextEventDuration,
    totalLifetime,
  }
}

function getTotalLifetime(lifetime: number[]) {
  return lifetime.reduce((acc, curr) => acc + curr, 0);
}
