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

  // --- Main simulation loop ---
  while (globalTime < matchDuration) {
    console.log("rexer2: ", simCards.map((card) => ({
      name: card.name,
      remaining: card.simulation.remainingCooldown,
      timestamp: globalTime + card.simulation.remainingCooldown
    })))
    const nextCardsToStart = findNextReadyCards(simCards);

    if (nextCardsToStart.cards.length === 0) break; // No more cards to simulate
    const nextCardCooldownEnd = globalTime + nextCardsToStart.remainingCooldown; // We can do this because we know this is the next card that will trigger and therefore no other mods will be triggered until after this timestamp

    const nextCardsToFinish = processNextCards(nextCardsToStart);
    if (!nextCardsToFinish) continue; // No cards to finish
    if (nextCardsToFinish.cards.length === 0) continue;

    // STAGE 3: Advance time
    // Advance time to the next card's cooldown
    globalTime = nextCardCooldownEnd;
    for (const card of simCards) {
      const remainingCooldown = card.simulation.remainingCooldown - nextCardsToFinish.remainingCooldown;
      console.log("rexer3: ", card.name, {
        equation: `${card.simulation.remainingCooldown} - ${nextCardsToFinish.remainingCooldown} = ${remainingCooldown}`,
      })
      if (remainingCooldown <= 0) card.simulation.remainingCooldown = nextCardsToFinish.duration;
      else card.simulation.remainingCooldown = Math.max(0, remainingCooldown);
    }
  }

  // --- Return results ---
  return {
    player: playerSimCards,
    opponent: opponentSimCards,
  }

  /**
  * Processes the cooldown events for the next cards and returns the cards that will finish next.
  */
  function processNextCards(nextCards: FindNextReadyCardsReturn) {
    const cardEvents = nextCards.cards
      .map((nextCard) => {
        console.log("Pushed modifier - cards", nextCard.name, {
          remaining: nextCard.simulation.remainingCooldown,
          timestamp: globalTime + nextCard.simulation.remainingCooldown
        })
        return cooldownEvent(nextCard, globalTime + nextCard.simulation.remainingCooldown)
      })
      .filter(e => e !== undefined)
    if (cardEvents.length === 0) return;

    const smallestDuration = Math.min(...cardEvents.map(e => e.duration));
    const nextCardsToFinish = cardEvents.filter(e => e.duration === smallestDuration);
    if (nextCardsToFinish.length === 0) return;

    const remainingCooldowns = nextCardsToFinish.map(e => e.remainingCooldown);
    console.log("rexer3 - nextCardsToFinish: ", nextCardsToFinish.map(e => ({
      name: e.name,
      remainingCooldown: e.remainingCooldown,
      duration: e.duration,
    })))
    const nextCardRemainingCooldown = remainingCooldowns[0];
    if (!nextCardRemainingCooldown) return;

    return {
      cards: nextCardsToFinish,
      remainingCooldown: nextCardRemainingCooldown,
      duration: smallestDuration,
    }
  }

  function cooldownEvent(nextCard: SimCard, nextCardCooldownEnd: number) {
    if (!nextCard.bash.cooldown) return; // No cooldown, no need to simulate

    // STAGE 1: Generate a cooldown event for the next card
    const e = generateCooldownEvent({
      baseDuration: nextCard.bash.cooldown,
      startTime: nextCard.simulation.nextCooldownTimestamp,
      modifiers: nextCard.simulation.modifiers,
    })

    // if (nextCard.name === "Halberdier") console.log("Pushed modifier - cards Halberdier", {
    //   name: nextCard.name,
    //   duration: e.duration,
    // })

    logCard({
      name: nextCard.name,
      nextCard: {
        card: nextCard,
        remainingCooldown: nextCard.simulation.remainingCooldown,
      },
      globalTime: globalTime,
      nextCardCooldownEnd,
      cooldownEvent: e
    })

    // Generate a cooldown event for this card
    addCooldownEvent(nextCard, e);

    // STAGE 2: Gather all mods triggered by this card
    forEachEffect(nextCard, (cardModifier) => {
      if (nextCard.simulation.count === 0) return
      if (cardModifier.trigger.type !== "cooldown") return;

      pushModifiers({
        sourceCard: nextCard,
        timestamp: nextCardCooldownEnd,
        indexes: cardModifier.trigger.playerTriggerIndexes,
        mutateDeck: playerSimCards,
        modifier: cardModifier
      });

      // pushModifiers({
      //   sourceCard: nextCard.nextCard,
      //   timestamp: thisCooldownTimetamp,
      //   indexes: cardModifier.trigger.opponentTriggerIndexes,
      //   mutateDeck: opponentSimCards,
      //   modifier: cardModifier
      // });
    })

    return {
      ...e,
      name: nextCard.name,
      remainingCooldown: nextCard.simulation.remainingCooldown,
    };
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
      console.log("Pushed modifier", {
        targetCard: targetCard.name,
        modifier: modifier.type,
        value: modifier.value,
        timestamp: timestamp,
      })
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
  function findNextReadyCards(cards: SimCard[]) {
    const smallestCooldown = Math.min(...cards.map(card => card.simulation.remainingCooldown));
    const nextCards = cards.filter(card => card.simulation.remainingCooldown === smallestCooldown);
    return { cards: nextCards, remainingCooldown: smallestCooldown };
  }

  type FindNextReadyCardsReturn = ReturnType<typeof findNextReadyCards>;

  function addCooldownEvent(card: SimCard, cooldownEvent: CooldownEvent) {
    // console.log("Pushed modifier - cards Halberdier 22", {
    //   name: card.name,
    //   duration: cooldownEvent.duration,
    // })
    card.simulation.remainingCooldown = cooldownEvent.duration; // Reset cooldown
    card.simulation.nextCooldownTimestamp += cooldownEvent.duration; // Update current time
    card.simulation.cooldownEvents.push(cooldownEvent);
    card.simulation.count += 1; // Increment play count

    // card.simulation.modifiers = [
    //   ...card.simulation.modifiers,
    //   // ...cooldownEvent.remainingModifiers
    // ];
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
