import { generateCooldownEvent } from './time/generateCooldownEvent';
import type { CooldownEvent } from './time/generateCooldownEvent';
import type { CardStats, SimCard, PreSimulationCard, TimeEffect } from '../types/card'

interface ProcessedCard extends CooldownEvent {
  card: SimCard;
  totalLifetime: number;
  nextCooldownEnd: number;
  allModifiers?: ReturnType<typeof getModifiers>[];
}

interface SimulateCooldownTimelineArgs {
  playerDeck: PreSimulationCard[];
  opponentDeck: PreSimulationCard[];
  onTrigger: (triggeredCard: ProcessedCard) => void;
  matchCondition: () => boolean;
}

export function simulateTime({
  onTrigger,
  playerDeck,
  opponentDeck,
  matchCondition,
}: SimulateCooldownTimelineArgs) {
  const playerSimCards = initializeSimCards(playerDeck, 'player');
  const opponentSimCards = initializeSimCards(opponentDeck, 'opponent');

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

  while (!matchCondition() && count < 100) {
    const processedCards = processCards(simCards);
    if (!processedCards || processedCards.nextCardsToFinish.length === 0) {
      continue;
    };

    processedCards.nextCardsToFinish.map(c => {
      onTrigger(c)
    })

    mutateTime(processedCards)
    // console.log("rex test: ", {
    //   name: card.name,
    //   segmentedChunks,
    //   chunks: chunks.map(c => ({
    //     startEnd: `${c.start} -> ${c.end} = ${c.duration}`,
    //     fromTo: `${c.from} -> ${c.to}`,
    //     type: c.type,
    //   })),
    // })

    // console.log("rex text: ", simCards.map(c => ({
    //   name: c.name,
    //   lifetime: c.simulation.lifetime,
    // })))

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
          const targetCard = playerSimCards.find(c => c.card.index === mod.index);
          if (!targetCard) return;
          targetCard.simulation.modifiers.push(mod);
        })
        modifier.opponentModifiers.forEach(mod => {
          const targetCard = opponentSimCards.find(c => c.card.index === mod.index);
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
        const sideEffects = cards.filter(c => c.cardStats.effects.some(effect => {
          const isPlayer = card.owner.user === 'player';
          const comparisonCardIsPlayer = c.owner.user === 'player';
          const cardsAreOnTheSameSide = isPlayer === comparisonCardIsPlayer;

          const trigger = effect({
            card: c,
            opponentCards: comparisonCardIsPlayer ? opponentSimCards : playerSimCards,
            playerCards: comparisonCardIsPlayer ? playerSimCards : opponentSimCards,
          }).trigger;

          const playerTriggerIndexes = trigger.playerTriggerIndexes
          const isPlayerTriggerUndefined = playerTriggerIndexes === undefined;

          return cardsAreOnTheSameSide
            ? isPlayerTriggerUndefined ? c.card.index === card.card.index : playerTriggerIndexes.includes(card.card.index)
            : trigger.opponentTriggerIndexes?.includes(card.card.index);
        }))

        // Get modifiers for next events
        const allModifiers = sideEffects.flatMap(c => c.cardStats.effects.map(e => ({
          effect: e,
          sourceCard: c,
        }))).map(({ effect, sourceCard }) => {
          const cardModifier = effect({
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
          allModifiers
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

  function initializeSimCards(deck: PreSimulationCard[], owner: 'player' | 'opponent'): SimCard[] {
    return deck.map((thisCard) => {
      return {
        ...thisCard,
        owner: {
          user: owner,
          characterIndex: 0, // Default to 0, can be set later if needed
        }, // Owner of the card
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
    sourceCard.card.index
    return {
      type: modifier.timeType,
      duration: modifier.value,
      timestamp: timestamp,
      sourceIndex: sourceCard.card.index,
      index: index,
    }
  }

  // Reverse the player/opponent modifiers when simulating the opponents deck
  const isPlayer = sourceCard.owner.user === 'player';
  return {
    type: modifier.timeType,
    playerModifiers: isPlayer ? target.playerTargetIndexes.map(mapModifier) : target.opponentTargetIndexes.map(mapModifier),
    opponentModifiers: isPlayer ? target.opponentTargetIndexes.map(mapModifier) : target.playerTargetIndexes.map(mapModifier),
  }
}
