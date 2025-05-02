import { generateCooldownEvent } from "./generateCooldownEvent";
import type { CooldownEvent } from "./generateCooldownEvent";
import type { Card, SimCard, CardModifier, } from "../types/card"

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
  for (const card of simCards) {
    forEachEffect(card, (cardModifier) => {
      if (cardModifier.trigger.type !== "start") return;

      pushModifiers({
        sourceCard: card,
        timestamp: 0,
        indexes: cardModifier.trigger.playerTriggerIndexes,
        mutateDeck: playerSimCards,
        modifier: cardModifier
      })

      pushModifiers({
        sourceCard: card,
        timestamp: 0,
        indexes: cardModifier.trigger.opponentTriggerIndexes,
        mutateDeck: opponentSimCards,
        modifier: cardModifier
      })
    })
  }

  // --- Main simulation loop ---
  while (globalTime < matchDuration) {
    const nextCard = findNextReadyCard(simCards);
    if (!nextCard.nextCard.bash.cooldown) break; // No cooldown, no need to simulate

    // Gather all modifiers that are triggered by this card
    forEachEffect(nextCard.nextCard, (cardModifier) => {
      if (nextCard.nextCard.simulation.count === 0) return
      if (cardModifier.trigger.type !== "cooldown") return;

      pushModifiers({
        sourceCard: nextCard.nextCard,
        timestamp: globalTime,
        indexes: cardModifier.trigger.playerTriggerIndexes,
        mutateDeck: playerSimCards,
        modifier: cardModifier
      });

      pushModifiers({
        sourceCard: nextCard.nextCard,
        timestamp: globalTime,
        indexes: cardModifier.trigger.opponentTriggerIndexes,
        mutateDeck: opponentSimCards,
        modifier: cardModifier
      });
    })

    // if (nextCard.nextCard.name === "Doom Cloak") console.log("card", eventStartTime, nextCard.nextCard.simulation.nextCooldownTimestamp)

    const e = generateCooldownEvent({
      baseDuration: nextCard.nextCard.bash.cooldown,
      startTime: nextCard.nextCard.simulation.nextCooldownTimestamp,
      modifiers: nextCard.nextCard.simulation.modifiers,
    })

    if (nextCard.nextCard.name === "Doom Cloak") console.log("rex event: ", {
      startTime: nextCard.nextCard.simulation.nextCooldownTimestamp,
      modifiers: nextCard.nextCard.simulation.modifiers,
      resolvedModifiers: e.resolvedModifiers,
      chunks: e.chunks,
    })

    // Generate a cooldown event for this card
    addCooldownEvent(nextCard.nextCard, e);

    // Advance time to the next card's cooldown
    globalTime += nextCard.remainingCooldown;
    // if (nextCard.nextCard.name === "Doom Cloak") console.log("advanceTime", globalTime, nextCard.remainingCooldown, nextCard.remainingCooldown)
    for (const card of simCards) {
      card.simulation.remainingCooldown = Math.max(0, card.simulation.remainingCooldown - nextCard.remainingCooldown);
    }
  }

  // --- Return results ---
  return {
    player: playerSimCards,
    opponent: opponentSimCards,
  }

  interface ApplyEffectProps {
    sourceCard: SimCard,
    timestamp: number,
    indexes: number[],
    mutateDeck: SimCard[],
    modifier: CardModifier
  }

  function pushModifiers({
    sourceCard,
    timestamp,
    indexes,
    mutateDeck,
    modifier
  }: ApplyEffectProps) {
    for (const index of indexes) {
      const targetCard = mutateDeck.find(c => c.index === index);
      if (!targetCard) continue;
      targetCard.simulation.modifiers.push({
        type: modifier.type,
        duration: modifier.value,
        timestamp: timestamp,
        sourceIndex: sourceCard.index,
      });
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
          remainingCooldown: cooldown,
          count: 0, // Number of times this card has been played
          owner: owner, // Owner of the card
          nextCooldownTimestamp: 0, // Amount of time passed for this card
        },
      })
    }

    return simCards
  }

  function findNextReadyCard(cards: SimCard[]) {
    const nextCard = cards.reduce((prev, curr) => {
      return prev.simulation.remainingCooldown < curr.simulation.remainingCooldown ? prev : curr;
    })
    return { nextCard, remainingCooldown: nextCard.simulation.remainingCooldown }
  }

  function addCooldownEvent(card: SimCard, cooldownEvent: CooldownEvent) {
    if (card.name === "Doom Cloak") console.log("addCooldownEvent", {
      name: card.name,
      cooldownStartTime: card.simulation.nextCooldownTimestamp,
      modifiers: card.simulation.modifiers,
      cooldownEvent: cooldownEvent.chunks,
      resolved: cooldownEvent.resolvedModifiers,
    });


    card.simulation.remainingCooldown = cooldownEvent.duration; // Reset cooldown
    card.simulation.nextCooldownTimestamp += cooldownEvent.duration; // Update current time
    card.simulation.cooldownEvents.push(cooldownEvent);
    card.simulation.count += 1; // Increment play count


    // if (card.name === "Doom Cloak") console.log("cooldown event", cooldownEvent);
    card.simulation.modifiers = [
      ...card.simulation.modifiers.filter(m => m.timestamp > globalTime),
      ...cooldownEvent.remainingModifiers
    ];
  }

  function forEachEffect(
    sourceCard: SimCard,
    callback: (modifier: CardModifier) => void
  ): void {
    for (const effect of sourceCard.effects) {
      const cardModifier = effect(sourceCard);
      callback(cardModifier);
    }
  }
}
