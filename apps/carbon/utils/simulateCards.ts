import { generateCooldownEvent } from "./generateCooldownEvent";
import type { CooldownEvent } from "./generateCooldownEvent";
import type { Card, SimCard, CardModifier } from "../types/card"
import { logCard } from "./logEvent";

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

  while (globalTime < matchDuration) {
    const processedCards = processCards(simCards);
    if (!processedCards || processedCards.nextCardsToFinish.length === 0) continue; // No cards to finish

    globalTime = processedCards.nextCooldownEnd;
    // pushModifiers(processedCards);
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
      .sort((a, b) => a.remainingCooldown - b.remainingCooldown);
    if (cardEvents.length === 0) return;

    const smallestDuration = Math.min(...cardEvents.map(e => e.duration));
    const nextCardsToFinish = cardEvents.filter(e => e.duration === smallestDuration);
    if (nextCardsToFinish.length === 0) return;

    const remainingCooldowns = nextCardsToFinish.map(e => e.remainingCooldown);
    const nextCardRemainingCooldown = remainingCooldowns[0];
    if (!nextCardRemainingCooldown) return;

    return {
      nextCardsToFinish: nextCardsToFinish,
      nextCooldownEnd: nextCardRemainingCooldown,
    }
  }

  type ProccessedCards = ReturnType<typeof processCards>;

  function cooldownEvent(card: SimCard) {
    if (!card.bash.cooldown) return; // No cooldown, no need to simulate

    // STAGE 1: Generate a cooldown event for the next card
    const e = generateCooldownEvent({
      baseDuration: card.bash.cooldown,
      startTime: card.simulation.nextCooldownTimestamp,
      modifiers: card.simulation.modifiers,
    })

    const nextCardCooldownEnd = getNextCooldownEnd(card.simulation.lifetime, e);

    // logCard({
    //   name: card.name,
    //   nextCard: {
    //     card: card,
    //     remainingCooldown: getRemainingCooldown(card),
    //   },
    //   globalTime: globalTime,
    //   nextCardCooldownEnd,x
    //   cooldownEvent: e
    // })

    const allModifiers = card.effects.map(effect => {
      const cardModifier = effect(card);
      if (card.simulation.lifetime.length === 0) return // These are for the first cooldown so we only start when the card has hit at least 1 cooldown
      if (cardModifier.trigger.type !== "cooldown") return;

      return getModifiers({
        sourceCard: card,
        timestamp: nextCardCooldownEnd,
        modifier: cardModifier
      });
    }).filter(e => e !== undefined);

    return {
      ...e,
      card: card,
      remainingCooldown: getRemainingCooldown(card.simulation.lifetime, e.duration, globalTime),
      totalLifetime: getTotalLifetime(card.simulation.lifetime),
      nextCooldownEnd: nextCardCooldownEnd,
      allModifiers
    };
  }

  function pushModifiers(nextCards: ProccessedCards) {
    if (!nextCards) return;
    for (const nextCard of nextCards.nextCardsToFinish) {
      const cooldownEvent = nextCard;
      if (!cooldownEvent.allModifiers) continue;

      nextCard.card.simulation.cooldownEvents.push(cooldownEvent);
      nextCard.card.simulation.lifetime.push(cooldownEvent.duration); // Add to lifetime
      // card.simulation.nextCooldownTimestamp += cooldownEvent.duration; // Update current time

      // card.simulation.modifiers = [
      //   ...card.simulation.modifiers,
      //   // ...cooldownEvent.remainingModifiers
      // ];

      for (const modifier of cooldownEvent.allModifiers) {
        modifier.playerModifiers.forEach(m => {
          const targetCard = playerSimCards.find(c => c.index === m.index);
          if (!targetCard) return;
          targetCard.simulation.modifiers.push({
            type: m.type,
            duration: m.duration,
            timestamp: nextCards.nextCooldownEnd,
            sourceIndex: m.sourceIndex,
          });
        })
      }
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

function getNextCooldownEnd(lifetime: number[], nextEvent: CooldownEvent) {
  const totalLifetime = getTotalLifetime(lifetime);
  return totalLifetime + nextEvent.duration;
}

function getTotalLifetime(lifetime: number[]) {
  return lifetime.reduce((acc, curr) => acc + curr, 0);
}
