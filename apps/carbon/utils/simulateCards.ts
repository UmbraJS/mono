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
  let globalTime = findNextReadyCard(simCards)?.timeUntilReady || matchDuration;

  // --- Apply all "start" triggered effects ---
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
    if (!nextCard) break;
    if (!nextCard.card.bash.cooldown) break; // No cooldown, no need to simulate

    const timeUntilNext = nextCard.timeUntilReady;
    const eventStartTime = globalTime + timeUntilNext;

    forEachEffect(nextCard.card, (cardModifier) => {
      if (nextCard.card.count === 0) return
      if (cardModifier.trigger.type !== "cooldown") return;

      pushModifiers({
        sourceCard: nextCard.card,
        timestamp: globalTime,
        indexes: cardModifier.trigger.playerTriggerIndexes,
        mutateDeck: playerSimCards,
        modifier: cardModifier
      });

      pushModifiers({
        sourceCard: nextCard.card,
        timestamp: globalTime,
        indexes: cardModifier.trigger.opponentTriggerIndexes,
        mutateDeck: opponentSimCards,
        modifier: cardModifier
      });
    })

    console.log("rex: nextCard", nextCard.card.name, nextCard.card.modifiers);

    addCooldownEvent(nextCard.card, generateCooldownEvent({
      baseDuration: nextCard.card.bash.cooldown,
      startTime: eventStartTime,
      modifiers: nextCard.card.modifiers,
    }));
    advanceTime(simCards, timeUntilNext);

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
      targetCard.modifiers.push({
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
        cooldownEvents: [],
        modifiers: [], // Start empty; "start" effects will populate
        remainingCooldown: cooldown,
        count: 0, // Number of times this card has been played
        owner: owner
      })
    }

    return simCards
  }

  function findNextReadyCard(cards: SimCard[]): { card: SimCard; timeUntilReady: number } | null {
    let nextCard: SimCard | null = null;
    let shortestTime = Infinity;

    for (const card of cards) {
      if (card.remainingCooldown >= shortestTime) continue;
      shortestTime = card.remainingCooldown;
      nextCard = card;
    }

    return nextCard ? { card: nextCard, timeUntilReady: shortestTime } : null;
  }


  function addCooldownEvent(card: SimCard, cooldownEvent: CooldownEvent) {
    card.remainingCooldown = cooldownEvent.duration; // Reset cooldown
    card.cooldownEvents.push(cooldownEvent);
    card.count += 1; // Increment play count
    card.modifiers = [
      ...card.modifiers.filter(m => m.timestamp > cooldownEvent.baseDuration),
      ...cooldownEvent.remainingModifiers
    ];
  }

  function advanceTime(cards: SimCard[], elapsed: number): void {
    globalTime += elapsed;
    for (const card of cards) {
      card.remainingCooldown = Math.max(0, card.remainingCooldown - elapsed);
    }
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
