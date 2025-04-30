import { generateCooldownEvent } from "./generateCooldownEvent";
import type { CooldownEvent } from "./generateCooldownEvent";
import type { Card, SimCard, CardEffectOutput, } from "../types/card"

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
    applyAllTriggeredEffects(card, (effectOutput) => {
      if (effectOutput.trigger.type !== "start") return;

      applyEffectToTargets({
        sourceCard: card,
        timestamp: 0,
        indexes: effectOutput.trigger.playerTriggerIndexes,
        targetDeck: playerSimCards,
        effectOutput
      })

      applyEffectToTargets({
        sourceCard: card,
        timestamp: 0,
        indexes: effectOutput.trigger.opponentTriggerIndexes,
        targetDeck: opponentSimCards,
        effectOutput
      })
    })
  }

  // --- Main simulation loop ---
  while (globalTime < matchDuration) {
    const next = findNextReadyCard(simCards);
    if (!next) break;
    if (!next.card.bash.cooldown) break; // No cooldown, no need to simulate

    applyAllTriggeredEffects(next.card, (effectOutput) => {
      if (next.card.count === 0) return
      if (effectOutput.trigger.type !== "cooldown") return;
      applyEffectToTargets({
        sourceCard: next.card,
        timestamp: globalTime,
        indexes: effectOutput.trigger.playerTriggerIndexes,
        targetDeck: playerSimCards,
        effectOutput
      });
      applyEffectToTargets({
        sourceCard: next.card,
        timestamp: globalTime,
        indexes: effectOutput.trigger.opponentTriggerIndexes,
        targetDeck: opponentSimCards,
        effectOutput
      });
    })

    advanceTime(simCards, next.timeUntilReady);

    // Generate cooldown event for this card
    const cooldownEvent = generateCooldownEvent({
      baseDuration: next.card.bash.cooldown,
      modifiers: next.card.activeModifiers.map(m => ({
        ...m,
        timestamp: m.timestamp - (globalTime - next.timeUntilReady) // adjust relative to start of event
      }))
    });

    addCooldownEvent(next.card, cooldownEvent);
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
    targetDeck: SimCard[],
    effectOutput: CardEffectOutput
  }

  function applyEffectToTargets({
    sourceCard,
    timestamp,
    indexes,
    targetDeck,
    effectOutput
  }: ApplyEffectProps) {
    const lol = indexes.map(index => {
      const targetCard = targetDeck.find(c => c.index === index);
      if (!targetCard) return null;

      return {
        name: targetCard.name,
        activeModifiers: targetCard.activeModifiers,
      }
    });


    for (const index of indexes) {
      const targetCard = targetDeck.find(c => c.index === index);
      if (!targetCard) continue;

      targetCard.activeModifiers.push({
        type: effectOutput.type,
        duration: effectOutput.value,
        timestamp: timestamp,
        sourceIndex: sourceCard.index,
      });

      console.log("rex: ", {
        name: targetCard.name,
        activeModifiers: targetCard.activeModifiers,
      })
    }
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


  function addCooldownEvent(card: SimCard, cooldownEvent: CooldownEvent) {
    card.cooldownEvents.push(cooldownEvent);
    card.count += 1; // Increment play count

    // Clear current modifiers, replace with leftover ones
    card.activeModifiers = cooldownEvent.remainingModifiers.map(m => ({
      ...m,
      timestamp: m.timestamp + globalTime
    }));

    // Reset cooldown
    card.remainingCooldown = cooldownEvent.duration;
  }

  function advanceTime(cards: SimCard[], elapsed: number): void {
    globalTime += elapsed;
    for (const card of cards) {
      card.remainingCooldown = Math.max(0, card.remainingCooldown - elapsed);
    }
  }

  function applyAllTriggeredEffects(
    sourceCard: SimCard,
    callback: (effectOutput: CardEffectOutput) => void
  ): void {
    for (const effect of sourceCard.effects) {
      const effectOutput = effect(sourceCard);
      callback(effectOutput);
    }
  }
}
