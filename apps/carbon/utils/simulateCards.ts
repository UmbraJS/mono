import { generateCooldownEvent } from "./generateCooldownEvent";
import type { Card, SimCard, CardEffectOutput } from "../types/card"

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

  // --- Apply all "start" triggered effects ---
  for (const card of simCards) {
    for (const effect of card.effects) {
      const effectOutput = effect(card);
      const targets = effectOutput.trigger;
      if (targets.type !== "start") continue;
      const applyEffect = (indexes: number[], targetDeck: SimCard[]) => {
        console.log("applying effect: ", indexes);
        for (const index of indexes) {
          const targetCard = targetDeck.find(c => c.index === index);
          console.log("applying effect: ", targetCard);
          if (!targetCard) continue;
          targetCard.activeModifiers.push({
            type: effectOutput.type,
            duration: effectOutput.value,
            timestamp: 0,
            sourceIndex: card.index,
          });
        }
      };
      applyEffect(targets.playerTriggerIndexes, playerSimCards);
      applyEffect(targets.opponentTriggerIndexes, opponentSimCards);
      console.log("start effect: ", playerSimCards.map((e) => {
        return {
          name: e.name,
          activeModifiers: e.activeModifiers,
        }
      }))
    }
  }

  // --- Main simulation loop ---
  while (globalTime < matchDuration) {
    const next = findNextReadyCard(simCards);

    if (!next) break;
    if (!next.card.bash.cooldown) break; // No cooldown, no need to simulate

    // Advance time
    globalTime += next.timeUntilReady;
    advanceTimeForAllCards(simCards, next.timeUntilReady);

    // Generate cooldown event for this card
    const cooldownEvent = generateCooldownEvent({
      baseDuration: next.card.bash.cooldown,
      modifiers: next.card.activeModifiers.map(m => ({
        ...m,
        timestamp: m.timestamp - (globalTime - next.timeUntilReady) // adjust relative to start of event
      }))
    });

    next.card.cooldownEvents.push(cooldownEvent);
    next.card.count += 1; // Increment play count

    // Clear current modifiers, replace with leftover ones
    next.card.activeModifiers = cooldownEvent.remainingModifiers.map(m => ({
      ...m,
      timestamp: m.timestamp + globalTime
    }));

    // Reset cooldown
    next.card.remainingCooldown = cooldownEvent.duration;

    // Makes sure the effects are triggered on cooldown and not on start
    if (next.card.count === 1) continue;
    // Apply any triggered effects
    applyAllTriggeredEffects({
      sourceCard: next.card,
      timestamp: globalTime,
      playerDeck: playerSimCards,
      opponentDeck: opponentSimCards
    });
  }

  const playerSimulatedCards = simCards.filter(card => card.owner === "player");
  const opponentSimulatedCards = simCards.filter(card => card.owner === "opponent");

  // --- Return results ---
  return {
    player: playerSimulatedCards,
    opponent: opponentSimulatedCards,
  }

  function initializeSimCards(deck: Card[], owner: "player" | "opponent"): SimCard[] {
    return deck.map((card, index) => ({
      ...card,
      index: index, // Important for tracking in the simulation
      effects: card.effects || [],
      cooldownEvents: [],
      activeModifiers: [], // Start empty; "start" effects will populate
      remainingCooldown: 0, // Start ready to trigger immediately
      count: 0, // Number of times this card has been played
      owner: owner
    }));
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

  function advanceTimeForAllCards(cards: SimCard[], elapsed: number): void {
    for (const card of cards) {
      card.remainingCooldown = Math.max(0, card.remainingCooldown - elapsed);
    }
  }

  function applyEffectToTargets({
    sourceCard,
    timestamp,
    indexes,
    targetDeck,
    effectOutput
  }: {
    sourceCard: SimCard,
    timestamp: number,
    indexes: number[],
    targetDeck: SimCard[],
    effectOutput: CardEffectOutput,
  }) {
    for (const index of indexes) {
      const targetCard = targetDeck.find(c => c.index === index);
      if (!targetCard) continue;
      targetCard.activeModifiers.push({
        type: effectOutput.type,
        duration: effectOutput.value,
        timestamp: timestamp,
        sourceIndex: sourceCard.index,
      });
    }
  }

  function applyAllTriggeredEffects({
    sourceCard,
    timestamp,
    playerDeck,
    opponentDeck
  }: {
    sourceCard: SimCard,
    timestamp: number,
    playerDeck: SimCard[],
    opponentDeck: SimCard[]
  }): void {
    for (const effect of sourceCard.effects) {
      const effectOutput = effect(sourceCard);
      const trigger = effectOutput.trigger;
      if (trigger.type !== "cooldown") continue;
      applyEffectToTargets({
        sourceCard,
        timestamp,
        indexes: trigger.playerTriggerIndexes,
        targetDeck: playerDeck,
        effectOutput
      });
      applyEffectToTargets({
        sourceCard,
        timestamp,
        indexes: trigger.opponentTriggerIndexes,
        targetDeck: opponentDeck,
        effectOutput
      });
    }
  }
}
