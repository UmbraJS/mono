import { generateCooldownEvent } from "./generateCooldownEvent";
import type { Card, SimCard, CardModifier } from "../types/card"

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

  // return {
  //   player: playerSimCards,
  //   opponent: opponentSimCards,
  // }

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

  while (globalTime < 30 && count < 100) {
    // Calculate data
    const processedCards = processCards(simCards);


    // Pass time
    if (!processedCards || processedCards.nextCardsToFinish.length === 0) {
      globalTime += 1;
      continue;
    }; // No cards to finish
    globalTime = processedCards.nextCooldownEnd;

    // Mutate data
    for (const nextCardToFinish of processedCards.nextCardsToFinish) {
      if (!nextCardToFinish.allModifiers) continue; // No modifiers to apply so nothing to do

      // Store data on the next card
      nextCardToFinish.card.simulation.chunks = nextCardToFinish.chunks;
      const nextCardCooldownDuration = nextCardToFinish.segmentedChunks[nextCardToFinish.segmentedChunks.length - 1];
      if (!nextCardCooldownDuration) continue;

      nextCardToFinish.card.simulation.lifetime.push(nextCardCooldownDuration);

      if (((nextCardToFinish?.totalLifetime ?? 0)) > 30) continue;
      if (!nextCardToFinish) continue;

      // Store data on every card modified by this next card
      for (const modifier of nextCardToFinish.allModifiers) {
        modifier.playerModifiers.forEach(mod => {
          const targetCard = playerSimCards.find(c => c.index === mod.index);
          if (!targetCard) return;
          targetCard.simulation.modifiers.push(mod);
        })
        modifier.opponentModifiers.forEach(mod => {
          const targetCard = opponentSimCards.find(c => c.index === mod.index);
          if (!targetCard) return;
          targetCard.simulation.modifiers.push(mod);
        })
      }
    }

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

    return {
      nextCardsToFinish: nextCardsToFinish,
      nextCooldownEnd: nextCardsToFinish[0]?.nextCooldownEnd ?? 0,
    }
  }

  function cooldownEvent(card: SimCard) {
    // Generate event using previously stored modifiers
    const cooldownEvent = generateCooldownEvent(card);
    if (!cooldownEvent) return;

    const totalLifetime = getTotalLifetime(card.simulation.lifetime);
    const nextCooldownEnd = getTotalLifetime(cooldownEvent.segmentedChunks);

    // Get modifiers for next events
    const allModifiers = card.effects.map(effect => {
      const cardModifier = effect({
        card,
        opponentCards: opponentSimCards,
        playerCards: playerSimCards,
      });
      if (cardModifier.trigger.type !== "cooldown") return;

      return getModifiers({
        sourceCard: card,
        timestamp: getTotalLifetime(cooldownEvent.segmentedChunks),
        modifier: cardModifier
      });

    }).filter(mod => mod !== undefined);


    return {
      ...cooldownEvent,
      card: card,
      totalLifetime,
      nextCooldownEnd,
      allModifiers
    };
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
    return deck.map((thisCard, index) => {
      return {
        ...thisCard,
        index: index, // Important for tracking in the simulation
        effects: thisCard.effects || [],
        simulation: {
          chunks: [],
          modifiers: [], // Start empty; "start" effects will populate
          lifetime: [], // Amount of time in cooldowns passed for this card
          owner: owner, // Owner of the card
        },
      }
    });
  }
}

export function getTotalLifetime(lifetime: number[]) {
  return lifetime.reduce((acc, curr) => acc + curr, 0);
}
