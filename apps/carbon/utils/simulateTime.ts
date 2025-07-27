import { generateCooldownEvent } from './time/generateCooldownEvent';
import type { CooldownEvent } from './time/generateCooldownEvent';
import type { SimCard, TimeEffect, Card } from '../types/card'

const MAX_SIMULATION_ITERATIONS = 300;

interface ProcessedCard extends CooldownEvent {
  card: SimCard;
  totalLifetime: number;
  nextCooldownEnd: number;
  allCurrentModifiers?: ReturnType<typeof getModifiers>[];
}

interface SimulateCooldownTimelineArgs {
  playerDeck: Card[];
  opponentDeck: Card[];
  onTrigger: (triggeredCard: ProcessedCard) => void;
  matchCondition: (nextCooldownEnd: number) => boolean;
}

export function simulateTime({
  onTrigger,
  playerDeck,
  opponentDeck,
  matchCondition,
}: SimulateCooldownTimelineArgs) {
  const playerSimCards = initializeSimCards(playerDeck);
  const opponentSimCards = initializeSimCards(opponentDeck);
  const simCards = [...playerSimCards, ...opponentSimCards];

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

  while (count < MAX_SIMULATION_ITERATIONS) {
    const processedCards = processCards(simCards);
    if (!processedCards || processedCards.nextCardsToFinish.length === 0) {
      continue;
    };

    // Check match condition with the current nextCooldownEnd
    if (matchCondition(processedCards.nextCooldownEnd)) break;

    processedCards.nextCardsToFinish.map(c => {
      const actionCount = c.card.stats.bash?.actionCount || 0;
      for (let i = 0; i < actionCount; i++) {
        onTrigger(c);
      }
    })

    mutateTime(processedCards)
    count++;
  }

  // --- Return results ---
  return {
    player: playerSimCards,
    opponent: opponentSimCards,
  }

  function mutateTime(processedCards: Exclude<ReturnType<typeof processCards>, undefined>) {
    // Mutate data
    for (const nextCardToFinish of processedCards.nextCardsToFinish) {
      if (!nextCardToFinish.allCurrentModifiers) continue; // No modifiers to apply so nothing to do

      // Store data on the next card
      nextCardToFinish.card.simulation.chunks = nextCardToFinish.chunks;
      const nextCardCooldownDuration = nextCardToFinish.segmentedChunks[nextCardToFinish.segmentedChunks.length - 1];
      if (!nextCardCooldownDuration) continue;

      nextCardToFinish.card.simulation.lifetime.push(nextCardCooldownDuration);

      if (((nextCardToFinish?.totalLifetime ?? 0)) > 30) continue;
      if (!nextCardToFinish) continue;

      // Store data on every card modified by this next card
      for (const modifier of nextCardToFinish.allCurrentModifiers) {
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
  }

  /**
  * Processes the cooldown events for the next cards and returns the cards that will finish next.
  */
  function processCards(cards: SimCard[]) {
    const processedCards: (ProcessedCard | undefined)[] = cards
      .map((card) => {
        // Generate event using previously stored modifiers
        const cooldownEvent = generateCooldownEvent(card);
        if (!cooldownEvent) return;

        const totalLifetime = getTotalLifetime(card.simulation.lifetime);
        const nextCooldownEnd = getTotalLifetime(cooldownEvent.segmentedChunks);

        // A side effect is an effect of another card which is triggered by this card
        const sideEffects = cards.filter(c => c.stats.effects.some(effect => {

          const isPlayer = card.owner.board === 'player';
          const comparisonCardIsPlayer = c.owner.board === 'player';
          const cardsAreOnTheSameSide = isPlayer === comparisonCardIsPlayer;

          const trigger = effect.action({
            card: c,
            opponentCards: comparisonCardIsPlayer ? opponentSimCards : playerSimCards,
            playerCards: comparisonCardIsPlayer ? playerSimCards : opponentSimCards,
          }).trigger;

          const playerTriggerIndexes = trigger.playerTriggerIndexes
          const isPlayerTriggerUndefined = playerTriggerIndexes === undefined;

          return cardsAreOnTheSameSide
            ? isPlayerTriggerUndefined ? c.index === card.index : playerTriggerIndexes.includes(card.index)
            : trigger.opponentTriggerIndexes?.includes(card.index);
        }))

        // Get modifiers for next events
        const flatMods = sideEffects.flatMap(c => c.stats.effects.map(e => ({
          effect: e,
          sourceCard: c,
        })))

        const allModifiers = flatMods.map(({ effect, sourceCard }) => {
          const cardModifier = effect.action({
            card: sourceCard,
            opponentCards: opponentSimCards,
            playerCards: playerSimCards,
          });
          if (cardModifier.trigger.triggerType !== 'cooldown') return;

          return getModifiers({
            sourceCard: sourceCard,
            timestamp: getTotalLifetime(cooldownEvent.segmentedChunks),
            modifier: cardModifier
          });

        }).filter(mod => mod !== undefined);

        return {
          ...cooldownEvent,
          card: card,
          totalLifetime,
          nextCooldownEnd,
          allCurrentModifiers: allModifiers
        }
      })

    return getNextCardsToFinish(processedCards)
  }

  function getNextCardsToFinish(processedCards: (ProcessedCard | undefined)[]) {
    const cardEvents = processedCards
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

  function initializeSimCards(deck: Card[]): SimCard[] {
    return deck.map((thisCard) => {
      return {
        ...thisCard,
        simulation: {
          chunks: [],
          modifiers: [], // Start empty; "start" effects will populate
          lifetime: [], // Amount of time in cooldowns passed for this card
        },
      }
    });
  }
}

export function getTotalLifetime(lifetime: number[]) {
  return lifetime.reduce((acc, curr) => acc + curr, 0);
}

interface GetModifiersProps {
  sourceCard: SimCard,
  timestamp: number,
  modifier: TimeEffect
}

function getModifiers({
  sourceCard,
  timestamp,
  modifier
}: GetModifiersProps) {
  const target = modifier.target;
  function mapModifier(index: number) {
    return {
      type: modifier.timeType,
      duration: modifier.value,
      timestamp: timestamp,
      sourceIndex: sourceCard.index,
      index: index,
    }
  }

  // Reverse the player/opponent modifiers when simulating the opponents deck
  const isPlayer = sourceCard.owner.board === 'player';
  return {
    type: modifier.timeType,
    playerModifiers: isPlayer ? target.playerTargetIndexes.map(mapModifier) : target.opponentTargetIndexes.map(mapModifier),
    opponentModifiers: isPlayer ? target.opponentTargetIndexes.map(mapModifier) : target.playerTargetIndexes.map(mapModifier),
  }
}
